/**
 * Golf Distance Calculator - Core Calculation Engine
 *
 * Implements the "5 puzzle pieces":
 * 1. Temperature adjustment
 * 2. Elevation adjustment
 * 3. Wind adjustment
 * 4. Lie & spin adjustment
 * 5. Runout calculation
 */

// ============================================
// LIE QUALITY ADJUSTMENT FACTORS
// ============================================
const lieFactors = {
  'Tee': { carryFactor: 1.0, spinFactor: 1.0 },
  'Perfect Fairway': { carryFactor: 1.0, spinFactor: 1.0 },
  'Normal Fairway': { carryFactor: 1.0, spinFactor: 1.0 },
  'First Cut': { carryFactor: 0.97, spinFactor: 1.05 },
  'Flyer Rough': { carryFactor: 1.05, spinFactor: 0.7 }, // Less spin = more distance
  'Heavy Rough': { carryFactor: 0.85, spinFactor: 1.2 }
};

// ============================================
// MOISTURE ADJUSTMENT FACTORS
// ============================================
const moistureFactors = {
  'Dry': 1.0,
  'Damp': 0.97,
  'Wet': 0.94
};

// ============================================
// TURF FIRMNESS ADJUSTMENT FACTORS (runout)
// ============================================
const firmessFactors = {
  'Soft': 0.8,      // Less roll
  'Normal': 1.0,
  'Firm': 1.15,     // More roll
  'Baked': 1.3      // Much more roll
};

// ============================================
// SLOPE ADJUSTMENT FACTORS (runout)
// ============================================
const slopeFactors = {
  'Uphill': 0.85,    // Ball doesn't roll as far uphill
  'Flat': 1.0,
  'Downhill': 1.2    // Ball rolls further downhill
};

// ============================================
// MAIN CALCULATION FUNCTION
// ============================================
export function calculateDistance(inputs) {
  // Validate inputs
  const validation = validateInputs(inputs);
  if (!validation.valid) {
    return { error: validation.error, adjustedDistance: null };
  }

  try {
    // Start with baseline rangefinder distance
    let distance = inputs.rangefinderDistance;
    let carryDistance = distance;

    // 1. TEMPERATURE ADJUSTMENT (multiplicative)
    const tempAdjustment = calculateTemperatureAdjustment(distance, inputs.temperatureFahrenheit);
    carryDistance = carryDistance * (1 + tempAdjustment);

    // 2. ELEVATION ADJUSTMENT (as a percentage, not compounded)
    // Calculate elevation adjustment as a percentage of the ORIGINAL distance
    const elevationAdjustmentPercent = calculateElevationAdjustment(distance, inputs.elevationFeet);
    const elevationBonus = inputs.rangefinderDistance * elevationAdjustmentPercent;
    carryDistance = carryDistance + elevationBonus;

    // 3. WIND ADJUSTMENT
    const windAdjustment = calculateWindAdjustment(inputs.windSpeedMph, inputs.windDirection);
    carryDistance = carryDistance + windAdjustment; // Wind is additive, not multiplicative

    // 4. LIE & SPIN ADJUSTMENT (affects carry distance)
    const lieData = lieFactors[inputs.lieQuality] || lieFactors['Normal Fairway'];
    carryDistance = carryDistance * lieData.carryFactor;

    // 5. RUNOUT CALCULATION
    // Base runout (assume average iron shot, ~12 yards at sea level, normal conditions)
    let runoutDistance = 12;

    // Apply moisture to runout
    const moistureFactor = moistureFactors[inputs.surfaceMoisture] || 1.0;
    runoutDistance = runoutDistance * moistureFactor;

    // Apply firmness to runout
    const firmessFactor = firmessFactors[inputs.turfFirmness] || 1.0;
    runoutDistance = runoutDistance * firmessFactor;

    // Apply slope to runout
    const slopeFactor = slopeFactors[inputs.landingSlope] || 1.0;
    runoutDistance = runoutDistance * slopeFactor;

    // Apply spin factor (higher spin = less roll)
    runoutDistance = runoutDistance * (1 / lieData.spinFactor);

    // TOTAL DISTANCE = Carry + Runout
    const totalDistance = carryDistance + runoutDistance;

    return {
      valid: true,
      adjustedDistance: Math.round(totalDistance),
      carryDistance: Math.round(carryDistance),
      runoutDistance: Math.round(runoutDistance),
      breakdown: {
        baseline: inputs.rangefinderDistance,
        afterTemperature: Math.round(distance * (1 + tempAdjustment)),
        afterElevation: Math.round(carryDistance),
        afterWind: Math.round(carryDistance + windAdjustment),
        afterLie: Math.round(carryDistance * lieData.carryFactor),
        tempAdjustmentPercent: (tempAdjustment * 100).toFixed(1),
        elevationAdjustmentPercent: (elevationAdjustmentPercent * 100).toFixed(1),
        windAdjustmentYards: Math.round(windAdjustment),
        lieAdjustmentPercent: ((lieData.carryFactor - 1) * 100).toFixed(1)
      }
    };
  } catch (error) {
    return { error: `Calculation error: ${error.message}`, adjustedDistance: null };
  }
}

