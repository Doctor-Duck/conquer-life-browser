import React from "react";
import {
  BASE_BUSINESSES,
  BASE_SKILLS,
  canStartBusiness,
  formatMoney,
  getSkillLevel,
  getBusinessesForLocation,
  getBusinessDisplayName,
  canSeeBusinessDetails,
} from "../gameCore.js";

export function BusinessesView({ state, onStartBusiness }) {
  const currentAreaId = state.location?.areaId || "metropolis";
  
  // Get businesses available in current area
  const areaBusinesses = getBusinessesForLocation(state.location?.cityId, currentAreaId);
  const legalLabel = (legality) => {
    if (legality === "legal") return "Legal";
    if (legality === "illegal") return "Illegal";
    return "Mixed";
  };

  const legalClass = (legality) => {
    if (legality === "illegal") return "business-category-illegal";
    if (legality === "legal") return "business-category-legal";
    return "business-category-mixed";
  };

  return (
    <div className="businesses-view-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Available Businesses</div>
            <div className="card-subtitle">
              Invest in ventures that earn money as days pass.
            </div>
          </div>
        </div>

        <div className="businesses-grid-new">
          {areaBusinesses.map((biz) => {
            const owned = state.ownedBusinesses.some((b) => b.id === biz.id);
            const { ok } = canStartBusiness(state, biz);
            const disabled = owned || !ok;
            const canSeeDetails = canSeeBusinessDetails(state, biz);
            const displayName = getBusinessDisplayName(state, biz);

            return (
              <article className="business-card" key={biz.id}>
                <div className="business-card-header">
                  <div className="business-card-title-row">
                    <h3 className="business-card-title">{displayName}</h3>
                    <span
                      className={`business-category-badge ${legalClass(
                        biz.legality
                      )}`}
                    >
                      {legalLabel(biz.legality)}
                    </span>
                  </div>
                  {canSeeDetails && (
                    <p className="business-card-description">
                      {biz.description}
                    </p>
                  )}
                </div>

                <div className="business-card-body">
                  <div className="business-card-stats">
                    <div className="business-stat">
                      <span className="business-stat-label">Start Cost</span>
                      <span className="business-stat-value business-stat-money">
                        {canSeeDetails ? formatMoney(biz.costToStart) : "???"}
                      </span>
                    </div>
                    <div className="business-stat">
                      <span className="business-stat-label">Daily Profit</span>
                      <span className="business-stat-value business-stat-positive">
                        {canSeeDetails ? `~${formatMoney(biz.expectedProfitPerDay)}` : "???"}
                      </span>
                    </div>
                    <div className="business-stat">
                      <span className="business-stat-label">Daily Upkeep</span>
                      <span className="business-stat-value business-stat-neutral">
                        {canSeeDetails ? formatMoney(biz.upkeepPerDay) : "???"}
                      </span>
                    </div>
                  </div>

                  {Object.keys(biz.requiredSkills).length > 0 && (
                    <div className="business-requirements">
                      <div className="business-requirements-label">
                        Requirements
                      </div>
                      <div className="business-requirements-list">
                        {Object.entries(biz.requiredSkills).map(
                          ([skillId, level]) => {
                            const skillName =
                              BASE_SKILLS.find((s) => s.id === skillId)?.name ??
                              skillId;
                            const current = getSkillLevel(state, skillId);
                            const meets = current >= level;
                            return (
                              <div
                                key={skillId}
                                className={`business-requirement-item ${
                                  meets ? "met" : "unmet"
                                }`}
                              >
                                <span className="business-requirement-icon">
                                  {meets ? "✓" : "✕"}
                                </span>
                                <span className="business-requirement-skill">
                                  {skillName}
                                </span>
                                <span className="business-requirement-level">
                                  {current}/{level}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {Object.keys(biz.requiredSkills).length === 0 && (
                    <div className="business-requirements">
                      <div className="business-requirements-label">
                        Requirements
                      </div>
                      <div className="business-requirements-none">
                        No requirements
                      </div>
                    </div>
                  )}
                </div>

                <div className="business-card-footer">
                  <button
                    className={`btn btn-primary business-start-button ${
                      disabled ? "disabled" : ""
                    }`}
                    onClick={() => onStartBusiness(biz.id)}
                    disabled={disabled}
                  >
                    {owned ? "Owned" : "Start Business"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Owned Portfolio</div>
            <div className="card-subtitle">
              Assets you control and how they&apos;re currently performing.
            </div>
          </div>
        </div>

        <div className="businesses-grid-new">
          {state.ownedBusinesses.length === 0 ? (
            <div className="empty-state">
              You don&apos;t own any businesses yet. Save up and invest to
              escape the shift grind.
            </div>
          ) : (
            state.ownedBusinesses.map((owned) => {
              const biz = BASE_BUSINESSES.find((b) => b.id === owned.id);
              if (!biz) return null;
              const estimatedNet =
                biz.expectedProfitPerDay * owned.profitability -
                biz.upkeepPerDay;
              return (
                <article className="business-card owned" key={owned.id}>
                  <div className="business-card-header">
                    <div className="business-card-title-row">
                      <h3 className="business-card-title">{biz.name}</h3>
                      <span className="business-owned-badge">Owned</span>
                    </div>
                  </div>

                  <div className="business-card-body">
                    <div className="business-card-stats">
                      <div className="business-stat">
                        <span className="business-stat-label">
                          Profitability
                        </span>
                        <span className="business-stat-value business-stat-positive">
                          {owned.profitability.toFixed(2)}×
                        </span>
                      </div>
                      <div className="business-stat">
                        <span className="business-stat-label">Daily Upkeep</span>
                        <span className="business-stat-value business-stat-neutral">
                          {formatMoney(biz.upkeepPerDay)}
                        </span>
                      </div>
                      <div className="business-stat">
                        <span className="business-stat-label">Est. Net/Day</span>
                        <span
                          className={`business-stat-value ${
                            estimatedNet >= 0
                              ? "business-stat-positive"
                              : "business-stat-negative"
                          }`}
                        >
                          {formatMoney(estimatedNet)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

