import type { SKU, ProductFamily, ProductFamilyInfo } from '@/types';
import { CleaningCategory, SKUStatus } from '@/types/enums';

// Product families with color coding
export const PRODUCT_FAMILIES: ProductFamilyInfo[] = [
  { id: '1', code: 'A', name: 'Beverages - Carbonated', color: '#FF6B6B', changeoverTier: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', code: 'B', name: 'Beverages - Still', color: '#4ECDC4', changeoverTier: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', code: 'C', name: 'Dairy Products', color: '#45B7D1', changeoverTier: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', code: 'D', name: 'Sauces - Tomato Based', color: '#F7DC6F', changeoverTier: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', code: 'E', name: 'Sauces - Cream Based', color: '#BB8FCE', changeoverTier: 4, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', code: 'F', name: 'Snacks - Sweet', color: '#F8B4D9', changeoverTier: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', code: 'G', name: 'Snacks - Savory', color: '#FFA07A', changeoverTier: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', code: 'H', name: 'Frozen Foods', color: '#87CEEB', changeoverTier: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', code: 'I', name: 'Baked Goods', color: '#D2691E', changeoverTier: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: '10', code: 'J', name: 'Confectionery', color: '#FF69B4', changeoverTier: 2, createdAt: new Date(), updatedAt: new Date() },
];

const SKU_TEMPLATES = [
  // Family A - Carbonated Beverages
  { family: 'A' as ProductFamily, name: 'Cola', colors: ['Classic', 'Cherry', 'Vanilla', 'Zero'], sizes: [330, 500, 1000, 2000] },
  { family: 'A' as ProductFamily, name: 'Lemon-Lime', colors: ['Regular', 'Diet'], sizes: [330, 500, 1000] },
  { family: 'A' as ProductFamily, name: 'Orange', colors: ['Regular', 'Sugar-Free'], sizes: [330, 500, 750] },
  
  // Family B - Still Beverages
  { family: 'B' as ProductFamily, name: 'Orange Juice', colors: ['Pulp', 'No Pulp'], sizes: [500, 1000, 1500] },
  { family: 'B' as ProductFamily, name: 'Apple Juice', colors: ['Clear', 'Cloudy'], sizes: [500, 1000] },
  { family: 'B' as ProductFamily, name: 'Water', colors: ['Still', 'Sparkling'], sizes: [330, 500, 1000] },
  
  // Family C - Dairy
  { family: 'C' as ProductFamily, name: 'Milk', colors: ['Whole', 'Semi-Skimmed', 'Skimmed'], sizes: [500, 1000, 2000] },
  { family: 'C' as ProductFamily, name: 'Yogurt', colors: ['Strawberry', 'Vanilla', 'Blueberry'], sizes: [150, 450, 1000] },
  
  // Family D - Tomato Sauces
  { family: 'D' as ProductFamily, name: 'Ketchup', colors: ['Regular', 'Organic'], sizes: [340, 570, 1000] },
  { family: 'D' as ProductFamily, name: 'Pasta Sauce', colors: ['Marinara', 'Arrabbiata'], sizes: [350, 500, 700] },
  
  // Family E - Cream Sauces
  { family: 'E' as ProductFamily, name: 'Alfredo', colors: ['Classic', 'Garlic'], sizes: [350, 500] },
  { family: 'E' as ProductFamily, name: 'Bechamel', colors: ['Regular'], sizes: [350, 500] },
];

// Generate realistic SKUs
export function generateMockSKUs(): SKU[] {
  const skus: SKU[] = [];
  let idCounter = 1;

  SKU_TEMPLATES.forEach((template) => {
    template.colors.forEach((color) => {
      template.sizes.forEach((size) => {
        const familyInfo = PRODUCT_FAMILIES.find(f => f.code === template.family)!;
        const code = `SKU-${template.family}${idCounter.toString().padStart(3, '0')}`;
        
        skus.push({
          id: `sku-${idCounter}`,
          code,
          name: `${template.name} - ${color} - ${size}ml`,
          description: `${template.name} in ${color} variant, ${size}ml packaging`,
          family: template.family,
          category: familyInfo.name,
          subCategory: template.name,
          
          production: {
            standardRate: Math.floor(Math.random() * 3000) + 2000, // 2000-5000 units/hour
            minBatch: Math.floor(Math.random() * 500) + 500,
            maxBatch: Math.floor(Math.random() * 3000) + 5000,
            setupTime: Math.floor(Math.random() * 20) + 10, // 10-30 mins
            cycleTime: Math.floor(Math.random() * 10) + 5, // 5-15 seconds
            yieldPercentage: Math.floor(Math.random() * 10) + 90, // 90-100%
            qualityGrade: ['premium', 'standard', 'economy'][Math.floor(Math.random() * 3)] as any,
          },
          
          attributes: {
            color: color.toLowerCase(),
            flavor: template.name,
            size: size < 500 ? 'small' : size < 1000 ? 'medium' : size < 2000 ? 'large' : 'xlarge',
            viscosity: template.family.match(/[DE]/) ? 'medium' : 'low',
            allergens: template.family === 'C' ? ['milk'] : template.family === 'E' ? ['milk', 'eggs'] : [],
            material: 'food_grade_plastic',
            temperature: template.family === 'H' ? 'frozen' : template.family === 'C' ? 'chilled' : 'ambient',
            packaging: size < 500 ? 'bottle' : size < 1500 ? 'bottle' : 'bottle',
            weight: size * 1.05, // Slightly more than volume for content
            volume: size,
          },
          
          compatibility: {
            allowedLines: [`line-${Math.floor(Math.random() * 3) + 1}`, `line-${Math.floor(Math.random() * 3) + 4}`],
            lineEfficiency: {
              'line-1': Math.floor(Math.random() * 20) + 80,
              'line-2': Math.floor(Math.random() * 20) + 75,
            },
            preferredLines: [`line-${Math.floor(Math.random() * 5) + 1}`],
            requiredCertifications: template.family === 'C' ? ['dairy_certified'] : [],
            requiredEquipment: size > 1500 ? ['large_bottle_filler'] : ['standard_filler'],
          },
          
          planning: {
            leadTime: Math.floor(Math.random() * 48) + 24, // 24-72 hours
            safetyStock: Math.floor(Math.random() * 5000) + 2000,
            reorderPoint: Math.floor(Math.random() * 3000) + 5000,
            moq: Math.floor(Math.random() * 500) + 500,
            maxInventoryDays: Math.floor(Math.random() * 30) + 30,
            shelfLife: template.family === 'C' ? 14 : template.family === 'H' ? 365 : 180,
            cleaningRequirement: template.family.match(/[CE]/) ? CleaningCategory.D : 
                                 template.family === 'D' ? CleaningCategory.C : 
                                 template.family === 'A' ? CleaningCategory.B : CleaningCategory.B,
          },
          
          financial: {
            unitCost: Number((Math.random() * 2 + 0.5).toFixed(2)),
            sellingPrice: Number((Math.random() * 4 + 2).toFixed(2)),
            margin: Number((Math.random() * 40 + 20).toFixed(2)),
            priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
          },
          
          status: SKUStatus.ACTIVE,
          
          createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          createdBy: 'system',
          lastModifiedBy: 'system',
          version: 1,
        });
        
        idCounter++;
      });
    });
  });

  return skus;
}

// Generate a specific number of SKUs
export function getMockSKUs(count?: number): SKU[] {
  const allSkus = generateMockSKUs();
  return count ? allSkus.slice(0, count) : allSkus;
}

// Get SKUs by family
export function getMockSKUsByFamily(family: ProductFamily): SKU[] {
  return generateMockSKUs().filter(sku => sku.family === family);
}

// Get a single SKU by ID
export function getMockSKUById(id: string): SKU | undefined {
  return generateMockSKUs().find(sku => sku.id === id);
}

// Get a single SKU by code
export function getMockSKUByCode(code: string): SKU | undefined {
  return generateMockSKUs().find(sku => sku.code === code);
}

