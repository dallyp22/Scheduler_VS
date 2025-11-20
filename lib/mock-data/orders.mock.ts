import type { ProductionOrder } from '@/types';
import { OrderStatus } from '@/types/enums';
import { getMockSKUs } from './skus.mock';

// Generate production orders
export function generateMockOrders(count: number = 50): ProductionOrder[] {
  const orders: ProductionOrder[] = [];
  const skus = getMockSKUs();
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const sku = skus[Math.floor(Math.random() * skus.length)];
    const daysFromNow = Math.floor(Math.random() * 21) - 7; // -7 to +14 days
    const dueDate = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    
    const quantity = Math.floor(Math.random() * 10000) + 1000;
    const priority = Math.floor(Math.random() * 10) + 1;
    
    // Status based on due date
    let status: OrderStatus;
    if (daysFromNow < -2) {
      status = Math.random() > 0.3 ? OrderStatus.COMPLETED : OrderStatus.CANCELLED;
    } else if (daysFromNow < 0) {
      status = Math.random() > 0.5 ? OrderStatus.IN_PROGRESS : OrderStatus.SCHEDULED;
    } else if (daysFromNow < 3) {
      status = Math.random() > 0.7 ? OrderStatus.IN_PROGRESS : OrderStatus.SCHEDULED;
    } else if (daysFromNow < 7) {
      status = OrderStatus.SCHEDULED;
    } else {
      status = OrderStatus.PLANNED;
    }

    const earliestStart = new Date(dueDate.getTime() - sku.planning.leadTime * 60 * 60 * 1000);
    const latestStart = new Date(dueDate.getTime() - 12 * 60 * 60 * 1000); // 12 hours before due

    orders.push({
      id: `order-${i + 1}`,
      orderNumber: `PO-2025-${String(i + 1).padStart(5, '0')}`,
      sku,
      skuId: sku.id,
      quantity,
      quantityUnit: 'EA',
      priority,
      dueDate,
      customerName: generateCustomerName(),
      customerPO: `CUST-${Math.floor(Math.random() * 90000) + 10000}`,
      status,
      earliestStart,
      latestStart,
      frozen: priority >= 9 && Math.random() > 0.7, // High priority orders might be frozen
      createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }

  // Sort by due date
  return orders.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

function generateCustomerName(): string {
  const customers = [
    'ABC Retail Chain',
    'XYZ Supermarkets',
    'Global Foods Inc',
    'Premium Grocers',
    'Quick Mart Networks',
    'Fresh & Co',
    'Value Foods Ltd',
    'Metro Market Group',
    'Regional Distributors',
    'Wholesale Direct',
    'Organic Markets',
    'Family Stores Corp',
    'Express Convenience',
    'Mega Retail Group',
    'Local Foods Alliance',
  ];
  
  return customers[Math.floor(Math.random() * customers.length)];
}

export function getMockOrders(count?: number): ProductionOrder[] {
  return generateMockOrders(count);
}

export function getMockOrderById(id: string): ProductionOrder | undefined {
  return generateMockOrders(100).find(order => order.id === id);
}

export function getMockOrdersByStatus(status: OrderStatus): ProductionOrder[] {
  return generateMockOrders(100).filter(order => order.status === status);
}

export function getMockOrdersBySKU(skuId: string): ProductionOrder[] {
  return generateMockOrders(100).filter(order => order.skuId === skuId);
}

export function getUpcomingOrders(days: number = 7): ProductionOrder[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return generateMockOrders(100).filter(order => 
    order.dueDate >= now && order.dueDate <= futureDate &&
    (order.status === OrderStatus.PLANNED || order.status === OrderStatus.SCHEDULED)
  );
}

