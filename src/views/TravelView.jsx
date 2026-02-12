import React from "react";
import {
  CITIES,
  CITY_AREAS,
  SHIFTS,
  BASE_BUSINESSES,
  getCityById,
  getAreaById,
  formatMoney,
  getAreaOpportunities,
  getShiftsForLocation,
  getBusinessesForLocation,
  canSeeJobDetails,
  canSeeBusinessDetails,
} from "../gameCore.js";
import { SmartTooltip } from "../components/SmartTooltip.jsx";

export function TravelView({ state, onTravel, travelCooldown, canTravel }) {
  const currentCity = getCityById(state.location?.cityId);
  const currentArea = getAreaById(state.location?.areaId);
  const [expandedCityId, setExpandedCityId] = React.useState(null);
  const [hoveredOpportunity, setHoveredOpportunity] = React.useState(null);

  const handleTravel = (cityId, areaId) => {
    if (!canTravel) return;
    if (onTravel) {
      onTravel(cityId, areaId);
    }
  };

  const toggleCity = (cityId) => {
    setExpandedCityId(expandedCityId === cityId ? null : cityId);
  };

  const getShiftsForArea = (cityId, areaId) => {
    return getShiftsForLocation(cityId, areaId);
  };

  const getBusinessesForArea = (cityId, areaId) => {
    return getBusinessesForLocation(cityId, areaId);
  };

  const otherCities = CITIES.filter((city) => city.id !== currentCity?.id);

  return (
    <div className="travel-view-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Travel</div>
            <div className="card-subtitle">
              {travelCooldown > 0
                ? `Travel cooldown: ${travelCooldown}s`
                : "Explore new locations and opportunities."}
            </div>
          </div>
        </div>

        <div className="travel-content-grid">
          {/* Current City - Left Column */}
          {currentCity && (
            <div className="travel-current-column">
              <div className="travel-city-section travel-current-city">
                <div className="travel-city-header">
                  <h3 className="travel-city-name">
                    Current Location
                    <span className="travel-current-badge">Current</span>
                  </h3>
                  <p className="travel-city-description">
                    {currentCity.name}, {currentCity.country}
                  </p>
                </div>

                <div className="travel-areas">
                  {CITY_AREAS.map((area) => {
                    const isCurrentArea = currentArea?.id === area.id;
                    const travelCost = 50; // Intra-city travel
                    const energyCost = 10;
                    const opportunities = getAreaOpportunities(currentCity.id, area.id);

                    return (
                      <div
                        key={area.id}
                        className={`travel-area-card ${
                          isCurrentArea ? "current" : ""
                        } ${!canTravel ? "disabled" : ""}`}
                        onClick={() =>
                          !isCurrentArea && canTravel && handleTravel(currentCity.id, area.id)
                        }
                      >
                        <div className="travel-area-header">
                          <div className="travel-area-name">{area.name}</div>
                          {isCurrentArea && (
                            <span className="travel-area-current">You are here</span>
                          )}
                          {!isCurrentArea && (
                            <div className="travel-area-costs">
                              <span className="travel-area-cost">
                                {formatMoney(travelCost)}
                              </span>
                              <span className="travel-area-energy">⚡ {energyCost}</span>
                            </div>
                          )}
                        </div>
                        <div className="travel-area-description">
                          {area.description}
                        </div>
                        <div className="travel-area-opportunities">
                          <SmartTooltip
                            visible={hoveredOpportunity === `current-${area.id}-jobs`}
                            content={
                              <>
                                {getShiftsForArea(currentCity.id, area.id).map((job) => {
                                  const canSee = canSeeJobDetails(state, job);
                                  return (
                                    <div key={job.id} className="tooltip-item">
                                      {canSee ? job.name : "???"}
                                    </div>
                                  );
                                })}
                              </>
                            }
                          >
                            <div
                              className="travel-area-opportunity"
                              onMouseEnter={() =>
                                setHoveredOpportunity(`current-${area.id}-jobs`)
                              }
                              onMouseLeave={() => setHoveredOpportunity(null)}
                            >
                              <span className="travel-area-opportunity-text">
                                {opportunities.jobCount} Job{opportunities.jobCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </SmartTooltip>
                          <SmartTooltip
                            visible={hoveredOpportunity === `current-${area.id}-businesses`}
                            content={
                              <>
                                {getBusinessesForArea(currentCity.id, area.id).map((business) => {
                                  const canSee = canSeeBusinessDetails(state, business);
                                  return (
                                    <div key={business.id} className="tooltip-item">
                                      {canSee ? business.name : "???"}
                                    </div>
                                  );
                                })}
                              </>
                            }
                          >
                            <div
                              className="travel-area-opportunity"
                              onMouseEnter={() =>
                                setHoveredOpportunity(`current-${area.id}-businesses`)
                              }
                              onMouseLeave={() => setHoveredOpportunity(null)}
                            >
                              <span className="travel-area-opportunity-text">
                                {opportunities.businessCount} Business{opportunities.businessCount !== 1 ? "es" : ""}
                              </span>
                            </div>
                          </SmartTooltip>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Other Cities - Right Column (Scrollable) */}
          <div className="travel-other-column">
            <h3 className="travel-section-title">Other Cities</h3>
            <div className="travel-other-cities">
              {otherCities.map((city) => {
                const isExpanded = expandedCityId === city.id;
                return (
                  <div key={city.id} className="travel-city-box">
                    <div
                      className="travel-city-box-header"
                      onClick={() => toggleCity(city.id)}
                    >
                      <div>
                        <h4 className="travel-city-box-name">
                          {city.name}, {city.country}
                        </h4>
                        <p className="travel-city-box-description">
                          {city.description}
                        </p>
                      </div>
                      <div className="travel-city-box-toggle">
                        {isExpanded ? "▼" : "▶"}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="travel-city-box-areas">
                        {CITY_AREAS.map((area) => {
                          const travelCost = 200; // Inter-city travel
                          const opportunities = getAreaOpportunities(city.id, area.id);
                          return (
                            <div
                              key={area.id}
                              className={`travel-area-card ${
                                !canTravel ? "disabled" : ""
                              }`}
                              onClick={() =>
                                canTravel && handleTravel(city.id, area.id)
                              }
                            >
                              <div className="travel-area-header">
                                <div className="travel-area-name">{area.name}</div>
                                <div className="travel-area-costs">
                                  <span className="travel-area-cost">
                                    {formatMoney(travelCost)}
                                  </span>
                                  <span className="travel-area-day">🌙 Next Day</span>
                                </div>
                              </div>
                              <div className="travel-area-description">
                                {area.description}
                              </div>
                              <div className="travel-area-opportunities">
                                <SmartTooltip
                                  visible={hoveredOpportunity === `${city.id}-${area.id}-jobs`}
                                  content={
                                    <>
                                      {getShiftsForArea(city.id, area.id).map((job) => {
                                        const canSee = canSeeJobDetails(state, job);
                                        return (
                                          <div key={job.id} className="tooltip-item">
                                            {canSee ? job.name : "???"}
                                          </div>
                                        );
                                      })}
                                    </>
                                  }
                                >
                                  <div
                                    className="travel-area-opportunity"
                                    onMouseEnter={() =>
                                      setHoveredOpportunity(`${city.id}-${area.id}-jobs`)
                                    }
                                    onMouseLeave={() => setHoveredOpportunity(null)}
                                  >
                                    <span className="travel-area-opportunity-text">
                                      {opportunities.jobCount} Job{opportunities.jobCount !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </SmartTooltip>
                                <SmartTooltip
                                  visible={hoveredOpportunity === `${city.id}-${area.id}-businesses`}
                                  content={
                                    <>
                                      {getBusinessesForArea(city.id, area.id).map((business) => {
                                        const canSee = canSeeBusinessDetails(state, business);
                                        return (
                                          <div key={business.id} className="tooltip-item">
                                            {canSee ? business.name : "???"}
                                          </div>
                                        );
                                      })}
                                    </>
                                  }
                                >
                                  <div
                                    className="travel-area-opportunity"
                                    onMouseEnter={() =>
                                      setHoveredOpportunity(`${city.id}-${area.id}-businesses`)
                                    }
                                    onMouseLeave={() => setHoveredOpportunity(null)}
                                  >
                                    <span className="travel-area-opportunity-text">
                                      {opportunities.businessCount} Business{opportunities.businessCount !== 1 ? "es" : ""}
                                    </span>
                                  </div>
                                </SmartTooltip>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
