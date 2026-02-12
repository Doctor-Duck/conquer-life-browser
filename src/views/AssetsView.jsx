import React from "react";
import {
  BASE_BUSINESSES,
  BASE_ITEMS,
  CITIES,
  EQUIPMENT_SLOTS,
  formatMoney,
  getAreaById,
  getCityById,
  getItemSlotOrCategoryLabel,
  getMaxInventorySize,
  getStorageTierName,
  wouldEquipBagCauseItemLoss,
  wouldUnequipBagCauseItemLoss,
} from "../gameCore.js";

export function AssetsView({ state, onEquipItem, onUnequipItem, onDeleteItem, onBuyItem, showShop, setShowShop }) {
  const [activeTab, setActiveTab] = React.useState("inventory");
  const [expandedCities, setExpandedCities] = React.useState({});
  const [warningDialog, setWarningDialog] = React.useState(null);

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
            <>
              <InventoryView
                state={state}
                onEquipItem={onEquipItem}
                onUnequipItem={onUnequipItem}
                onDeleteItem={onDeleteItem}
                warningDialog={warningDialog}
                setWarningDialog={setWarningDialog}
              />
            </>
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

function InventoryView({ state, onEquipItem, onUnequipItem, onDeleteItem, warningDialog, setWarningDialog }) {
  const inventory = state.inventory || [];
  const equipment = state.equipment || {};
  const maxSize = getMaxInventorySize(state);
  const storageTier = getStorageTierName(state);

  const equipmentSlots = [
    { id: EQUIPMENT_SLOTS.HEAD, label: "Head" },
    { id: EQUIPMENT_SLOTS.CHEST, label: "Chest" },
    { id: EQUIPMENT_SLOTS.LEGS, label: "Legs" },
    { id: EQUIPMENT_SLOTS.HANDS, label: "Hands" },
    { id: EQUIPMENT_SLOTS.EYE, label: "Eye" },
    { id: EQUIPMENT_SLOTS.FACE, label: "Face" },
    { id: EQUIPMENT_SLOTS.BAG, label: "Bag" },
    { id: EQUIPMENT_SLOTS.RING, label: "Ring" },
    { id: EQUIPMENT_SLOTS.NECKLACE, label: "Necklace" },
    { id: EQUIPMENT_SLOTS.MELEE, label: "Melee" },
    { id: EQUIPMENT_SLOTS.GUN, label: "Gun" },
  ];

  const handleEquipItem = (itemId, slot) => {
    const item = BASE_ITEMS.find((i) => i.id === itemId);
    if (!item) return;

    // Check if equipping a bag would cause item loss
    if (slot === EQUIPMENT_SLOTS.BAG && item.type === "bag") {
      if (wouldEquipBagCauseItemLoss(state, itemId)) {
        const currentMaxSize = getMaxInventorySize(state);
        const newMaxSize = 5 + (item.inventoryBonus || 0);
        const currentItems = inventory.length;
        const itemsToLose = currentItems - newMaxSize;
        setWarningDialog({
          type: "equip",
          message: `Equipping ${item.name} will reduce your inventory capacity from ${currentMaxSize} to ${newMaxSize} slots. You currently have ${currentItems} items, which means ${itemsToLose} item(s) will be lost. Do you want to proceed?`,
          onConfirm: () => {
            onEquipItem(itemId, slot);
            setWarningDialog(null);
          },
          onCancel: () => setWarningDialog(null),
        });
        return;
      }
    }
    onEquipItem(itemId, slot);
  };

  const handleUnequipItem = (slot) => {
    // Check if unequipping a bag would cause item loss
    if (wouldUnequipBagCauseItemLoss(state, slot)) {
      const currentMaxSize = getMaxInventorySize(state);
      const currentItems = inventory.length;
      const itemsToLose = currentItems - 5;
      setWarningDialog({
        type: "unequip",
        message: `Unequipping your bag will reduce your inventory capacity from ${currentMaxSize} to 5 slots (Pockets). You currently have ${currentItems} items, which means ${itemsToLose} item(s) will be lost. Do you want to proceed?`,
        onConfirm: () => {
          onUnequipItem(slot);
          setWarningDialog(null);
        },
        onCancel: () => setWarningDialog(null),
      });
      return;
    }
    onUnequipItem(slot);
  };

  const handleDeleteItem = (itemId) => {
    const item = BASE_ITEMS.find((i) => i.id === itemId);
    if (!item) return;
    if (window.confirm(`Are you sure you want to delete ${item.name}? This action cannot be undone.`)) {
      onDeleteItem(itemId);
    }
  };

  return (
    <div className="inventory-container">
      {warningDialog && (
        <div className="warning-dialog-overlay">
          <div className="warning-dialog">
            <div className="warning-dialog-title">Warning</div>
            <div className="warning-dialog-message">{warningDialog.message}</div>
            <div className="warning-dialog-buttons">
              <button
                className="warning-dialog-button warning-dialog-button-confirm"
                onClick={warningDialog.onConfirm}
              >
                Proceed
              </button>
              <button
                className="warning-dialog-button warning-dialog-button-cancel"
                onClick={warningDialog.onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="inventory-columns">
        <div className="inventory-column">
          <div className="inventory-column-header">
            <div className="inventory-column-title">Inventory</div>
            <div className="inventory-column-subtitle">
              {storageTier} ({inventory.length}/{maxSize} slots)
            </div>
          </div>
          <div className="inventory-grid">
            {Array.from({ length: maxSize }).map((_, index) => {
              const itemId = inventory[index];
              const item = itemId ? BASE_ITEMS.find((i) => i.id === itemId) : null;
              // Use index as key to ensure uniqueness (slots are fixed positions)
              return (
                <div
                  key={`slot-${index}`}
                  className={`inventory-slot ${item ? "inventory-slot-filled" : "inventory-slot-empty"}`}
                  title={item ? item.description : "Empty slot"}
                >
                  {item ? (
                    <div className="inventory-item">
                      <div className="inventory-item-name">{item.name}</div>
                      {getItemSlotOrCategoryLabel(item) && (
                        <div className="inventory-item-slot">{getItemSlotOrCategoryLabel(item)}</div>
                      )}
                      {item.slot && (
                        <button
                          className="inventory-item-equip"
                          onClick={() => handleEquipItem(itemId, item.slot)}
                          title={`Equip to ${equipmentSlots.find((s) => s.id === item.slot)?.label || item.slot}`}
                        >
                          Equip
                        </button>
                      )}
                      <button
                        className="inventory-item-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(itemId);
                        }}
                        title="Delete item"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="inventory-slot-empty-text">Empty</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="inventory-column">
          <div className="inventory-column-header">
            <div className="inventory-column-title">Equipment</div>
            <div className="inventory-column-subtitle">Equipped items</div>
          </div>
          <div className="equipment-grid">
            {equipmentSlots.map((slot) => {
              const itemId = equipment[slot.id];
              const item = itemId ? BASE_ITEMS.find((i) => i.id === itemId) : null;
              return (
                <div
                  key={slot.id}
                  className={`equipment-slot ${item ? "equipment-slot-filled" : "equipment-slot-empty"}`}
                >
                  <div className="equipment-slot-label">{slot.label}</div>
                  {item ? (
                    <div className="equipment-item">
                      <div className="equipment-item-name">{item.name}</div>
                      <button
                        className="equipment-item-unequip"
                        onClick={() => handleUnequipItem(slot.id)}
                        title="Unequip item"
                      >
                        Unequip
                      </button>
                    </div>
                  ) : (
                    <div className="equipment-slot-empty-text">—</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
