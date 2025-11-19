import { useState, useEffect } from 'react'
import { calculateDistance } from './calculationEngine'
import './App.css'

function App() {
  const [inputs, setInputs] = useState({
    rangefinderDistance: 150,
    temperatureFahrenheit: 75,
    elevationFeet: 0,
    windSpeedMph: 0,
    windDirection: 'Calm / No Wind',
    lieQuality: 'Normal Fairway',
    surfaceMoisture: 'Dry',
    turfFirmness: 'Normal',
    landingSlope: 'Flat'
  })

  const [result, setResult] = useState(null)

  // Calculate on first load
  useEffect(() => {
    performCalculation(inputs)
  }, [])

  const handleRangeChange = (value) => {
    const newInputs = { ...inputs, rangefinderDistance: value }
    setInputs(newInputs)
    performCalculation(newInputs)
  }

  const handleInputChange = (name, value) => {
    const newInputs = { ...inputs, [name]: value }
    setInputs(newInputs)
    performCalculation(newInputs)
  }

  const performCalculation = (inputValues) => {
    const numericInputs = {
      ...inputValues,
      rangefinderDistance: parseInt(inputValues.rangefinderDistance) || 0,
      temperatureFahrenheit: parseInt(inputValues.temperatureFahrenheit) || 75,
      elevationFeet: parseInt(inputValues.elevationFeet) || 0,
      windSpeedMph: parseInt(inputValues.windSpeedMph) || 0
    }
    const calcResult = calculateDistance(numericInputs)
    setResult(calcResult)
  }

  const ToggleButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`toggle-btn ${active ? 'active' : ''}`}
    >
      {label}
    </button>
  )

  return (
    <div className="app-wrapper">
      <div className="header-section">
        <h1>Distance Calculator</h1>
        <p className="subtitle">Professional-level precision</p>
      </div>

      <div className="main-content">
        {/* TRUE YARDAGE SECTION */}
        <div className="true-yardage-section">
          <label>True Yardage</label>
          <div className="yardage-input-group">
            <button
              onClick={() => handleRangeChange(Math.max(0, inputs.rangefinderDistance - 1))}
              className="yardage-btn minus"
            >
              −
            </button>
            <input
              type="number"
              value={inputs.rangefinderDistance}
              onChange={(e) => handleRangeChange(parseInt(e.target.value) || 0)}
              className="yardage-input"
              min="0"
              max="300"
            />
            <button
              onClick={() => handleRangeChange(inputs.rangefinderDistance + 1)}
              className="yardage-btn plus"
            >
              +
            </button>
          </div>
        </div>

        {/* ENVIRONMENTAL FACTORS SECTION */}
        <section className="factor-section">
          <h2 className="section-title">
            <span className="icon">⚙️</span> Environmental Factors
          </h2>

          {/* Wind Direction & Speed */}
          <div className="factor-group">
            <label className="factor-label">Wind Direction & Speed</label>
            <div className="toggle-group">
              <ToggleButton
                label="Headwind"
                active={inputs.windDirection === 'Straight In (Headwind)'}
                onClick={() => handleInputChange('windDirection', 'Straight In (Headwind)')}
              />
              <ToggleButton
                label="Tailwind"
                active={inputs.windDirection === 'Straight Out (Tailwind)'}
                onClick={() => handleInputChange('windDirection', 'Straight Out (Tailwind)')}
              />
              <ToggleButton
                label="Crosswind"
                active={inputs.windDirection === 'Crosswind'}
                onClick={() => handleInputChange('windDirection', 'Crosswind')}
              />
            </div>
            <input
              type="number"
              value={inputs.windSpeedMph}
              onChange={(e) => handleInputChange('windSpeedMph', parseInt(e.target.value) || 0)}
              className="number-input"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          {/* Temperature & Elevation */}
          <div className="two-column-group">
            <div className="factor-group">
              <label className="factor-label">Temp (°F)</label>
              <input
                type="number"
                value={inputs.temperatureFahrenheit}
                onChange={(e) => handleInputChange('temperatureFahrenheit', parseInt(e.target.value) || 75)}
                className="number-input"
                min="-50"
                max="120"
              />
            </div>
            <div className="factor-group">
              <label className="factor-label">Elevation (ft)</label>
              <input
                type="number"
                value={inputs.elevationFeet}
                onChange={(e) => handleInputChange('elevationFeet', parseInt(e.target.value) || 0)}
                className="number-input"
                min="-300"
                max="15000"
              />
            </div>
          </div>
        </section>

        {/* LIE & SPIN SECTION */}
        <section className="factor-section">
          <h2 className="section-title">
            <span className="icon">⛳</span> Lie & Spin
          </h2>

          {/* Lie Quality */}
          <div className="factor-group">
            <label className="factor-label">Lie Quality</label>
            <div className="toggle-group three-per-row">
              <ToggleButton
                label="Tee"
                active={inputs.lieQuality === 'Tee'}
                onClick={() => handleInputChange('lieQuality', 'Tee')}
              />
              <ToggleButton
                label="Perfect"
                active={inputs.lieQuality === 'Perfect Fairway'}
                onClick={() => handleInputChange('lieQuality', 'Perfect Fairway')}
              />
              <ToggleButton
                label="Normal"
                active={inputs.lieQuality === 'Normal Fairway'}
                onClick={() => handleInputChange('lieQuality', 'Normal Fairway')}
              />
              <ToggleButton
                label="First Cut"
                active={inputs.lieQuality === 'First Cut'}
                onClick={() => handleInputChange('lieQuality', 'First Cut')}
              />
              <ToggleButton
                label="Flyer"
                active={inputs.lieQuality === 'Flyer Rough'}
                onClick={() => handleInputChange('lieQuality', 'Flyer Rough')}
              />
              <ToggleButton
                label="Heavy"
                active={inputs.lieQuality === 'Heavy Rough'}
                onClick={() => handleInputChange('lieQuality', 'Heavy Rough')}
              />
            </div>
          </div>

          {/* Surface Moisture */}
          <div className="factor-group">
            <label className="factor-label">Surface Moisture</label>
            <div className="toggle-group">
              <ToggleButton
                label="Dry"
                active={inputs.surfaceMoisture === 'Dry'}
                onClick={() => handleInputChange('surfaceMoisture', 'Dry')}
              />
              <ToggleButton
                label="Damp"
                active={inputs.surfaceMoisture === 'Damp'}
                onClick={() => handleInputChange('surfaceMoisture', 'Damp')}
              />
              <ToggleButton
                label="Wet"
                active={inputs.surfaceMoisture === 'Wet'}
                onClick={() => handleInputChange('surfaceMoisture', 'Wet')}
              />
            </div>
          </div>
        </section>

        {/* RUNOUT SECTION */}
        <section className="factor-section">
          <h2 className="section-title">
            <span className="icon">📍</span> Runout
          </h2>

          {/* Turf Firmness */}
          <div className="factor-group">
            <label className="factor-label">Turf Firmness</label>
            <div className="toggle-group">
              <ToggleButton
                label="Soft"
                active={inputs.turfFirmness === 'Soft'}
                onClick={() => handleInputChange('turfFirmness', 'Soft')}
              />
              <ToggleButton
                label="Normal"
                active={inputs.turfFirmness === 'Normal'}
                onClick={() => handleInputChange('turfFirmness', 'Normal')}
              />
              <ToggleButton
                label="Firm"
                active={inputs.turfFirmness === 'Firm'}
                onClick={() => handleInputChange('turfFirmness', 'Firm')}
              />
              <ToggleButton
                label="Baked"
                active={inputs.turfFirmness === 'Baked'}
                onClick={() => handleInputChange('turfFirmness', 'Baked')}
              />
            </div>
          </div>

          {/* Landing Slope */}
          <div className="factor-group">
            <label className="factor-label">Landing Slope</label>
            <div className="toggle-group">
              <ToggleButton
                label="Uphill"
                active={inputs.landingSlope === 'Uphill'}
                onClick={() => handleInputChange('landingSlope', 'Uphill')}
              />
              <ToggleButton
                label="Flat"
                active={inputs.landingSlope === 'Flat'}
                onClick={() => handleInputChange('landingSlope', 'Flat')}
              />
              <ToggleButton
                label="Downhill"
                active={inputs.landingSlope === 'Downhill'}
                onClick={() => handleInputChange('landingSlope', 'Downhill')}
              />
            </div>
          </div>
        </section>

        {/* RESULT DISPLAY SECTION */}
        {result && !result.error && (
          <div className="result-display-section">
            <div className="result-header">Adjusted Distance</div>
            <div className="result-big-number">{result.adjustedDistance} <span className="unit">yds</span></div>

            <div className="result-breakdown">
              <div className="breakdown-row">
                <span>Carry</span>
                <span>{result.carryDistance} yds</span>
              </div>
              <div className="breakdown-row">
                <span>Runout</span>
                <span>{result.runoutDistance} yds</span>
              </div>
            </div>

            <div className="result-details">
              {result.breakdown && (
                <>
                  <div className="detail-row">
                    <span>Temperature</span>
                    <span className="detail-value">
                      {result.breakdown.tempAdjustmentPercent > 0 ? '+' : ''}{Math.round(parseFloat(result.breakdown.tempAdjustmentPercent) * 1.5)} yds
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Elevation</span>
                    <span className="detail-value">
                      {result.breakdown.elevationAdjustmentPercent > 0 ? '+' : ''}{Math.round(parseFloat(result.breakdown.elevationAdjustmentPercent) * 1.5)} yds
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Wind</span>
                    <span className="detail-value">
                      {result.breakdown.windAdjustmentYards > 0 ? '+' : ''}{result.breakdown.windAdjustmentYards} yds
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Lie & Spin</span>
                    <span className="detail-value">
                      {result.breakdown.lieAdjustmentPercent > 0 ? '+' : ''}{Math.round(parseFloat(result.breakdown.lieAdjustmentPercent) * 1.5)} yds
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Runout</span>
                    <span className="detail-value">
                      +{result.runoutDistance} yds
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App
