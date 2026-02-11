import React from "react";
import {
  BASE_BUSINESSES,
  formatMoney,
  getCityById,
  getAreaById,
} from "../gameCore.js";

export function AssetsView({ state }) {
  const [activeTab, setActiveTab] = React.useState("inventory");

  return (
    <div className="assets-view-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Assets</div>
            <div className="card-subtitle">
              Manage your inventory, businesses, and properties.
            </div>
            <div className="assets-tabs">
              <button
                className={`assets-tab ${activeTab === "inventory" ? "active" : ""}`}
                onClick={() => setActiveTab("inventory")}
              >
                Inventory
              </button>
              <button
                className={`assets-tab ${activeTab === "businesses" ? "active" : ""}`}
                onClick={() => setActiveTab("businesses")}
              >
                Businesses
              </button>
              <button
                className={`assets-tab ${activeTab === "housing" ? "active" : ""}`}
                onClick={() => setActiveTab("housing")}
              >
                Housing
              </button>
            </div>
          </div>
        </div>

        <div className="assets-content">
          {activeTab === "inventory" && (
            <div className="empty-state">
              Inventory system coming soon...
            </div>
          )}

          {activeTab === "businesses" && (
            <div>
              {state.ownedBusinesses.length === 0 ? (
                <div className="empty-state">
                  You don&apos;t own any businesses yet. Save up and invest to
                  escape the shift grind.
                </div>
              ) : (
                <div className="businesses-grid-new">
                  {state.ownedBusinesses.map((owned) => {
                    const biz = BASE_BUSINESSES.find((b) => b.id === owned.id);
                    if (!biz) return null;
                    const estimatedNet =
                      biz.expectedProfitPerDay * owned.profitability -
                      biz.upkeepPerDay;
                    const city = getCityById(owned.cityId || state.location?.cityId);
                    const area = getAreaById(owned.areaId || biz.areaId);
                    return (
                      <article className="business-card owned" key={owned.id}>
                        <div className="business-card-header">
                          <div className="business-card-title-row">
                            <h3 className="business-card-title">{biz.name}</h3>
                            <span className="business-owned-badge">Owned</span>
                          </div>
                          {city && area && (
                            <p className="business-card-description">
                              {area.name}, {city.name}, {city.country}
                            </p>
                          )}
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
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "housing" && (
            <div className="empty-state">
              Housing system coming soon...
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
