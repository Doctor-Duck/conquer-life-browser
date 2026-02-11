import React from "react";
import {
  BASE_BUSINESSES,
  CITIES,
  formatMoney,
  getCityById,
  getAreaById,
} from "../gameCore.js";

export function AssetsView({ state }) {
  const [activeTab, setActiveTab] = React.useState("inventory");
  const [expandedCities, setExpandedCities] = React.useState({});

  // Get dynamic title and subtitle based on active tab
  const getTitle = () => {
    switch (activeTab) {
      case "inventory":
        return "Inventory";
      case "businesses":
        return "Businesses";
      case "housing":
        return "Housing";
      default:
        return "Assets";
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case "inventory":
        return "Manage your items and equipment.";
      case "businesses":
        return "View and manage your business portfolio across all cities.";
      case "housing":
        return "Manage your properties and living spaces.";
      default:
        return "Manage your inventory, businesses, and properties.";
    }
  };

  return (
    <div className="assets-view-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">{getTitle()}</div>
            <div className="card-subtitle">
              {getSubtitle()}
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
                (() => {
                  // Group businesses by city
                  const businessesByCity = {};
                  state.ownedBusinesses.forEach((owned) => {
                    const cityId = owned.cityId || state.location?.cityId || "los_angeles";
                    if (!businessesByCity[cityId]) {
                      businessesByCity[cityId] = [];
                    }
                    businessesByCity[cityId].push(owned);
                  });

                  // Calculate totals for each city
                  const cityTotals = {};
                  Object.keys(businessesByCity).forEach((cityId) => {
                    let totalUpkeep = 0;
                    let totalNet = 0;
                    businessesByCity[cityId].forEach((owned) => {
                      const biz = BASE_BUSINESSES.find((b) => b.id === owned.id);
                      if (biz) {
                        totalUpkeep += biz.upkeepPerDay;
                        const estimatedNet =
                          biz.expectedProfitPerDay * owned.profitability -
                          biz.upkeepPerDay;
                        totalNet += estimatedNet;
                      }
                    });
                    cityTotals[cityId] = { totalUpkeep, totalNet };
                  });

                  // Get cities in order
                  const citiesWithBusinesses = CITIES.filter((city) =>
                    businessesByCity[city.id]
                  );

                  return (
                    <div className="businesses-by-city">
                      {citiesWithBusinesses.map((city) => {
                        const cityBusinesses = businessesByCity[city.id];
                        const totals = cityTotals[city.id];
                        const isExpanded = expandedCities[city.id] === true; // Default to collapsed

                        return (
                          <div key={city.id} className="city-business-section">
                            <button
                              className="city-business-header"
                              onClick={() =>
                                setExpandedCities((prev) => ({
                                  ...prev,
                                  [city.id]: !isExpanded,
                                }))
                              }
                            >
                              <div className="city-business-header-left">
                                <span className="city-business-title">
                                  {city.name}, {city.country}
                                </span>
                                <span className="city-business-count">
                                  {cityBusinesses.length} business
                                  {cityBusinesses.length !== 1 ? "es" : ""}
                                </span>
                              </div>
                              <div className="city-business-header-right">
                                <div className="city-business-totals">
                                  <span className="city-business-total-label">
                                    Total Upkeep:
                                  </span>
                                  <span className="city-business-total-value">
                                    {formatMoney(totals.totalUpkeep)}/day
                                  </span>
                                  <span className="city-business-total-label">
                                    Total Net:
                                  </span>
                                  <span
                                    className={`city-business-total-value ${
                                      totals.totalNet >= 0
                                        ? "business-stat-positive"
                                        : "business-stat-negative"
                                    }`}
                                  >
                                    {formatMoney(totals.totalNet)}/day
                                  </span>
                                </div>
                                <span className="city-business-toggle">
                                  {isExpanded ? "▼" : "▶"}
                                </span>
                              </div>
                            </button>
                            {isExpanded && (
                              <div className="businesses-grid-new">
                                {cityBusinesses.map((owned, index) => {
                                  const biz = BASE_BUSINESSES.find(
                                    (b) => b.id === owned.id
                                  );
                                  if (!biz) return null;
                                  const estimatedNet =
                                    biz.expectedProfitPerDay *
                                      owned.profitability -
                                    biz.upkeepPerDay;
                                  const area = getAreaById(
                                    owned.areaId || biz.areaId
                                  );
                                  return (
                                    <article
                                      className="business-card owned"
                                      key={`${city.id}-${owned.id}-${index}`}
                                    >
                                      <div className="business-card-header">
                                        <div className="business-card-title-row">
                                          <h3 className="business-card-title">
                                            {biz.name}
                                          </h3>
                                          <span className="business-owned-badge">
                                            Owned
                                          </span>
                                        </div>
                                        {area && (
                                          <p className="business-card-description">
                                            {area.name}
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
                                            <span className="business-stat-label">
                                              Daily Upkeep
                                            </span>
                                            <span className="business-stat-value business-stat-neutral">
                                              {formatMoney(biz.upkeepPerDay)}
                                            </span>
                                          </div>
                                          <div className="business-stat">
                                            <span className="business-stat-label">
                                              Est. Net/Day
                                            </span>
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
                        );
                      })}
                    </div>
                  );
                })()
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
