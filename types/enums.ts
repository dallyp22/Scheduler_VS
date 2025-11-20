// Enums for the AIPS system

export enum CleaningCategory {
  A = 'A', // No cleaning required (same product)
  B = 'B', // Basic rinse
  C = 'C', // Standard wash
  D = 'D', // Deep clean/allergen
}

export enum ChangeoverComplexity {
  SIMPLE = 'SIMPLE',     // < 15 min
  MODERATE = 'MODERATE', // 15-30 min
  COMPLEX = 'COMPLEX',   // 30-60 min
  CRITICAL = 'CRITICAL', // > 60 min
}

export enum CleaningType {
  NONE = 'NONE',
  RINSE = 'RINSE',
  WASH = 'WASH',
  SANITIZE = 'SANITIZE',
  ALLERGEN_CLEAN = 'ALLERGEN_CLEAN',
  FULL_BREAKDOWN = 'FULL_BREAKDOWN',
}

export enum OrderStatus {
  PLANNED = 'PLANNED',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BlockStatus {
  PLANNED = 'PLANNED',
  READY = 'READY',
  CHANGEOVER = 'CHANGEOVER',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
}

export enum SKUStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
  DEVELOPMENT = 'DEVELOPMENT',
  SEASONAL = 'SEASONAL',
}

export type ProductFamily = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export type Priority = 'high' | 'medium' | 'low';

export type QualityGrade = 'premium' | 'standard' | 'economy';

export type PackageSize = 'small' | 'medium' | 'large' | 'xlarge';

export type Viscosity = 'low' | 'medium' | 'high';

export type Temperature = 'ambient' | 'chilled' | 'frozen';

export type PackagingType = 'bottle' | 'can' | 'pouch' | 'box' | 'bulk';

