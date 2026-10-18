# ErpCrm Web - Frontend (Next.js 15)

Multi-tenant ERP + CRM platform frontend built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Supabase.

## Project Structure

```
src/
├── app/                     # Next.js App Router pages and layouts
│   ├── (auth)/              # Login, signup, forgot password (public routes)
│   ├── platform/            # Platform admin area (super admin only)
│   └── (dashboard)/         # Tenant user dashboard (authenticated)
│       ├── crm/             # CRM module
│       ├── sales/           # Sales module
│       ├── inventory/       # Inventory module
│       ├── finance/         # Finance module
│       └── settings/        # User settings
├── components/
│   ├── ui/                  # shadcn/ui components (Button, Dialog, etc.)
│   ├── layout/              # Sidebar, TopBar, ModuleGuard
│   └── common/              # DataTable, PageHeader, ConfirmDialog
├── hooks/                   # useAuth, useTenant, usePermissions
├── lib/                     # Utilities (API clients, Supabase instance)
├── store/                   # Zustand stores (auth, tenant, ui state)
└── types/                   # TypeScript API models and interfaces
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** Zustand (client) + TanStack Query (server)
- **Validation:** Zod
- **HTTP:** Axios
- **Database:** Supabase (PostgreSQL)
- **API Client:** @supabase/supabase-js

## Prerequisites

- **Node.js** 18+ and **npm** / **yarn** / **pnpm**
- **Supabase project** created and configured
- **Backend API** running on `http://localhost:5000`

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://lbxkaglhusuhiflnupvv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_kdYYaRGsZnwkPBLEjsLw-A_or3kC...
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Important:** `NEXT_PUBLIC_*` variables are exposed to the browser. Never put secrets here.

### 3. Run Development Server

```bash
npm run dev
```

Opens at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Authentication Flow

### Platform Admin Login

1. User navigates to `/auth/login?role=admin`
2. Submits `POST /api/platform/auth/login` (via backend)
3. Receives JWT + refresh token
4. Stores in secure HTTP-only cookie (secure) or localStorage (fallback)
5. Redirected to `/platform/dashboard`

### Tenant User Login

1. User navigates to `/auth/login`
2. Submits `POST /api/v1/auth/login` (via backend)
3. JWT includes `tenant_id`, `company_id`, `role`
4. Stored in localStorage or secure cookie
5. Redirected to `/dashboard`

### JWT Refresh

- Access token: 15 minutes
- Refresh token: 7 days
- Automatically refresh on token expiry via `useAuth` hook

## Project Structure

### Pages (App Router)

```
(auth)/
  login/page.tsx              # Login form (email + password)
  signup/page.tsx             # Signup form (new tenant)
  forgot-password/page.tsx    # Forgot password flow
  reset-password/page.tsx     # Reset password from email link

platform/
  layout.tsx                  # Platform admin layout
  dashboard/page.tsx          # Platform admin home
  tenants/page.tsx            # Manage tenants
  [tenantId]/page.tsx         # Tenant details

(dashboard)/
  layout.tsx                  # Tenant user layout (sidebar + topbar)
  page.tsx                    # Dashboard home
  crm/
    contacts/page.tsx         # Contact list
    [contactId]/page.tsx      # Contact detail
    deals/page.tsx            # Deal management
  sales/                      # Sales module
  inventory/                  # Inventory module
  finance/                    # Finance module
  settings/
    profile/page.tsx          # User profile
    company/page.tsx          # Company settings
```

### Hooks

```typescript
// useAuth — Login, logout, check auth status
const { user, token, login, logout, isLoading } = useAuth();

// useTenant — Get current tenant + company
const { tenant, company, tenants } = useTenant();

// usePermissions — Check if user can access module/action
const { can } = usePermissions();
if (!can("CRM", "read")) return <Unauthorized />;
```

### API Clients

```typescript
// lib/api/platform.ts
const platformApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/platform`,
  headers: { Authorization: `Bearer ${token}` }
});

// lib/api/tenant.ts
const tenantApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/v1`,
  headers: { Authorization: `Bearer ${token}` }
});
```

### Zustand Stores

```typescript
// store/auth.ts
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));

// store/tenant.ts
export const useTenantStore = create((set) => ({
  currentTenant: null,
  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
}));
```

### Components

**UI Components** (shadcn/ui):
- Button, Input, Dialog, Dropdown, Card, Table, Tabs, etc.

**Layout Components**:
- Sidebar — Module-gated navigation
- TopBar — User menu, notifications
- ModuleGuard — Wraps routes to check module access

**Common Components**:
- DataTable — Paginated, filterable table
- PageHeader — Title + breadcrumbs
- ConfirmDialog — Delete/action confirmation

## Forms & Validation

Use **Zod** for runtime validation:

```typescript
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginInput = z.infer<typeof loginSchema>;
```

Use **React Hook Form** + Zod for forms:

```typescript
const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});
```

## State Management

### Client State (Zustand)

```typescript
const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

### Server State (TanStack Query)

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["companies"],
  queryFn: () => tenantApi.get("/companies"),
});
```

## Module Gating

Every page checks if the user's tenant has module access:

```typescript
// pages/crm/contacts/page.tsx
import { ModuleGuard } from "@/components/layout/ModuleGuard";

export default function ContactsPage() {
  return (
    <ModuleGuard module="CRM">
      <h1>Contacts</h1>
      {/* ... */}
    </ModuleGuard>
  );
}
```

`ModuleGuard` checks user's JWT `module_id` claim and returns "Module not enabled" if access is denied.

## Deployment

### Vercel

1. Push code to GitHub
2. Import repo in Vercel dashboard
3. Set environment variables in Vercel project settings
4. Deploy

### Self-Hosted

1. Build: `npm run build`
2. Start: `npm start`
3. Set `NODE_ENV=production`

## Phase 1 Deliverables

- [x] Next.js setup with TypeScript
- [x] Tailwind CSS + shadcn/ui configured
- [ ] Auth pages (login, signup)
- [ ] Platform admin layout + pages
- [ ] Tenant dashboard layout
- [ ] useAuth, useTenant, usePermissions hooks
- [ ] API client setup
- [ ] Module guard implementation

## Debugging

### Enable Next.js Debug Logging

```bash
DEBUG=next:* npm run dev
```

### Inspect Supabase Connection

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, key);
const { data, error } = await supabase.auth.getSession();
console.log({ data, error });
```

## Performance Tips

1. **Code splitting:** Next.js auto-splits by route
2. **Image optimization:** Use `<Image>` from next/image
3. **Prefetching:** Use `prefetchQuery` from TanStack Query
4. **Memoization:** `React.memo()` for expensive components
5. **Lazy loading:** Dynamic imports for heavy components

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Status:** Phase 1 setup in progress
