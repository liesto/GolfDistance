/**
 * Test Cases for Golf Distance Calculator
 *
 * These are example calculations to validate that the formulas are working correctly.
 * Run these in your browser console to verify accuracy.
 */

import { calculateDistance, runTestCase } from './calculationEngine.js'

export function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗')
  console.log('║   GOLF DISTANCE CALCULATOR - TEST SUITE                        ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')

  const results = []

  // ============================================
  // TEST 1: Baseline (No Adjustments)
  // ============================================
  results.push(runTestCase(
    'Baseline - No Adjustments',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 75,
      elevationFeet: 0,
      windSpeedMph: 0,
      windDirection: 'None',
      lieQuality: 'Normal Fairway',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Flat'
    },
    162  // 150 + ~12 runout
  ))

  // ============================================
  // TEST 2: Cold Temperature (Distance Reduced)
  // ============================================
  results.push(runTestCase(
    'Cold Weather (-20°F)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 55,  // 20°F colder than baseline
      elevationFeet: 0,
      windSpeedMph: 0,
      windDirection: 'None',
      lieQuality: 'Normal Fairway',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Flat'
    },
    158  // Should be less than baseline (~4 yards)
  ))

  // ============================================
  // TEST 3: Hot Temperature (Distance Increased)
  // ============================================
  results.push(runTestCase(
    'Hot Weather (+20°F)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 95,  // 20°F warmer than baseline
      elevationFeet: 0,
      windSpeedMph: 0,
      windDirection: 'None',
      lieQuality: 'Normal Fairway',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Flat'
    },
    166  // Should be more than baseline (~4 yards)
  ))

  // ============================================
  // TEST 4: High Elevation (Distance Increased)
  // ============================================
  results.push(runTestCase(
    'High Elevation (Denver - 5,280 ft)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 75,
      elevationFeet: 5280,
      windSpeedMph: 0,
      windDirection: 'None',
      lieQuality: 'Normal Fairway',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Flat'
    },
    171  // Should increase ~9 yards (6% of 150)
  ))

  // ============================================
  // TEST 5: Headwind (Distance Reduced)
  // ============================================
  results.push(runTestCase(
    'Headwind (10 mph)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 75,
      elevationFeet: 0,
      windSpeedMph: 10,
      windDirection: 'Straight In (Headwind)',
      lieQuality: 'Normal Fairway',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Flat'
    },
    152  // 150 - 10 + 12 runout = 152
  ))

  // ============================================
  // TEST 6: Tailwind (Distance Increased)
  // ============================================
  results.push(runTestCase(
    'Tailwind (10 mph)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 75,
      elevationFeet: 0,
      windSpeedMph: 10,
      windDirection: 'Straight Out (Tailwind)',
      lieQuality: 'Normal Fairway',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Flat'
    },
    167  // 150 + (10 * 0.5) + 12 runout = 167
  ))

  // ============================================
  // TEST 7: Flyer Lie (Less Spin = More Distance)
  // ============================================
  results.push(runTestCase(
    'Flyer Lie (Rough with Less Spin)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 75,
      elevationFeet: 0,
      windSpeedMph: 0,
      windDirection: 'None',
      lieQuality: 'Flyer Rough',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Flat'
    },
    173  // Flyer = 1.05x carry (157.5) + less runout = ~173
  ))

  // ============================================
  // TEST 8: Heavy Rough (More Spin = Less Distance)
  // ============================================
  results.push(runTestCase(
    'Heavy Rough (More Spin)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 75,
      elevationFeet: 0,
      windSpeedMph: 0,
      windDirection: 'None',
      lieQuality: 'Heavy Rough',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Flat'
    },
    140  // Heavy rough = 0.85x carry (127.5) + reduced runout = ~140
  ))

  // ============================================
  // TEST 9: Firm Ground (More Runout)
  // ============================================
  results.push(runTestCase(
    'Firm Ground (More Runout)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 75,
      elevationFeet: 0,
      windSpeedMph: 0,
      windDirection: 'None',
      lieQuality: 'Normal Fairway',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Firm',
      landingSlope: 'Flat'
    },
    174  // Normal carry (142.5) + increased runout (~31.5)
  ))

  // ============================================
  // TEST 10: Downhill Slope (More Runout)
  // ============================================
  results.push(runTestCase(
    'Downhill Slope (More Runout)',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 75,
      elevationFeet: 0,
      windSpeedMph: 0,
      windDirection: 'None',
      lieQuality: 'Normal Fairway',
      surfaceMoisture: 'Normal',
      turfFirmness: 'Normal',
      landingSlope: 'Downhill'
    },
    173  // Normal carry (142.5) + increased runout (downhill)
  ))

  // ============================================
  // TEST 11: All Negative Adjustments (Worst Case)
  // ============================================
  results.push(runTestCase(
    'Worst Case - Cold, Headwind, Heavy Rough',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 55,
      elevationFeet: 0,
      windSpeedMph: 10,
      windDirection: 'Straight In (Headwind)',
      lieQuality: 'Heavy Rough',
      surfaceMoisture: 'Wet',
      turfFirmness: 'Soft',
      landingSlope: 'Uphill'
    },
    118  // Multiple negative factors compound
  ))

  // ============================================
  // TEST 12: All Positive Adjustments (Best Case)
  // ============================================
  results.push(runTestCase(
    'Best Case - Hot, High Elevation, Tailwind, Flyer',
    {
      rangefinderDistance: 150,
      temperatureFahrenheit: 95,
      elevationFeet: 5000,
      windSpeedMph: 10,
      windDirection: 'Straight Out (Tailwind)',
      lieQuality: 'Flyer Rough',
      surfaceMoisture: 'Dry',
      turfFirmness: 'Baked',
      landingSlope: 'Downhill'
    },
    210  // Multiple positive factors compound
  ))

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n╔════════════════════════════════════════════════════════════════╗')
  console.log('║                        TEST SUMMARY                            ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')

  const passCount = results.filter(r => r.passed).length
  const failCount = results.filter(r => !r.passed).length

  console.log(`Total Tests: ${results.length}`)
  console.log(`Passed: ${passCount} ✓`)
  console.log(`Failed: ${failCount} ✗`)
  console.log(`\nAccuracy Threshold: ±5 yards (tests expect approximate values)\n`)

  if (failCount > 0) {
    console.log('Failed tests:')
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  • ${r.testName}: Expected ~${r.expected}, got ${r.actual}`)
    })
  } else {
    console.log('All tests passed! ✓\n')
  }

  return results
}

// Export for use in console
window.runAllTests = runAllTests
window.calculateDistance = calculateDistance
