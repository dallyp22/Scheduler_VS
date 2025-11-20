import type { OrderStatus, BlockStatus, ChangeoverComplexity } from './enums';
import type { SKU } from './sku.types';
import type { ProductionLine } from './production.types';
import type { ChangeoverCell } from './changeover.types';

// Production Order
export interface ProductionOrder {
  id: string;
  orderNumber: string; // Unique order identifier
  sku: SKU;
  skuId: string;
  quantity: number;
  quantityUnit: string; // EA, CS, KG, etc
  priority: number; // 1-10 scale
  dueDate: Date;
  customerName?: string;
  customerPO?: string;
  status: OrderStatus;

  // Planning fields
  earliestStart?: Date;
  latestStart?: Date;
  frozen: boolean; // Cannot be moved

  // Schedule blocks for this order
  scheduleBlocks?: ScheduleBlock[];

  createdAt: Date;
  updatedAt: Date;
}

// Schedule Block - A production run on a line
export interface ScheduleBlock {
  id: string;
  orderId: string;
  order?: ProductionOrder;
  lineId: string;
  line?: ProductionLine;

  // Timing
  startTime: Date;
  endTime: Date;
  setupStart?: Date; // Changeover start
  productionStart?: Date; // Actual production start
  duration: number; // minutes

  // Changeover tracking
  changeoverType?: ChangeoverComplexity;
  changeoverMinutes?: number;
  previousSKU?: string; // SKU code of previous block
  previousSKUId?: string;

  status: BlockStatus;
  actualStart?: Date;
  actualEnd?: Date;
  actualQuantity?: number;

  // Performance
  targetRate?: number;
  actualRate?: number;
  oee?: number;

  // Visual properties (for UI)
  color?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Complete Schedule for a time period
export interface Schedule {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'archived';

  // All blocks in this schedule
  blocks: ScheduleBlock[];

  // Metrics
  metrics: ScheduleMetrics;

  // Optimization info
  optimization?: {
    algorithm: string;
    runTime: number; // seconds
    objective: string;
    confidence: number; // 0-1
    alternativeScenarios?: ScenarioComparison[];
  };

  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
}

// Schedule Metrics
export interface ScheduleMetrics {
  // Utilization
  lineUtilization: Record<string, number>; // lineId -> percentage
  avgUtilization: number;

  // Changeovers
  totalChangeovers: number;
  totalChangeoverMinutes: number;
  avgChangeoverMinutes: number;
  changeoversByComplexity: Record<ChangeoverComplexity, number>;

  // Production
  totalProductionHours: number;
  totalUnits: number;
  scheduledOrders: number;
  completedOrders: number;

  // Performance
  onTimePercentage: number; // Orders on time
  scheduleAdherence: number; // Actual vs planned
  avgOEE: number;

  // Efficiency
  makespan: number; // Total time from first to last block
  throughput: number; // units per hour
  bottlenecks: string[]; // Line IDs with bottlenecks
}

// Timeline Block for visualization
export interface TimelineBlock extends ScheduleBlock {
  // Additional properties for timeline visualization
  lane: number; // Which production line
  overlapping?: boolean;
  draggable: boolean;
  resizable: boolean;
  conflicts?: string[]; // Conflicting block IDs
}

// Schedule Constraint
export interface ScheduleConstraint {
  id: string;
  type: 'time_window' | 'sequence' | 'resource' | 'custom';
  description: string;
  orderId?: string;
  lineId?: string;
  timeWindow?: {
    start: Date;
    end: Date;
  };
  priority: number; // Higher = more important
  hardConstraint: boolean; // Must be satisfied vs nice to have
}

// Optimization Request
export interface ScheduleOptimizationRequest {
  orders: ProductionOrder[];
  resources: ProductionLine[];
  constraints: ScheduleConstraint[];
  changeoverMatrix: ChangeoverCell[];
  optimizationGoal: 'minimize_changeover' | 'maximize_throughput' | 'balance_lines' | 'minimize_makespan';
  weights?: {
    changeover: number;
    throughput: number;
    balance: number;
    dueDate: number;
  };
  timeHorizon: {
    start: Date;
    end: Date;
  };
}

// Optimization Result
export interface ScheduleOptimizationResult {
  schedule: Schedule;
  metrics: ScheduleMetrics;
  alternativeScenarios?: Schedule[];
  confidence: number; // 0-1
  computeTime: number; // seconds
  iterations?: number;
  objective: {
    value: number;
    components: Record<string, number>;
  };
}

// Scenario Comparison
export interface ScenarioComparison {
  id: string;
  name: string;
  schedule: Schedule;
  metrics: ScheduleMetrics;
  comparisonToBaseline: {
    changeoverSavings: number; // minutes
    utilizationDelta: number; // percentage points
    makespan: number; // minutes
    onTimeDelta: number; // percentage points
  };
}

// Schedule Update (for drag-drop operations)
export interface ScheduleUpdate {
  blockId: string;
  newStartTime?: Date;
  newEndTime?: Date;
  newLineId?: string;
  reason?: string;
}

// Schedule validation result
export interface ScheduleValidation {
  valid: boolean;
  errors: Array<{
    blockId: string;
    type: 'overlap' | 'constraint' | 'capacity' | 'changeover';
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: Array<{
    blockId: string;
    message: string;
  }>;
}

// KPI for dashboard
export interface KPI {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: number; // percentage change
  target?: number;
  status: 'good' | 'warning' | 'critical';
  sparkline?: number[]; // Historical values for mini chart
}

