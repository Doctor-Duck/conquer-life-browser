import React from "react";
import {
  CITIES,
  CITY_AREAS,
  CHARACTER_BACKGROUNDS,
  BASE_SKILLS,
  SKILL_IDS,
  canDoAnyJobInArea,
  getAreaOpportunities,
  getShiftsForLocation,
  getBusinessesForLocation,
  canBackgroundSeeJob,
  canBackgroundSeeBusiness,
} from "../gameCore.js";
import { SmartTooltip } from "./SmartTooltip.jsx";

export function CharacterCreator({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [background, setBackground] = React.useState(null);
  const [cityId, setCityId] = React.useState(null);
  const [areaId, setAreaId] = React.useState(null);
  const [hoveredOpportunity, setHoveredOpportunity] = React.useState(null);

  const selectedBackground = background
    ? CHARACTER_BACKGROUNDS.find((bg) => bg.id === background)
    : null;

  // Check if player can do shifts in selected (city, area) with selected background
  const canDoJobs =
    cityId && areaId && background
      ? canDoAnyJobInArea(cityId, areaId, background)
      : true;

  const canComplete =
    firstName.trim().length > 0 && cityId && areaId && background;

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !firstName.trim()) {
      return; // Can't proceed without first name
    }
    if (currentStep === 2 && !background) {
      return; // Can't proceed without background
    }
    if (currentStep === 3 && !cityId) {
      return; // Can't proceed without city
    }

    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      setIsLoading(false);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canComplete) return;

    // Warn if player can't do any jobs
    if (!canDoJobs) {
      // eslint-disable-next-line no-alert
      if (
        !window.confirm(
          "Warning: You won't be able to do any jobs in this area with your selected background. You'll need to train skills first. Continue anyway?"
        )
      ) {
        return;
      }
    }

    onComplete({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      location: cityId, // Store city as location for backward compatibility
      cityId,
      areaId,
      background,
    });
  };

  return (
    <div className="character-creator">
      <div className="character-creator-content">
        <div className="character-creator-header">
          <h2 className="character-creator-title">Create Your Character</h2>
          <p className="character-creator-subtitle">
            Step {currentStep} of 4
          </p>
        </div>

        <form className="character-creator-form" onSubmit={handleSubmit}>
          {/* Step 1: Name */}
          <div
            className={`character-creator-step ${
              currentStep >= 1 ? "visible" : "hidden"
            } ${currentStep === 1 && isLoading ? "loading" : ""}`}
          >
            <div className="character-creator-section">
              <label className="character-creator-label">First Name *</label>
              <input
                type="text"
                className="character-creator-input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                maxLength={20}
                required
              />
            </div>

            <div className="character-creator-section">
              <label className="character-creator-label">Last Name (Optional)</label>
              <input
                type="text"
                className="character-creator-input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                maxLength={20}
              />
            </div>
          </div>

          {/* Step 2: Background */}
          <div
            className={`character-creator-step ${
              currentStep >= 2 ? "visible" : "hidden"
            } ${currentStep === 2 && isLoading ? "loading" : ""}`}
          >
            <div className="character-creator-section">
              <label className="character-creator-label">Background *</label>
              <div className="character-creator-options">
                {CHARACTER_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    className={`character-creator-option ${
                      background === bg.id ? "selected" : ""
                    }`}
                    onClick={() => setBackground(bg.id)}
                  >
                    <div className="character-creator-option-title">{bg.name}</div>
                    <div className="character-creator-option-desc">
                      {bg.description}
                    </div>
                    {Object.keys(bg.skillBoosts).length > 0 && (
                      <div className="character-creator-option-boosts">
                        <span className="character-creator-boost-label">
                          Skill Boosts:
                        </span>
                        {Object.entries(bg.skillBoosts).map(([skillId, boost]) => {
                          const skill = BASE_SKILLS.find((s) => s.id === skillId);
                          return (
                            <span key={skillId} className="character-creator-boost">
                              {skill?.name || skillId} +{boost}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: City */}
          <div
            className={`character-creator-step ${
              currentStep >= 3 ? "visible" : "hidden"
            } ${currentStep === 3 && isLoading ? "loading" : ""}`}
          >
            <div className="character-creator-section">
              <label className="character-creator-label">Starting City *</label>
              <div className="character-creator-options">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    className={`character-creator-option ${
                      cityId === city.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setCityId(city.id);
                      setAreaId(null); // Reset area when city changes
                    }}
                  >
                    <div className="character-creator-option-title">
                      {city.name}, {city.country}
                    </div>
                    <div className="character-creator-option-desc">
                      {city.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4: Area */}
          <div
            className={`character-creator-step ${
              currentStep >= 4 ? "visible" : "hidden"
            } ${currentStep === 4 && isLoading ? "loading" : ""}`}
          >
            <div className="character-creator-section">
              <label className="character-creator-label">Starting Area *</label>
              <div className="character-creator-options">
                {CITY_AREAS.map((area) => {
                  const opportunities = cityId
                    ? getAreaOpportunities(cityId, area.id)
                    : { jobCount: 0, businessCount: 0 };
                  const hasWarning =
                    areaId === area.id &&
                    cityId &&
                    background &&
                    !canDoAnyJobInArea(cityId, area.id, background);
                  return (
                    <button
                      key={area.id}
                      type="button"
                      className={`character-creator-option ${
                        areaId === area.id ? "selected" : ""
                      } ${hasWarning ? "has-warning" : ""}`}
                      onClick={() => setAreaId(area.id)}
                    >
                      <div className="character-creator-option-title">
                        {area.name}
                      </div>
                      <div className="character-creator-option-desc">
                        {area.description}
                      </div>
                      <div className="character-creator-option-stats">
                        <SmartTooltip
                          visible={hoveredOpportunity === `${area.id}-jobs` && !!cityId && !!background}
                          content={
                            cityId && getShiftsForLocation(cityId, area.id).length > 0 ? (
                              getShiftsForLocation(cityId, area.id).map((job) => {
                                const canSee = canBackgroundSeeJob(job, background);
                                return (
                                  <div key={job.id} className="tooltip-item">
                                    {canSee ? job.name : "???"}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="tooltip-item">No jobs available</div>
                            )
                          }
                        >
                          <div
                            className="character-creator-stat"
                            onMouseEnter={() =>
                              cityId && background && setHoveredOpportunity(`${area.id}-jobs`)
                            }
                            onMouseLeave={() => setHoveredOpportunity(null)}
                          >
                            <span className="character-creator-stat-text">
                              {opportunities.jobCount} Job
                              {opportunities.jobCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </SmartTooltip>
                        <SmartTooltip
                          visible={hoveredOpportunity === `${area.id}-businesses` && !!cityId && !!background}
                          content={
                            getBusinessesForLocation(cityId, area.id).length > 0 ? (
                              getBusinessesForLocation(cityId, area.id).map((business) => {
                                const canSee = canBackgroundSeeBusiness(business, background);
                                return (
                                  <div key={business.id} className="tooltip-item">
                                    {canSee ? business.name : "???"}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="tooltip-item">No businesses available</div>
                            )
                          }
                        >
                          <div
                            className="character-creator-stat"
                            onMouseEnter={() =>
                              cityId && background && setHoveredOpportunity(`${area.id}-businesses`)
                            }
                            onMouseLeave={() => setHoveredOpportunity(null)}
                          >
                            <span className="character-creator-stat-text">
                              {opportunities.businessCount} Business
                              {opportunities.businessCount !== 1 ? "es" : ""}
                            </span>
                          </div>
                        </SmartTooltip>
                      </div>
                      {hasWarning && (
                        <div className="character-creator-warning">
                          ⚠️ No jobs available with your selected background. You'll need to train skills first.
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="character-creator-footer">
            <div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={onCancel}
              >
                Cancel
              </button>
              {currentStep < 4 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !firstName.trim()) ||
                    (currentStep === 2 && !background) ||
                    (currentStep === 3 && !cityId) ||
                    isLoading
                  }
                >
                  {isLoading ? "Loading..." : "Next"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!canComplete}
                >
                  Start Game
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
