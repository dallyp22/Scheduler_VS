import type { ChangeoverCell } from '@/types';
import { ChangeoverComplexity, CleaningType, CleaningCategory } from '@/types/enums';
import { getMockSKUs } from './skus.mock';

// Calculate changeover time based on SKU attributes
function calculateChangeoverTime(fromSKU: any, toSKU: any): {
  drain: number;
  clean: number;
  setup: number;
  flush: number;
  total: number;
  complexity: ChangeoverComplexity;
  cleaningType: CleaningType;
} {
  let drain = 5; // Base drain time
  let clean = 10; // Base clean time
  let setup = 8; // Base setup time
  let flush = 5; // Base flush time

  // Same SKU - minimal changeover
  if (fromSKU.id === toSKU.id) {
    return {
      drain: 0,
      clean: 0,
      setup: 2,
      flush: 0,
      total: 2,
      complexity: ChangeoverComplexity.SIMPLE,
      cleaningType: CleaningType.NONE,
    };
  }

  // Same family - reduced changeover
  if (fromSKU.family === toSKU.family) {
    clean = 5;
    setup = 5;
  } else {
    clean = 15;
    setup = 12;
  }

  // Color change
  if (fromSKU.attributes.color !== toSKU.attributes.color) {
    clean += 5;
    flush += 3;
  }

  // Viscosity change
  const fromVisc = fromSKU.attributes.viscosity || 'low';
  const toVisc = toSKU.attributes.viscosity || 'low';
  
  if (fromVisc === 'high' || toVisc === 'high') {
    drain += 5;
    clean += 10;
  }

  // Allergen handling
  const fromAllergens = fromSKU.attributes.allergens || [];
  const toAllergens = toSKU.attributes.allergens || [];
  
  if (fromAllergens.length > 0 && toAllergens.length === 0) {
    // From allergen to non-allergen requires deep clean
    clean += 25;
    flush += 10;
  } else if (fromAllergens.some((a: string) => !toAllergens.includes(a))) {
    // Different allergens
    clean += 15;
    flush += 5;
  }

  // Temperature change
  if (fromSKU.attributes.temperature !== toSKU.attributes.temperature) {
    setup += 10; // Temperature adjustment time
  }

  // Cleaning category impact
  const cleaningReq = Math.max(
    Object.keys(CleaningCategory).indexOf(fromSKU.planning.cleaningRequirement),
    Object.keys(CleaningCategory).indexOf(toSKU.planning.cleaningRequirement)
  );

  if (cleaningReq >= 3) { // Category D
    clean += 20;
  } else if (cleaningReq >= 2) { // Category C
    clean += 10;
  }

  const total = drain + clean + setup + flush;

  // Determine complexity
  let complexity: ChangeoverComplexity;
  if (total < 15) {
    complexity = ChangeoverComplexity.SIMPLE;
  } else if (total < 30) {
    complexity = ChangeoverComplexity.MODERATE;
  } else if (total < 60) {
    complexity = ChangeoverComplexity.COMPLEX;
  } else {
    complexity = ChangeoverComplexity.CRITICAL;
  }

  // Determine cleaning type
  let cleaningType: CleaningType;
  if (total <= 5) {
    cleaningType = CleaningType.NONE;
  } else if (fromAllergens.length > 0 && toAllergens.length === 0) {
    cleaningType = CleaningType.ALLERGEN_CLEAN;
  } else if (clean >= 30) {
    cleaningType = CleaningType.SANITIZE;
  } else if (clean >= 15) {
    cleaningType = CleaningType.WASH;
  } else {
    cleaningType = CleaningType.RINSE;
  }

  return {
    drain,
    clean,
    setup,
    flush,
    total,
    complexity,
    cleaningType,
  };
}

