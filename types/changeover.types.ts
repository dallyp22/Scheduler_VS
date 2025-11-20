import type {
  ChangeoverComplexity,
  CleaningType,
} from './enums';

// Changeover Matrix Cell
export interface ChangeoverCell {
  id: string;
  fromSKUId: string;
  fromSKU: string; // SKU code for display
  toSKUId: string;
  toSKU: string; // SKU code for display

  // Time components (minutes)
  time: {
    drain: number;
    clean: number;
    setup: number;
    flush: number;
    total: number;
  };

  // Complexity and requirements
  complexity: ChangeoverComplexity;
  cleaningType: CleaningType;

  // Resources required
  requiredSkills: string[]; // Skill codes needed
  requiredTools: string[]; // Special tools/equipment
  laborCount: number;

  // Validation and history
  validation: {
    status: 'validated' | 'estimated' | 'needs_review';
    confidence: number; // 0-1
    lastActual?: number; // Last recorded actual time
    avgActualTime?: number; // Rolling average
    standardDeviation?: number;
  };

  // Conditional rules
  conditions?: Record<string, any>; // JSON for complex conditions
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
}

// Changeover Matrix display structure
export interface ChangeoverMatrix {
  // Visual matrix component
  display: {
    type: 'heatmap' | 'table' | 'flow';
    dimensions: {
      from: string[]; // SKU IDs
      to: string[]; // SKU IDs
    };
    cells: ChangeoverCell[][];
  };

  // Smart features
  intelligence: {
    autoCalculate: boolean; // ML-based predictions
    similarityDetection: boolean; // Find similar SKUs
    optimization: {
      algorithm: 'minimize_total' | 'minimize_max' | 'balance';
      constraints: ChangeoverConstraint[];
    };
  };

  // Real-time updates
  learning: {
    actualTimes: ActualChangeover[];
    confidence: number;
    lastUpdated: Date;
  };
}

// Changeover constraint
export interface ChangeoverConstraint {
  type: 'allergen_separation' | 'color_sequence' | 'temperature' | 'custom';
  fromSKU?: string;
  toSKU?: string;
  rule: string;
  penalty?: number;
}

// Actual changeover record for learning
export interface ActualChangeover {
  id: string;
  fromSKUId: string;
  toSKUId: string;
  actualMinutes: number;
  lineId: string;
  timestamp: Date;
  notes?: string;
  operatorId?: string;
  variance?: number; // Difference from expected
}

// Changeover update input
export interface ChangeoverUpdateInput {
  fromSKUId: string;
  toSKUId: string;
  times: {
    drain: number;
    clean: number;
    setup: number;
    flush: number;
  };
  complexity: ChangeoverComplexity;
  cleaningType: CleaningType;
  requiredSkills?: string[];
  requiredTools?: string[];
  laborCount?: number;
}

// Campaign (grouped production runs)
export interface Campaign {
  id: string;
  name: string;
  skus: string[]; // SKU IDs
  orders: string[]; // Order IDs
  estimatedTime: number; // hours
  changeoverSavings: number; // minutes saved vs individual runs
  recommendedSequence: string[]; // Optimal SKU sequence
  createdAt: Date;
}

// Optimal sequence suggestion
export interface OptimalSequence {
  sequence: string[]; // SKU IDs in order
  totalChangeoverTime: number; // minutes
  savings: number; // minutes saved vs current
  changeovers: Array<{
    from: string;
    to: string;
    time: number;
    complexity: ChangeoverComplexity;
  }>;
  confidence: number; // 0-1
}

// Changeover insights
export interface ChangeoverInsights {
  totalChangeovers: number;
  totalMinutes: number;
  averageTime: number;
  topPairs: Array<{
    from: string;
    to: string;
    count: number;
    avgTime: number;
  }>;
  complexityBreakdown: Record<ChangeoverComplexity, number>;
  trends: Array<{
    date: Date;
    count: number;
    totalMinutes: number;
  }>;
}

