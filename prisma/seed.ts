import { PrismaClient } from '@prisma/client';
import type { CleaningCategory, SKUStatus, ChangeoverComplexity, CleaningType, OrderStatus, LineStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.changeoverActual.deleteMany();
  await prisma.scheduleBlock.deleteMany();
  await prisma.productionOrder.deleteMany();
  await prisma.productionLineSKU.deleteMany();
  await prisma.changeoverMatrix.deleteMany();
  await prisma.sku.deleteMany();
  await prisma.productionLine.deleteMany();
  await prisma.productFamily.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // Seed Product Families
  console.log('Creating product families...');
  const families = await Promise.all([
    prisma.productFamily.create({
      data: { code: 'A', name: 'Beverages - Carbonated', color: '#FF6B6B', changeoverTier: 2 },
    }),
    prisma.productFamily.create({
      data: { code: 'B', name: 'Beverages - Still', color: '#4ECDC4', changeoverTier: 1 },
    }),
    prisma.productFamily.create({
      data: { code: 'C', name: 'Dairy Products', color: '#45B7D1', changeoverTier: 4 },
    }),
    prisma.productFamily.create({
      data: { code: 'D', name: 'Sauces - Tomato Based', color: '#F7DC6F', changeoverTier: 3 },
    }),
    prisma.productFamily.create({
      data: { code: 'E', name: 'Sauces - Cream Based', color: '#BB8FCE', changeoverTier: 4 },
    }),
    prisma.productFamily.create({
      data: { code: 'F', name: 'Snacks - Sweet', color: '#F8B4D9', changeoverTier: 2 },
    }),
    prisma.productFamily.create({
      data: { code: 'G', name: 'Snacks - Savory', color: '#FFA07A', changeoverTier: 2 },
    }),
    prisma.productFamily.create({
      data: { code: 'H', name: 'Frozen Foods', color: '#87CEEB', changeoverTier: 3 },
    }),
    prisma.productFamily.create({
      data: { code: 'I', name: 'Baked Goods', color: '#D2691E', changeoverTier: 3 },
    }),
    prisma.productFamily.create({
      data: { code: 'J', name: 'Confectionery', color: '#FF69B4', changeoverTier: 2 },
    }),
  ]);

  console.log(`Created ${families.length} product families`);

  // Seed Production Lines
  console.log('Creating production lines...');
  const lines = await Promise.all([
    prisma.productionLine.create({
      data: {
        code: 'L1',
        name: 'High-Speed Beverage Line 1',
        maxRate: 12000,
        efficiency: 0.92,
        availability: 0.95,
        capabilities: ['filling', 'capping', 'labeling', 'carbonation'],
        restrictions: ['no_dairy', 'no_thick_liquids'],
        certifications: ['HACCP', 'ISO_9001'],
        equipment: ['carbonator', 'bottle_rinser'],
        shiftPattern: '24/7',
        crewSize: 12,
        skillRequirements: ['line_operator', 'quality_inspector'],
        status: 'ACTIVE' as LineStatus,
        uptime: 94.5,
        totalRunHours: 8760,
      },
    }),
    prisma.productionLine.create({
      data: {
        code: 'L2',
        name: 'High-Speed Beverage Line 2',
        maxRate: 11000,
        efficiency: 0.88,
        availability: 0.93,
        capabilities: ['filling', 'capping', 'labeling'],
        restrictions: ['no_dairy'],
        certifications: ['HACCP', 'ISO_9001'],
        equipment: ['bottle_rinser', 'crown_capper'],
        shiftPattern: '24/7',
        crewSize: 12,
        skillRequirements: ['line_operator'],
        status: 'ACTIVE' as LineStatus,
        uptime: 92.0,
        totalRunHours: 8500,
      },
    }),
    prisma.productionLine.create({
      data: {
        code: 'L3',
        name: 'Dairy Processing Line',
        maxRate: 6000,
        efficiency: 0.85,
        availability: 0.90,
        capabilities: ['pasteurization', 'homogenization', 'filling'],
        restrictions: ['allergen_sensitive'],
        certifications: ['HACCP', 'DAIRY_CERTIFIED'],
        equipment: ['homogenizer', 'pasteurizer'],
        shiftPattern: '24/7',
        crewSize: 10,
        skillRequirements: ['dairy_specialist', 'quality_inspector'],
        status: 'ACTIVE' as LineStatus,
        uptime: 89.5,
        totalRunHours: 7800,
      },
    }),
  ]);

  console.log(`Created ${lines.length} production lines`);

  // Seed SKUs
  console.log('Creating SKUs...');
  const skus = await Promise.all([
    // Family A - Carbonated Beverages
    prisma.sku.create({
      data: {
        code: 'SKU-A001',
        name: 'Cola - Classic - 500ml',
        familyId: families[0].id,
        category: 'Beverages - Carbonated',
        productionRate: 4500,
        minBatchSize: 1000,
        maxBatchSize: 8000,
        setupTime: 15,
        cycleTime: 6,
        yieldPercentage: 95,
        qualityGrade: 'standard',
        weight: 525,
        volume: 500,
        color: 'brown',
        packaging: 'bottle',
        temperature: 'ambient',
        allergens: [],
        leadTime: 48,
        safetyStock: 5000,
        reorderPoint: 8000,
        cleaningCategory: 'B' as CleaningCategory,
        unitCost: 0.85,
        sellingPrice: 2.49,
        margin: 65.9,
        priority: 'high',
        status: 'ACTIVE' as SKUStatus,
      },
    }),
    prisma.sku.create({
      data: {
        code: 'SKU-C001',
        name: 'Whole Milk - 1000ml',
        familyId: families[2].id,
        category: 'Dairy Products',
        productionRate: 3000,
        minBatchSize: 500,
        maxBatchSize: 5000,
        setupTime: 25,
        cycleTime: 10,
        yieldPercentage: 98,
        qualityGrade: 'premium',
        weight: 1030,
        volume: 1000,
        packaging: 'bottle',
        temperature: 'chilled',
        allergens: ['milk'],
        leadTime: 36,
        safetyStock: 3000,
        reorderPoint: 6000,
        shelfLife: 14,
        cleaningCategory: 'D' as CleaningCategory,
        unitCost: 1.20,
        sellingPrice: 3.49,
        margin: 65.6,
        priority: 'high',
        status: 'ACTIVE' as SKUStatus,
      },
    }),
  ]);

  console.log(`Created ${skus.length} SKUs`);

  // Seed Changeover Matrix
  console.log('Creating changeover matrix...');
  const changeovers = [];
  for (const fromSKU of skus) {
    for (const toSKU of skus) {
      if (fromSKU.id === toSKU.id) {
        changeovers.push({
          fromSKUId: fromSKU.id,
          toSKUId: toSKU.id,
          drainTime: 0,
          cleanTime: 0,
          setupTime: 2,
          flushTime: 0,
          totalTime: 2,
          complexity: 'SIMPLE' as ChangeoverComplexity,
          cleaningType: 'NONE' as CleaningType,
          requiredSkills: ['line_operator'],
          requiredTools: [],
          laborCount: 1,
        });
      } else {
        // Different SKUs - calculate based on attributes
        const hasDifferentAllergens = 
          fromSKU.allergens.length > 0 && toSKU.allergens.length === 0;
        
        const cleanTime = hasDifferentAllergens ? 35 : 15;
        const totalTime = 5 + cleanTime + 12 + 5;
        
        changeovers.push({
          fromSKUId: fromSKU.id,
          toSKUId: toSKU.id,
          drainTime: 5,
          cleanTime,
          setupTime: 12,
          flushTime: 5,
          totalTime,
          complexity: totalTime < 30 ? 'MODERATE' as ChangeoverComplexity : 'COMPLEX' as ChangeoverComplexity,
          cleaningType: hasDifferentAllergens ? 'ALLERGEN_CLEAN' as CleaningType : 'WASH' as CleaningType,
          requiredSkills: hasDifferentAllergens 
            ? ['senior_operator', 'quality_inspector']
            : ['line_operator'],
          requiredTools: hasDifferentAllergens 
            ? ['sanitizer_kit', 'allergen_test_kit']
            : ['cleaning_solution'],
          laborCount: hasDifferentAllergens ? 2 : 1,
          validated: true,
          validatedBy: 'system',
          validatedAt: new Date(),
        });
      }
    }
  }

  await prisma.changeoverMatrix.createMany({ data: changeovers });
  console.log(`Created ${changeovers.length} changeover matrix entries`);

  // Seed Production Orders
  console.log('Creating production orders...');
  const now = new Date();
  const orders = [];
  
  for (let i = 0; i < 20; i++) {
    const sku = skus[i % skus.length];
    const daysFromNow = Math.floor(Math.random() * 14) - 3;
    const dueDate = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    
    orders.push({
      orderNumber: `PO-2025-${String(i + 1).padStart(5, '0')}`,
      skuId: sku.id,
      quantity: Math.floor(Math.random() * 5000) + 2000,
      quantityUnit: 'EA',
      priority: Math.floor(Math.random() * 10) + 1,
      dueDate,
      customerName: ['ABC Retail', 'XYZ Markets', 'Global Foods'][i % 3],
      customerPO: `CUST-${Math.floor(Math.random() * 90000) + 10000}`,
      status: daysFromNow < 0 ? 'COMPLETED' as OrderStatus : 
              daysFromNow < 3 ? 'SCHEDULED' as OrderStatus : 'PLANNED' as OrderStatus,
      earliestStart: new Date(dueDate.getTime() - 72 * 60 * 60 * 1000),
      latestStart: new Date(dueDate.getTime() - 12 * 60 * 60 * 1000),
      frozen: false,
    });
  }

  await prisma.productionOrder.createMany({ data: orders });
  console.log(`Created ${orders.length} production orders`);

  // Create sample user
  await prisma.user.create({
    data: {
      id: 'user_admin123',
      email: 'admin@aips.com',
      name: 'Admin User',
      role: 'admin',
    },
  });
  
  console.log('✅ Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

