import React from "react";
import {
  SHIFTS,
  BASE_SKILLS,
  BASE_BUSINESSES,
  SHIFT_CATEGORIES,
  canTakeJob,
  canStartBusiness,
  formatMoney,
  getSkillLevel,
  getShiftsForLocation,
  getBusinessesForLocation,
  getJobDisplayName,
  getJobDisplayPay,
  getBusinessDisplayName,
  canSeeBusinessDetails,
} from "../gameCore.js";

export function JobsView({ state, onChangeFilter, onWorkShift, onStartBusiness }) {
  const [activeTab, setActiveTab] = React.useState("shifts");
  const filter = state.jobsFilter;
  const currentAreaId = state.location?.areaId || "metropolis";
  
  // Get shifts available in current (city, area)
  const areaJobs = getShiftsForLocation(state.location?.cityId, currentAreaId);
  
  // Get businesses available in current area
  const areaBusinesses = getBusinessesForLocation(state.location?.cityId, currentAreaId);

  const visibleJobs = areaJobs.filter((job) => {
    if (filter === "all") return true;
    if (filter === "legal") return job.category === SHIFT_CATEGORIES.LEGAL;
    if (filter === "illegal") return job.category === SHIFT_CATEGORIES.ILLEGAL;
    if (filter === "government")
      return job.category === SHIFT_CATEGORIES.GOVERNMENT;
    return true;
  });

  const categoryLabel = (category) => {
    if (category === SHIFT_CATEGORIES.LEGAL) return "Legal";
    if (category === SHIFT_CATEGORIES.ILLEGAL) return "Illegal";
    if (category === SHIFT_CATEGORIES.GOVERNMENT) return "Government";
    return category;
  };

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
    <div className="jobs-view-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="jobs-view-tabs">
              <button
                className={`jobs-view-tab ${activeTab === "shifts" ? "active" : ""}`}
                onClick={() => setActiveTab("shifts")}
              >
                Shifts
              </button>
              <button
                className={`jobs-view-tab ${activeTab === "businesses" ? "active" : ""}`}
                onClick={() => setActiveTab("businesses")}
              >
                Businesses
              </button>
              <button
                className={`jobs-view-tab ${activeTab === "jobs" ? "active" : ""}`}
                onClick={() => setActiveTab("jobs")}
              >
                Jobs
              </button>
            </div>
            <div className="card-subtitle">
              {activeTab === "jobs"
                ? "Long-term career paths and professional opportunities."
                : activeTab === "shifts"
                ? "Work to earn cash, gain skills, and shape your reputation."
                : "Invest in ventures that earn money as days pass."}
            </div>
          </div>
        </div>

        {activeTab === "jobs" && (
          <div className="empty-state">
            Jobs system coming soon...
          </div>
        )}

        {activeTab === "shifts" && (
          <>
            <div className="jobs-filter-row">
              <div className="segmented-control">
                <button
                  className={`segment-btn ${filter === "all" ? "active" : ""}`}
                  onClick={() => onChangeFilter("all")}
                >
                  All
                </button>
                <button
                  className={`segment-btn ${filter === "legal" ? "active" : ""}`}
                  onClick={() => onChangeFilter("legal")}
                >
                  Legal
                </button>
                <button
                  className={`segment-btn ${filter === "illegal" ? "active" : ""}`}
                  onClick={() => onChangeFilter("illegal")}
                >
                  Illegal
                </button>
                <button
                  className={`segment-btn ${
                    filter === "government" ? "active" : ""
                  }`}
                  onClick={() => onChangeFilter("government")}
                >
                  Government
                </button>
              </div>
              <div className="pill">
                <div className="pill-dot" />
                Energy: {state.player.energy}/100
              </div>
            </div>

            <div className="jobs-grid-new">
              {visibleJobs.map((job) => {
                const { ok } = canTakeJob(state, job);
                const btnDisabled = !ok;
                const riskLabel =
                  job.category === SHIFT_CATEGORIES.ILLEGAL
                    ? `${job.risk}% Risk`
                    : "Low Risk";
                const riskClass =
                  job.category === SHIFT_CATEGORIES.ILLEGAL
                    ? job.risk >= 50
                      ? "negative"
                      : "neutral"
                    : "positive";

                const categoryClass =
                  job.category === SHIFT_CATEGORIES.ILLEGAL
                    ? "job-category-illegal"
                    : job.category === SHIFT_CATEGORIES.GOVERNMENT
                    ? "job-category-government"
                    : "job-category-legal";

                const canSeeDetails = ok;
                const displayName = getJobDisplayName(state, job);
                const displayPay = getJobDisplayPay(state, job);

                return (
                  <article className="job-card" key={job.id}>
                    <div className="job-card-header">
                      <div className="job-card-title-row">
                        <h3 className="job-card-title">{displayName}</h3>
                        <span className={`job-category-badge ${categoryClass}`}>
                          {categoryLabel(job.category)}
                        </span>
                      </div>
                      {canSeeDetails && (
                        <p className="job-card-description">{job.description}</p>
                      )}
                    </div>

                    <div className="job-card-body">
                      <div className="job-card-stats">
                        <div className="job-stat">
                          <span className="job-stat-label">Pay</span>
                          <span className="job-stat-value job-stat-money">
                            {displayPay}
                          </span>
                        </div>
                        <div className="job-stat">
                          <span className="job-stat-label">Risk</span>
                          <span className={`job-stat-value job-stat-${riskClass}`}>
                            {riskLabel}
                          </span>
                        </div>
                      </div>

                      {Object.keys(job.requiredSkills).length > 0 && (
                        <div className="job-requirements">
                          <div className="job-requirements-label">Requirements</div>
                          <div className="job-requirements-list">
                            {Object.entries(job.requiredSkills).map(
                              ([skillId, level]) => {
                                const skillName =
                                  BASE_SKILLS.find((s) => s.id === skillId)?.name ??
                                  skillId;
                                const current = getSkillLevel(state, skillId);
                                const meets = current >= level;
                                return (
                                  <div
                                    key={skillId}
                                    className={`job-requirement-item ${
                                      meets ? "met" : "unmet"
                                    }`}
                                  >
                                    <span className="job-requirement-icon">
                                      {meets ? "✓" : "✕"}
                                    </span>
                                    <span className="job-requirement-skill">
                                      {skillName}
                                    </span>
                                    <span className="job-requirement-level">
                                      {current}/{level}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}

                      {Object.keys(job.requiredSkills).length === 0 && (
                        <div className="job-requirements">
                          <div className="job-requirements-label">Requirements</div>
                          <div className="job-requirements-none">No requirements</div>
                        </div>
                      )}
                    </div>

                    <div className="job-card-footer">
                      <button
                        className={`btn btn-primary job-work-button ${
                          btnDisabled ? "disabled" : ""
                        }`}
                        onClick={() => onWorkShift(job.id)}
                        disabled={btnDisabled}
                      >
                        Work Shift
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "businesses" && (
          <div className="businesses-grid-new">
              {areaBusinesses.map((biz) => {
                // Check if business is owned in current location
                const currentCityId = state.location?.cityId;
                const currentAreaId = state.location?.areaId || biz.areaId;
                const owned = state.ownedBusinesses.some(
                  (b) => b.id === biz.id && b.cityId === currentCityId && b.areaId === currentAreaId
                );
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
        )}
      </section>
    </div>
  );
}

