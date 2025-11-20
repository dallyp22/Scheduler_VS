import type {
  ProductFamily,
  Priority,
  QualityGrade,
  PackageSize,
  Viscosity,
  Temperature,
  PackagingType,
  CleaningCategory,
  SKUStatus,
} from './enums';

// SKU Interface - Complete product definition
export interface SKU {
  id: string;
  code: string; // Unique SKU identifier
  name: string;
  description?: string;
  family: ProductFamily;
  category: string;
  subCategory?: string;

  // Production attributes
  production: {
    standardRate: number; // units per hour
    minBatch: number;
    maxBatch: number;
    setupTime: number; // minutes
    cycleTime: number; // seconds per unit
    yieldPercentage: number; // typical yield %
    qualityGrade: QualityGrade;
  };

  // Physical characteristics (for changeover calculation)
  attributes: {
    color?: string;
    flavor?: string;
    size?: PackageSize;
    viscosity?: Viscosity;
    allergens?: string[];
    material?: string;
    temperature?: Temperature;
    packaging?: PackagingType;
    weight?: number; // grams
    volume?: number; // milliliters
  };

  // Line compatibility and constraints
  compatibility: {
    allowedLines: string[]; // Which lines can run this SKU
    lineEfficiency: Record<string, number>; // Efficiency per line (0-100%)
    preferredLines: string[]; // Optimal lines for this SKU
    requiredCertifications?: string[]; // e.g., 'organic', 'kosher', 'halal'
    requiredEquipment?: string[]; // Special equipment needs
  };

  // Planning and inventory parameters
  planning: {
    leadTime: number; // hours
    safetyStock: number;
    reorderPoint: number;
    moq?: number; // minimum order quantity
    maxInventoryDays?: number;
    shelfLife?: number; // days
    preferredSequence?: string[]; // SKUs that should follow this one
    cleaningRequirement: CleaningCategory;
  };

  // Cost and profitability
  financial: {
    unitCost: number;
    sellingPrice: number;
    margin: number;
    priority: Priority;
  };

  status: SKUStatus;
  seasonality?: {
    peakMonths: number[]; // 1-12
    demandMultiplier: Record<number, number>; // month -> multiplier
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  version: number; // For tracking changes
  metadata?: Record<string, any>;
}

// Product Family definition
export interface ProductFamilyInfo {
  id: string;
  code: ProductFamily;
  name: string;
  description?: string;
  color: string; // Hex color for UI
  changeoverTier: number; // 1-5, for complexity
  createdAt: Date;
  updatedAt: Date;
}

// Line compatibility details
export interface LineCompatibility {
  id: string;
  lineId: string;
  skuId: string;
  actualRate: number; // May differ from SKU standard
  efficiency: number; // 0-1
  setupTime: number; // minutes
  minRunTime?: number; // Minimum economical run
  maxRunTime?: number; // Maximum before maintenance
  preferredSequence?: number; // Preferred order in schedule
  restrictions?: Record<string, any>; // Time/shift restrictions
  lastRun?: Date;
  totalRuns: number;
  avgOEE?: number;
}

// SKU creation/update input
export interface SKUInput {
  code: string;
  name: string;
  description?: string;
  family: ProductFamily;
  category: string;
  production: SKU['production'];
  attributes: SKU['attributes'];
  planning: SKU['planning'];
  financial: SKU['financial'];
  status?: SKUStatus;
}

// SKU filter for queries
export interface SKUFilter {
  family?: ProductFamily;
  active?: boolean;
  search?: string;
  category?: string;
  packaging?: PackagingType;
}

