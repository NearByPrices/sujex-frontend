export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  errors: string[]
  pagination?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Auth
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: UserInfo
}

export interface UserInfo {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  isPlatformAdmin: boolean
  tenantId?: string
}

// CRM
export interface Contact {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email?: string
  phone?: string
  mobile?: string
  jobTitle?: string
  department?: string
  accountName?: string
  isActive: boolean
  companyId?: string
  createdAt: string
}

export interface Lead {
  id: string
  title: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  status: string
  source?: string
  estimatedValue?: number
  assignedToUserId?: string
  tags?: string
  followUpDate?: string
  convertedOpportunityId?: string
  createdAt: string
}

export interface Opportunity {
  id: string
  title: string
  contactId?: string
  leadId?: string
  status: string
  expectedValue?: number
  actualValue?: number
  probability: number
  expectedCloseDate?: string
  stage?: string
  assignedToUserId?: string
  createdAt: string
}

// Inventory
export interface Product {
  id: string
  name: string
  code?: string
  sku?: string
  categoryId?: string
  categoryName?: string
  unitId?: string
  unitSymbol?: string
  costPrice: number
  salePrice: number
  isActive: boolean
  isService: boolean
  tags?: string
  createdAt: string
}

export interface Warehouse {
  id: string
  name: string
  code?: string
  branchId?: string
  address?: string
  isActive: boolean
  createdAt: string
}

export interface StockLevel {
  productId: string
  productName: string
  warehouseId: string
  warehouseName: string
  quantityOnHand: number
  quantityReserved: number
  quantityAvailable: number
}

// Sales
export interface SalesOrderLine {
  id: string
  productId?: string
  description: string
  quantity: number
  unitPrice: number
  discountPercent: number
  taxPercent: number
  lineTotal: number
  sortOrder: number
}

export interface SalesOrder {
  id: string
  orderNumber: string
  contactId?: string
  companyId?: string
  status: string
  orderDate: string
  deliveryDate?: string
  subTotal: number
  discountAmount: number
  taxAmount: number
  totalAmount: number
  notes?: string
  lines: SalesOrderLine[]
  createdAt: string
}
