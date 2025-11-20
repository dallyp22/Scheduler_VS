// Central export file for all mock data generators

export * from './skus.mock';
export * from './lines.mock';
export * from './orders.mock';
export * from './changeover-matrix.mock';
export * from './schedule.mock';

// Re-export common functions for convenience
import { getMockSKUs } from './skus.mock';
import { getMockLines } from './lines.mock';
import { getMockOrders } from './orders.mock';
import { getMockChangeoverMatrix } from './changeover-matrix.mock';
import { getMockSchedule } from './schedule.mock';

export const getAllMockData = () => ({
  skus: getMockSKUs(),
  lines: getMockLines(),
  orders: getMockOrders(),
  changeoverMatrix: getMockChangeoverMatrix(),
  schedule: getMockSchedule(),
});