// Generate changeover matrix
export function generateChangeoverMatrix(): ChangeoverCell[] {
  const matrix: ChangeoverCell[] = [];
  const skus = getMockSKUs(30); // Use first 30 SKUs for manageable matrix size
  
  let idCounter = 1;

  for (const fromSKU of skus) {
    for (const toSKU of skus) {
      const times = calculateChangeoverTime(fromSKU, toSKU);
      
      // Add some variance to simulate real-world data
      const variance = 0.9 + Math.random() * 0.2; // ±10%
      const adjustedTotal = Math.round(times.total * variance);
      
      // Confidence based on complexity
      const confidence = times.complexity === ChangeoverComplexity.SIMPLE ? 0.95 :
                        times.complexity === ChangeoverComplexity.MODERATE ? 0.85 :
                        times.complexity === ChangeoverComplexity.COMPLEX ? 0.75 : 0.65;

      // Historical data simulation
      const hasHistory = Math.random() > 0.3;
      const avgActualTime = hasHistory ? adjustedTotal + (Math.random() - 0.5) * 5 : undefined;
      const lastActual = hasHistory ? adjustedTotal + (Math.random() - 0.5) * 8 : undefined;

      matrix.push({
        id: `changeover-${idCounter++}`,
        fromSKUId: fromSKU.id,
        fromSKU: fromSKU.code,
        toSKUId: toSKU.id,
        toSKU: toSKU.code,
        time: {
          drain: Math.round(times.drain * variance),
          clean: Math.round(times.clean * variance),
          setup: Math.round(times.setup * variance),
          flush: Math.round(times.flush * variance),
          total: adjustedTotal,
        },
        complexity: times.complexity,
        cleaningType: times.cleaningType,
        requiredSkills: times.complexity === ChangeoverComplexity.CRITICAL 
          ? ['senior_operator', 'maintenance_tech', 'quality_lead']
          : times.complexity === ChangeoverComplexity.COMPLEX
          ? ['senior_operator', 'quality_inspector']
          : ['line_operator'],
        requiredTools: times.cleaningType === CleaningType.ALLERGEN_CLEAN
          ? ['sanitizer_kit', 'allergen_test_kit', 'pressure_washer']
          : times.cleaningType === CleaningType.SANITIZE
          ? ['sanitizer_kit', 'pressure_washer']
          : times.cleaningType === CleaningType.WASH
          ? ['cleaning_solution', 'brushes']
          : [],
        laborCount: times.complexity === ChangeoverComplexity.CRITICAL ? 3 :
                   times.complexity === ChangeoverComplexity.COMPLEX ? 2 : 1,
        validation: {
          status: hasHistory ? 'validated' : Math.random() > 0.5 ? 'estimated' : 'needs_review',
          confidence,
          lastActual,
          avgActualTime,
          standardDeviation: hasHistory ? Math.random() * 5 + 2 : undefined,
        },
        notes: times.complexity === ChangeoverComplexity.CRITICAL 
          ? 'Requires thorough documentation and quality sign-off'
          : undefined,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        validatedBy: hasHistory ? 'system' : undefined,
        validatedAt: hasHistory ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : undefined,
      });
    }
  }

  return matrix;
}

export function getMockChangeoverMatrix(): ChangeoverCell[] {
  return generateChangeoverMatrix();
}

export function getMockChangeoverCell(fromSKUId: string, toSKUId: string): ChangeoverCell | undefined {
  return generateChangeoverMatrix().find(
    cell => cell.fromSKUId === fromSKUId && cell.toSKUId === toSKUId
  );
}

export function getMockChangeoversForSKU(skuId: string): ChangeoverCell[] {
  return generateChangeoverMatrix().filter(
    cell => cell.fromSKUId === skuId || cell.toSKUId === skuId
  );
}

// Get optimal changeover pairs (shortest times)
export function getOptimalChangeoverPairs(limit: number = 10): ChangeoverCell[] {
  return generateChangeoverMatrix()
    .filter(cell => cell.fromSKUId !== cell.toSKUId)
    .sort((a, b) => a.time.total - b.time.total)
    .slice(0, limit);
}

// Get problematic changeover pairs (longest times)
export function getProblematicChangeoverPairs(limit: number = 10): ChangeoverCell[] {
  return generateChangeoverMatrix()
    .filter(cell => cell.fromSKUId !== cell.toSKUId)
    .sort((a, b) => b.time.total - a.time.total)
    .slice(0, limit);
}

