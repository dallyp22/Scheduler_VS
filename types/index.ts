// Common utility types

// Pagination
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}

// Date range
export interface DateRange {
  start: Date;
  end: Date;
}

// Sort options
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// Filter base
export interface BaseFilter {
  search?: string;
  dateRange?: DateRange;
  sort?: SortOptions;
  pagination?: {
    page: number;
    pageSize: number;
  };
}

// API Response wrapper
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: Record<string, any>;
}

// Audit log entry
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// User session/presence
export interface UserPresence {
  userId: string;
  userName: string;
  avatar?: string;
  status: 'active' | 'idle' | 'offline';
  lastSeen: Date;
  currentPage?: string;
  editing?: {
    entityType: string;
    entityId: string;
  };
}

// Notification
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
  userId: string;
}

// Validation error
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Re-export all types
export * from './enums';
export * from './sku.types';
export * from './changeover.types';
export * from './production.types';
export * from './schedule.types';

