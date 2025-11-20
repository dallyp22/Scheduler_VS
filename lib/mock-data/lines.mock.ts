import type { ProductionLine } from '@/types';

// Generate production lines
export function generateMockLines(): ProductionLine[] {
  const lines: ProductionLine[] = [];

  const lineConfigs = [
    { code: 'L1', name: 'High-Speed Beverage Line 1', maxRate: 12000, type: 'beverage', shift: '24/7' },
    { code: 'L2', name: 'High-Speed Beverage Line 2', maxRate: 11000, type: 'beverage', shift: '24/7' },
    { code: 'L3', name: 'Medium-Speed Multi-Purpose', maxRate: 8000, type: 'multi', shift: '2-shift' },
    { code: 'L4', name: 'Dairy Processing Line', maxRate: 6000, type: 'dairy', shift: '24/7' },
    { code: 'L5', name: 'Sauce & Condiment Line', maxRate: 5000, type: 'sauce', shift: '2-shift' },
    { code: 'L6', name: 'Small Batch Specialty', maxRate: 3000, type: 'specialty', shift: 'day-only' },
    { code: 'L7', name: 'Frozen Foods Line', maxRate: 4500, type: 'frozen', shift: '24/7' },
    { code: 'L8', name: 'Aseptic Processing Line', maxRate: 7000, type: 'aseptic', shift: '24/7' },
    { code: 'L9', name: 'Confectionery Line', maxRate: 6500, type: 'confectionery', shift: '2-shift' },
    { code: 'L10', name: 'Packaging & Labeling', maxRate: 15000, type: 'packaging', shift: '24/7' },
  ];

  lineConfigs.forEach((config, index) => {
    const id = `line-${index + 1}`;
    
    lines.push({
      id,
      code: config.code,
      name: config.name,
      description: `${config.name} - Optimized for ${config.type} production`,
      
      capacity: {
        maxRate: config.maxRate,
        efficiency: 0.82 + Math.random() * 0.15, // 82-97%
        availability: 0.88 + Math.random() * 0.10, // 88-98%
        oeeTarget: 0.85,
      },
      
      specifications: {
        capabilities: getCapabilitiesForType(config.type),
        restrictions: getRestrictionsForType(config.type),
        certifications: getCertificationsForType(config.type),
        equipment: getEquipmentForType(config.type),
      },
      
      operating: {
        shiftPattern: config.shift,
        crewSize: config.shift === '24/7' ? 12 : config.shift === '2-shift' ? 8 : 4,
        skillRequirements: ['line_operator', 'quality_inspector', 'maintenance_tech'],
      },
      
      status: Math.random() > 0.9 ? 'maintenance' : 'active',
      
      metrics: {
        currentOEE: 0.75 + Math.random() * 0.20,
        uptime: 0.92 + Math.random() * 0.07,
        totalRunHours: Math.floor(Math.random() * 10000) + 5000,
      },
      
      createdAt: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      active: true,
    });
  });

  return lines;
}

function getCapabilitiesForType(type: string): string[] {
  const baseCapabilities = ['filling', 'capping', 'labeling', 'quality_check'];
  
  const typeSpecific: Record<string, string[]> = {
    beverage: ['carbonation', 'rinsing', 'pasteurization'],
    dairy: ['pasteurization', 'homogenization', 'culture_addition'],
    sauce: ['mixing', 'heating', 'hot_fill'],
    frozen: ['blast_freezing', 'tunnel_freezing'],
    aseptic: ['sterilization', 'clean_room', 'aseptic_filling'],
    confectionery: ['tempering', 'molding', 'coating'],
    specialty: ['small_batch', 'custom_formulation'],
    packaging: ['case_packing', 'palletizing', 'shrink_wrapping'],
    multi: ['flexible_packaging', 'quick_changeover'],
  };
  
  return [...baseCapabilities, ...(typeSpecific[type] || [])];
}

function getRestrictionsForType(type: string): string[] {
  const restrictions: Record<string, string[]> = {
    beverage: ['no_dairy', 'no_thick_liquids'],
    dairy: ['allergen_sensitive', 'temperature_critical'],
    sauce: ['no_carbonation', 'viscosity_limits'],
    frozen: ['temperature_locked', 'no_ambient_products'],
    aseptic: ['clean_room_required', 'no_particulates'],
    confectionery: ['temperature_sensitive', 'humidity_controlled'],
  };
  
  return restrictions[type] || [];
}

function getCertificationsForType(type: string): string[] {
  const baseCerts = ['HACCP', 'ISO_9001'];
  const specific: Record<string, string[]> = {
    dairy: ['DAIRY_CERTIFIED', 'ORGANIC'],
    frozen: ['FROZEN_FOODS_CERT'],
    aseptic: ['ASEPTIC_PROCESSING', 'CLEAN_ROOM_GRADE_A'],
    organic: ['USDA_ORGANIC', 'EU_ORGANIC'],
  };
  
  return [...baseCerts, ...(specific[type] || [])];
}

function getEquipmentForType(type: string): string[] {
  const baseEquipment = ['conveyor_system', 'control_panel', 'safety_systems'];
  const specific: Record<string, string[]> = {
    beverage: ['carbonator', 'bottle_rinser', 'crown_capper'],
    dairy: ['homogenizer', 'pasteurizer', 'culture_tank'],
    sauce: ['mixer', 'cooker', 'hot_fill_nozzle'],
    frozen: ['blast_freezer', 'spiral_freezer'],
    aseptic: ['sterilizer', 'aseptic_filler', 'laminar_flow'],
    confectionery: ['tempering_unit', 'enrober', 'cooling_tunnel'],
  };
  
  return [...baseEquipment, ...(specific[type] || [])];
}

export function getMockLines(): ProductionLine[] {
  return generateMockLines();
}

export function getMockLineById(id: string): ProductionLine | undefined {
  return generateMockLines().find(line => line.id === id);
}

export function getMockLineByCode(code: string): ProductionLine | undefined {
  return generateMockLines().find(line => line.code === code);
}

export function getAvailableLines(date: Date = new Date()): ProductionLine[] {
  return generateMockLines().filter(line => line.status === 'active');
}

