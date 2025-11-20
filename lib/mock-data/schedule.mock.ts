import type { Schedule, ScheduleBlock, ScheduleMetrics } from '@/types';
import { BlockStatus, ChangeoverComplexity } from '@/types/enums';
import { getMockOrders, getUpcomingOrders } from './orders.mock';
import { getMockLines } from './lines.mock';
import { getMockChangeoverCell } from './changeover-matrix.mock';

// Generate schedule blocks
export function generateScheduleBlocks(startDate: Date, endDate: Date): ScheduleBlock[] {
  const blocks: ScheduleBlock[] = [];
  const orders = getUpcomingOrders(14); // Get orders for next 2 weeks
  const lines = getMockLines().filter(line => line.status === 'active');
  
  let blockIdCounter = 1;
  let currentTime = new Date(startDate);

  // Distribute orders across lines
  const lineQueues: Record<string, typeof orders> = {};
  lines.forEach(line => {
    lineQueues[line.id] = [];
  });

  // Assign orders to compatible lines
  orders.forEach(order => {
    const compatibleLines = order.sku.compatibility.allowedLines;
    const availableLine = lines.find(line => compatibleLines.includes(line.id));
    
    if (availableLine) {
      lineQueues[availableLine.id].push(order);
    }
  });

  // Create schedule blocks for each line
  lines.forEach(line => {
    let lineCurrentTime = new Date(startDate);
    let previousSKU: string | undefined;

    lineQueues[line.id].forEach((order, index) => {
      // Calculate changeover time if needed
      let changeoverMinutes = 0;
      let changeoverComplexity: ChangeoverComplexity | undefined;

      if (previousSKU && previousSKU !== order.skuId) {
        const changeoverCell = getMockChangeoverCell(previousSKU, order.skuId);
        if (changeoverCell) {
          changeoverMinutes = changeoverCell.time.total;
          changeoverComplexity = changeoverCell.complexity;
        } else {
          changeoverMinutes = 20; // Default changeover time
          changeoverComplexity = ChangeoverComplexity.MODERATE;
        }
      }

      // Calculate production time
      const productionRate = order.sku.production.standardRate;
      const productionMinutes = Math.ceil((order.quantity / productionRate) * 60);
      
      const setupStart = new Date(lineCurrentTime);
      const productionStart = new Date(lineCurrentTime.getTime() + changeoverMinutes * 60 * 1000);
      const endTime = new Date(productionStart.getTime() + productionMinutes * 60 * 1000);

      // Determine status
      const now = new Date();
      let status: BlockStatus;
      if (endTime < now) {
        status = BlockStatus.COMPLETED;
      } else if (productionStart <= now && endTime > now) {
        status = BlockStatus.RUNNING;
      } else if (setupStart <= now && productionStart > now) {
        status = BlockStatus.CHANGEOVER;
      } else if (setupStart < new Date(now.getTime() + 2 * 60 * 60 * 1000)) {
        status = BlockStatus.READY;
      } else {
        status = BlockStatus.PLANNED;
      }

      blocks.push({
        id: `block-${blockIdCounter++}`,
        orderId: order.id,
        order,
        lineId: line.id,
        line,
        startTime: setupStart,
        endTime,
        setupStart,
        productionStart,
        duration: changeoverMinutes + productionMinutes,
        changeoverType: changeoverComplexity,
        changeoverMinutes,
        previousSKU: previousSKU,
        previousSKUId: previousSKU,
        status,
        targetRate: productionRate,
        actualRate: status === BlockStatus.COMPLETED 
          ? productionRate * (0.85 + Math.random() * 0.15)
          : undefined,
        oee: status === BlockStatus.COMPLETED
          ? 0.70 + Math.random() * 0.25
          : undefined,
        color: getFamilyColor(order.sku.family),
      });

      lineCurrentTime = endTime;
      previousSKU = order.skuId;
    });
  });

  return blocks.filter(block => block.startTime >= startDate && block.startTime <= endDate);
}

function getFamilyColor(family: string): string {
  const colors: Record<string, string> = {
    A: '#FF6B6B',
    B: '#4ECDC4',
    C: '#45B7D1',
    D: '#F7DC6F',
    E: '#BB8FCE',
    F: '#F8B4D9',
    G: '#FFA07A',
    H: '#87CEEB',
    I: '#D2691E',
    J: '#FF69B4',
  };
  return colors[family] || '#999999';
}

