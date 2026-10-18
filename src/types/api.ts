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
  notes?: string
  tags?: string
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
  jobTitle?: string
  status: string
  source?: string
  estimatedValue?: number
  assignedToUserId?: string
  notes?: string
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
  actualCloseDate?: string
  stage?: string
  assignedToUserId?: string
  notes?: string
  lostReason?: string
  createdAt: string
}

export interface Activity {
  id: string
  type: string
  subject: string
  description?: string
  dueDate?: string
  isCompleted: boolean
  completedAt?: string
  assignedToUserId?: string
  contactId?: string
  leadId?: string
  opportunityId?: string
  createdAt: string
}

// Inventory
export interface Product {
  id: string
  name: string
  code?: string
  sku?: string
  barcode?: string
  description?: string
  categoryId?: string
  categoryName?: string
  unitId?: string
  unitName?: string
  costPrice: number
  salePrice: number
  minimumStock?: number
  maximumStock?: number
  isStockable: boolean
  isActive: boolean
  imageUrl?: string
  totalStock?: number
  createdAt: string
}

export interface ProductCategory {
  id: string
  name: string
  code?: string
  description?: string
  parentId?: string
  createdAt: string
}

export interface Warehouse {
  id: string
  companyId: string
  name: string
  code?: string
  address?: string
  isActive: boolean
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  warehouseId: string
  warehouseName?: string
  movementType: string
  quantity: number
  unitCost: number
  referenceType?: string
  referenceNumber?: string
  notes?: string
  createdAt: string
}

// Sales
export interface SalesOrderLine {
  id: string
  productId: string
  productName: string
  productCode?: string
  quantity: number
  unitPrice: number
  discountPercent: number
  taxPercent: number
  lineTotal: number
}

export interface SalesOrder {
  id: string
  orderNumber: string
  orderDate: string
  contactId?: string
  customerName?: string
  customerEmail?: string
  status: string
  subTotal: number
  taxAmount: number
  discountAmount: number
  total: number
  currency: string
  notes?: string
  expectedDeliveryDate?: string
  lines: SalesOrderLine[]
  createdAt: string
}

export interface SalesInvoice {
  id: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customerName?: string
  customerEmail?: string
  status: string
  subTotal: number
  taxAmount: number
  total: number
  paidAmount: number
  balanceDue: number
  currency: string
  createdAt: string
}

// HR
export interface Employee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  fullName: string
  email?: string
  phone?: string
  hireDate: string
  departmentId?: string
  departmentName?: string
  designationId?: string
  designationName?: string
  status: string
  basicSalary?: number
  avatarUrl?: string
  createdAt: string
}

export interface Department {
  id: string
  companyId: string
  name: string
  code?: string
  managerId?: string
  isActive: boolean
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName?: string
  leaveTypeId: string
  leaveTypeName?: string
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: string
  createdAt: string
}

// Finance
export interface Account {
  id: string
  companyId: string
  accountCode: string
  accountName: string
  accountType: string
  parentId?: string
  balance: number
  isActive: boolean
  isSystemAccount: boolean
}

export interface JournalEntry {
  id: string
  entryNumber: string
  entryDate: string
  description: string
  referenceType?: string
  referenceNumber?: string
  status: string
  currency: string
  createdAt: string
}

// Projects
export interface Project {
  id: string
  companyId: string
  name: string
  code?: string
  description?: string
  startDate?: string
  endDate?: string
  status: string
  budget?: number
  managerId?: string
  isActive: boolean
  createdAt: string
}

export interface ProjectTask {
  id: string
  projectId: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  completedAt?: string
  assignedToUserId?: string
  estimatedHours?: number
  actualHours?: number
  createdAt: string
}
