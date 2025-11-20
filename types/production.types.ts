// Production Line definition
export interface ProductionLine {
  id: string;
  code: string; // Short code (e.g., "L1", "L2")
  name: string;
  description?: string;
  
  // Capacity and performance
  capacity: {
    maxRate: number; // units per hour
    efficiency: number; // typical efficiency (0-1)
    availability: number; // typical availability (0-1)
    oeeTarget: number; // OEE target (0-1)
  };

  // Technical specifications
  specifications: {
    capabilities: string[]; // What this line can do
    restrictions: string[]; // What it cannot do
    certifications: string[]; // Quality certifications
    equipment: string[]; // Special equipment available
  };

  // Operating parameters
  operating: {
    shiftPattern: string; // e.g., "24/7", "2-shift", "day-only"
    crewSize: number;
    skillRequirements: string[];
  };

  // Status and maintenance
  status: 'active' | 'maintenance' | 'offline' | 'limited';
  maintenanceSchedule?: Array<{
    startTime: Date;
    endTime: Date;
    type: 'preventive' | 'corrective' | 'upgrade';
  }>;

  // Metrics
  metrics: {
    currentOEE?: number;
    uptime: number; // percentage
    lastDowntime?: Date;
    totalRunHours: number;
  };

  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

// Resource availability
export interface ResourceAvailability {
  resourceId: string;
  resourceType: 'line' | 'crew' | 'equipment' | 'material';
  availableFrom: Date;
  availableUntil: Date;
  capacity: number;
  restrictions?: Record<string, any>;
}

// Shift definition
export interface Shift {
  id: string;
  name: string; // e.g., "Day Shift", "Night Shift"
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  breakTimes?: Array<{
    startTime: string;
    duration: number; // minutes
  }>;
}

// Buffer (intermediate storage between processes)
export interface Buffer {
  id: string;
  name: string;
  location: string;
  capacity: number; // units
  currentLevel: number; // units
  minLevel: number; // safety level
  maxLevel: number;
  productType?: string; // What's currently stored
  status: 'normal' | 'low' | 'high' | 'critical';
  lastUpdated: Date;
}

// Bottleneck analysis
export interface Bottleneck {
  id: string;
  type: 'line' | 'buffer' | 'changeover' | 'resource';
  location: string; // Line ID or buffer ID
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: {
    delayMinutes: number;
    affectedOrders: string[];
    throughputReduction: number; // percentage
  };
  rootCause: string;
  recommendation: string;
  detectedAt: Date;
}

// Material flow for visualization
export interface FlowNode {
  id: string;
  type: 'production' | 'buffer' | 'packaging' | 'warehouse';
  name: string;
  capacity?: number;
  currentThroughput?: number;
}

export interface FlowEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  flowRate: number; // units per hour
  material: string; // SKU code or material type
  status: 'normal' | 'congested' | 'blocked';
}

export interface FlowVisualization {
  nodes: FlowNode[];
  edges: FlowEdge[];
  metrics: {
    totalThroughput: number;
    bottlenecks: Bottleneck[];
    bufferLevels: Array<{
      bufferId: string;
      level: number;
      status: Buffer['status'];
    }>;
  };
  animations?: FlowAnimation[];
}

export interface FlowAnimation {
  id: string;
  edgeId: string;
  startTime: Date;
  duration: number; // seconds
  particleCount: number;
}

