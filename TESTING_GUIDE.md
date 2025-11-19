# Testing Guide - Golf Distance Calculator

## Quick Start Testing

### 1. Click "Run Tests" Button
In the app header, click the **"Run Tests"** button. This will:
- Run 12 different test cases
- Check if calculations are within expected ranges
- Print results to browser console

Open the browser console (F12 → Console tab) to see detailed test output.

### 2. Manual Testing in the App

Try these scenarios to verify the app works correctly:

#### Scenario A: Baseline Conditions
Enter:
- Rangefinder: **150 yards**
- Temperature: **75°F**
- Elevation: **0 ft**
- Wind: **Calm**
- Lie: **Normal Fairway**
- Moisture: **Normal**
- Firmness: **Normal**
- Slope: **Flat**

Expected result: **~162 yards** (150 + 12 yard runout)

#### Scenario B: Cold Weather
- Rangefinder: **150 yards**
- Temperature: **55°F** (20°F colder)
- Everything else: Same as baseline

Expected result: **~158 yards** (cold air reduces distance ~4 yards)

#### Scenario C: High Elevation (Denver)
- Rangefinder: **150 yards**
- Elevation: **5,280 feet**
- Everything else: Same as baseline

Expected result: **~171 yards** (thin air adds ~9 yards)

#### Scenario D: Headwind
- Rangefinder: **150 yards**
- Wind Speed: **10 mph**
- Wind Direction: **Straight In (Headwind)**
- Everything else: Same as baseline

Expected result: **~152 yards** (lose 10 yards to headwind)

#### Scenario E: Tailwind
- Rangefinder: **150 yards**
- Wind Speed: **10 mph**
- Wind Direction: **Straight Out (Tailwind)**
- Everything else: Same as baseline

Expected result: **~167 yards** (gain 5 yards from tailwind, less than headwind loses)

#### Scenario F: Firm Ground (More Roll)
- Rangefinder: **150 yards**
- Turf Firmness: **Firm**
- Everything else: Same as baseline

Expected result: **~174 yards** (firm ground = more runout)

#### Scenario G: Downhill Slope
- Rangefinder: **150 yards**
- Landing Slope: **Downhill**
- Everything else: Same as baseline

Expected result: **~173 yards** (downhill = more runout)

#### Scenario H: Flyer Lie (Less Spin)
- Rangefinder: **150 yards**
- Lie: **Flyer Rough**
- Everything else: Same as baseline

Expected result: **~173 yards** (less spin = more carry distance)

#### Scenario I: Heavy Rough (More Spin)
- Rangefinder: **150 yards**
- Lie: **Heavy Rough**
- Everything else: Same as baseline

Expected result: **~140 yards** (more spin = less distance)

#### Scenario J: Worst Case
- Rangefinder: **150 yards**
- Temperature: **55°F**
- Wind Speed: **10 mph**
- Wind Direction: **Straight In (Headwind)**
- Lie: **Heavy Rough**
- Moisture: **Wet**
- Firmness: **Soft**
- Slope: **Uphill**

Expected result: **~118 yards** (all negative factors compound)

#### Scenario K: Best Case
- Rangefinder: **150 yards**
- Temperature: **95°F**
- Elevation: **5,000 feet**
- Wind Speed: **10 mph**
- Wind Direction: **Straight Out (Tailwind)**
- Lie: **Flyer Rough**
- Moisture: **Dry**
- Firmness: **Baked**
- Slope: **Downhill**

Expected result: **~210 yards** (all positive factors compound)

---

## Understanding Test Results

When you click "Run Tests," you'll see output like:

```
=== TEST: Baseline - No Adjustments ===
Input: {...}
Expected (approx): 162 yards
Actual: 162 yards
Difference: 0 yards
Status: ✓ PASS
```

### What This Means:
- **Expected**: The target value (approximate, ±5 yard tolerance)
- **Actual**: What the calculator calculated
- **Difference**: How far off from expected
- **Status**: PASS if within 5 yards, FAIL if more than 5 yards off

### If Tests Fail:
- Check browser console for detailed error messages
- Verify the formulas haven't been modified incorrectly
- Try manual testing scenarios to isolate the issue

---

## Real-World Testing (With Golfers)

### What to Ask
1. "Does the predicted distance match where your ball lands?"
2. "Are the adjustments realistic (e.g., does it correctly show headwind vs. tailwind)?"
3. "Are any of the inputs confusing or hard to understand?"
4. "Would you use this on the course?"

### How to Validate
1. Have golfers use the app on the course
2. Record their rangefinder distance
3. Record actual landing distance
4. Compare app prediction vs. actual result
5. Target accuracy: Within ±5 yards of actual shot

### Adjusting Formulas
If golfers report systematic errors (e.g., "Always calculates 10 yards too far"), edit:
- `src/calculationEngine.js`
- Adjust the formula that seems off
- Re-test with the "Run Tests" button
- Validate with golfers again

---

## Edge Cases to Test

### Low Distances
- Rangefinder: **50 yards**
- All conditions normal
- Expected: **~62 yards**

### Very High Distances
- Rangefinder: **250 yards**
- All conditions normal
- Expected: **~262 yards**

### Extreme Elevation
- Rangefinder: **150 yards**
- Elevation: **14,000 feet** (high altitude course)
- Expected: **~166 yards** (about 10% increase)

### No Wind vs. Crosswind
- Rangefinder: **150 yards**
- Wind: **Crosswind** (no distance adjustment, just accuracy note)
- Expected: **~162 yards** (same as no wind for distance)

---

## Calculation Breakdown

The app shows two numbers:
- **Adjusted Distance** (total) = Carry + Runout
- **Carry Distance** = Distance after all adjustments except runout
- **Runout Distance** = How far the ball rolls after landing

Example:
- Rangefinder: 150 yards
- After temp/elevation/wind/lie adjustments: 142.5 yards (carry)
- Runout on normal conditions: ~12 yards
- Total: 154.5 yards

---

## Troubleshooting Tests

**Tests show FAIL, but manual testing looks right?**
- The test expectations are approximations (±5 yard tolerance)
- Make sure the actual result is within 5 yards of expected
- Some variance is normal due to rounding

**Same test sometimes passes, sometimes fails?**
- This shouldn't happen. If it does, there's a bug.
- Check the calculation engine for randomness or state issues

**Tests crash or don't run?**
- Click "Run Tests" again
- Check browser console (F12) for error messages
- Reload the page and try again

---

## Success Criteria

✓ All 12 automated tests pass (within ±5 yards)
✓ Manual test scenarios match expected results
✓ Real golfers validate accuracy on the course
✓ No calculation errors or edge case crashes

Once these are met, the app is ready for golfer feedback or iOS development.