// ============================================
// CALCULATION FORMULAS
// ============================================

/**
 * Temperature Adjustment
 * Cold air is denser; affects distance ~1 yard per 10°F
 * Formula: (Temp - 75) / 10 * 0.0075
 * 75°F is baseline (no adjustment)
 */
function calculateTemperatureAdjustment(distance, tempFahrenheit) {
  return (tempFahrenheit - 75) / 10 * 0.0075;
}

/**
 * Elevation Adjustment
 * Higher altitude = thinner air = more distance (~6% at 5,000 ft)
 * Formula: Elevation_ft * 0.000012 (approximately)
 * Sea level (0 ft) = no adjustment
 * Example: 5,000 ft × 0.000012 = 0.06 = 6% increase
 */
function calculateElevationAdjustment(distance, elevationFeet) {
  return elevationFeet * 0.000012;
}

/**
 * Wind Adjustment
 * Headwind hurts more than tailwind helps (asymmetrical)
 * Crosswind has minimal effect on distance (but affects accuracy)
 *
 * Wind direction compass degrees:
 * 0° = North, 90° = East, 180° = South, 270° = West
 * Assume golfer is shooting in one primary direction (varies by hole)
 * For simplicity, this assumes "into" the wind is 180-270° relative shot direction
 */
function calculateWindAdjustment(windSpeedMph, windDirection) {
  // Simplified: assume "straight in" (headwind) or "straight out" (tailwind)
  // User selects from predefined options

  if (windDirection === 'Straight In (Headwind)') {
    return -windSpeedMph; // Reduce distance by full wind speed
  } else if (windDirection === 'Straight Out (Tailwind)') {
    return windSpeedMph * 0.5; // Tailwind helps half as much
  } else if (windDirection === 'Crosswind') {
    return 0; // No distance adjustment for crosswind
  }

  return 0;
}

// ============================================
// VALIDATION
// ============================================
function validateInputs(inputs) {
  const required = [
    'rangefinderDistance',
    'temperatureFahrenheit',
    'elevationFeet',
    'windSpeedMph',
    'windDirection',
    'lieQuality',
    'surfaceMoisture',
    'turfFirmness',
    'landingSlope'
  ];

  for (const field of required) {
    if (inputs[field] === undefined || inputs[field] === null || inputs[field] === '') {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  // Validate numeric fields are positive
  if (inputs.rangefinderDistance < 0 || inputs.rangefinderDistance > 300) {
    return { valid: false, error: 'Rangefinder distance must be 0-300 yards' };
  }
  if (inputs.temperatureFahrenheit < -50 || inputs.temperatureFahrenheit > 120) {
    return { valid: false, error: 'Temperature must be -50 to 120°F' };
  }
  if (inputs.elevationFeet < -300 || inputs.elevationFeet > 15000) {
    return { valid: false, error: 'Elevation must be -300 to 15,000 feet' };
  }
  if (inputs.windSpeedMph < 0 || inputs.windSpeedMph > 100) {
    return { valid: false, error: 'Wind speed must be 0-100 mph' };
  }

  return { valid: true };
}

// ============================================
// TEST/DEBUG UTILITIES
// ============================================
export function runTestCase(testName, inputs, expectedApproximateDistance) {
  const result = calculateDistance(inputs);
  const diff = Math.abs(result.adjustedDistance - expectedApproximateDistance);
  const withinRange = diff <= 5; // Allow ±5 yard variance

  console.log(`\n=== TEST: ${testName} ===`);
  console.log(`Input:`, inputs);
  console.log(`Expected (approx): ${expectedApproximateDistance} yards`);
  console.log(`Actual: ${result.adjustedDistance} yards`);
  console.log(`Difference: ${diff} yards`);
  console.log(`Status: ${withinRange ? '✓ PASS' : '✗ FAIL'}`);

  return { testName, passed: withinRange, expected: expectedApproximateDistance, actual: result.adjustedDistance };
}