// Calculate schedule metrics
function calculateScheduleMetrics(blocks: ScheduleBlock[]): ScheduleMetrics {
  const lines = getMockLines();
  const lineUtilization: Record<string, number> = {};

  lines.forEach(line => {
    const lineBlocks = blocks.filter(b => b.lineId === line.id);
    const totalProductionMinutes = lineBlocks.reduce((sum, b) => 
      sum + (b.duration - (b.changeoverMinutes || 0)), 0
    );
    const totalAvailableMinutes = 24 * 60; // 24 hours
    lineUtilization[line.id] = (totalProductionMinutes / totalAvailableMinutes) * 100;
  });

  const avgUtilization = Object.values(lineUtilization).reduce((a, b) => a + b, 0) / lines.length;

  const totalChangeovers = blocks.filter(b => b.changeoverMinutes && b.changeoverMinutes > 0).length;
  const totalChangeoverMinutes = blocks.reduce((sum, b) => sum + (b.changeoverMinutes || 0), 0);
  const avgChangeoverMinutes = totalChangeovers > 0 ? totalChangeoverMinutes / totalChangeovers : 0;

  const changeoversByComplexity: Record<ChangeoverComplexity, number> = {
    [ChangeoverComplexity.SIMPLE]: 0,
    [ChangeoverComplexity.MODERATE]: 0,
    [ChangeoverComplexity.COMPLEX]: 0,
    [ChangeoverComplexity.CRITICAL]: 0,
  };

  blocks.forEach(block => {
    if (block.changeoverType) {
      changeoversByComplexity[block.changeoverType]++;
    }
  });

  const totalProductionHours = blocks.reduce((sum, b) => 
    sum + ((b.duration - (b.changeoverMinutes || 0)) / 60), 0
  );

  const totalUnits = blocks.reduce((sum, b) => 
    sum + (b.order?.quantity || 0), 0
  );

  const completedBlocks = blocks.filter(b => b.status === BlockStatus.COMPLETED);
  const onTimeBlocks = completedBlocks.filter(b => 
    b.order && b.endTime <= b.order.dueDate
  );

  return {
    lineUtilization,
    avgUtilization,
    totalChangeovers,
    totalChangeoverMinutes,
    avgChangeoverMinutes,
    changeoversByComplexity,
    totalProductionHours,
    totalUnits,
    scheduledOrders: new Set(blocks.map(b => b.orderId)).size,
    completedOrders: new Set(completedBlocks.map(b => b.orderId)).size,
    onTimePercentage: completedBlocks.length > 0 
      ? (onTimeBlocks.length / completedBlocks.length) * 100
      : 0,
    scheduleAdherence: completedBlocks.length > 0
      ? completedBlocks.filter(b => b.actualRate && b.targetRate && 
          (b.actualRate / b.targetRate) > 0.90).length / completedBlocks.length * 100
      : 0,
    avgOEE: completedBlocks.length > 0
      ? completedBlocks.reduce((sum, b) => sum + (b.oee || 0), 0) / completedBlocks.length
      : 0,
    makespan: blocks.length > 0
      ? (blocks[blocks.length - 1].endTime.getTime() - blocks[0].startTime.getTime()) / (60 * 1000)
      : 0,
    throughput: totalProductionHours > 0 ? totalUnits / totalProductionHours : 0,
    bottlenecks: Object.entries(lineUtilization)
      .filter(([_, util]) => util > 95)
      .map(([lineId]) => lineId),
  };
}

// Generate complete schedule
export function generateMockSchedule(): Schedule {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 7); // 7-day schedule

  const blocks = generateScheduleBlocks(startDate, endDate);
  const metrics = calculateScheduleMetrics(blocks);

  return {
    id: 'schedule-1',
    name: 'Weekly Production Schedule',
    startDate,
    endDate,
    status: 'active',
    blocks,
    metrics,
    optimization: {
      algorithm: 'CP-SAT',
      runTime: 4.5,
      objective: 'minimize_changeover',
      confidence: 0.89,
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    createdBy: 'system',
    lastModifiedBy: 'admin',
    version: 1,
  };
}

export function getMockSchedule(): Schedule {
  return generateMockSchedule();
}

export function getMockScheduleBlocks(startDate?: Date, endDate?: Date): ScheduleBlock[] {
  const start = startDate || new Date();
  const end = endDate || new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  return generateScheduleBlocks(start, end);
}

export function getMockScheduleBlocksByLine(lineId: string): ScheduleBlock[] {
  return generateMockSchedule().blocks.filter(block => block.lineId === lineId);
}

export function getMockScheduleBlockById(blockId: string): ScheduleBlock | undefined {
  return generateMockSchedule().blocks.find(block => block.id === blockId);
}

