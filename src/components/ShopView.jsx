import React from "react";
import {
  CITY_AREAS,
  getShopItemsForArea,
  getAreaById,
  getMaxInventorySize,
  formatMoney,
  ITEM_CATEGORIES,
  BASE_INVENTORY_SIZE,
  getItemSlotOrCategoryLabel,
} from "../gameCore.js";

const CATEGORY_LABELS = {
  all: "All",
  [ITEM_CATEGORIES.CLOTHING]: "Clothing",
  [ITEM_CATEGORIES.ACCESSORIES]: "Accessories",
  [ITEM_CATEGORIES.WEAPONS]: "Weapons",
  [ITEM_CATEGORIES.FOOD]: "Food",
  [ITEM_CATEGORIES.CONSUMABLES]: "Consumables",
};

const CATEGORY_ICONS = {
  all: "📦",
  [ITEM_CATEGORIES.CLOTHING]: "👕",
  [ITEM_CATEGORIES.ACCESSORIES]: "👜",
  [ITEM_CATEGORIES.WEAPONS]: "⚔️",
  [ITEM_CATEGORIES.FOOD]: "🍽️",
  [ITEM_CATEGORIES.CONSUMABLES]: "💊",
};

function getItemIcon(item) {
  if (item.type === "bag") return "🎒";
  if (item.category === ITEM_CATEGORIES.FOOD || item.category === ITEM_CATEGORIES.CONSUMABLES) return "🍔";
  if (item.category === ITEM_CATEGORIES.WEAPONS) return item.slot === "gun" ? "🔫" : "🔪";
  if (item.category === ITEM_CATEGORIES.CLOTHING) return "👕";
  if (item.category === ITEM_CATEGORIES.ACCESSORIES) return "👜";
  return "📦";
}

export function ShopView({ state, onBuyItem, onClose }) {
  const currentAreaId = state.location?.areaId || "metropolis";
  const [selectedAreaId, setSelectedAreaId] = React.useState(currentAreaId);
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [buyingItems, setBuyingItems] = React.useState({});

  const areaItems = getShopItemsForArea(selectedAreaId);
  const filteredItems =
    selectedCategory === "all"
      ? areaItems
      : areaItems.filter((item) => item.category === selectedCategory);

  const handleBuyClick = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    const canAfford = state.player.money >= item.price;
    const maxSize = getMaxInventorySize(state);
    const currentItems = state.inventory?.length || 0;
    const hasSpace = currentItems < maxSize;
    const isInArea = state.location?.areaId === item.areaId;

    if (isInArea && canAfford && hasSpace) {
      onBuyItem(item.id);
      setBuyingItems((prev) => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setBuyingItems((prev) => {
          const next = { ...prev };
          delete next[item.id];
          return next;
        });
      }, 300);
    }
  };

  const selectedArea = getAreaById(selectedAreaId);

  return (
    <div className="shop-overlay" onClick={onClose}>
      <div className="shop-modal shop-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="shop-header">
          <div className="shop-title">Shop</div>
          <button className="shop-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="shop-content">
          <div className="shop-area-tabs">
            <span className="shop-area-label">Preview area:</span>
            {CITY_AREAS.map((area) => (
              <button
                key={area.id}
                type="button"
                className={`shop-area-tab ${selectedAreaId === area.id ? "active" : ""} ${currentAreaId === area.id ? "current-location" : ""}`}
                onClick={() => setSelectedAreaId(area.id)}
                title={currentAreaId === area.id ? "You are here" : undefined}
              >
                {area.name}
                {currentAreaId === area.id && " (here)"}
              </button>
            ))}
          </div>
          <div className="shop-filters">
            <span className="shop-filter-label">Category:</span>
            {["all", ITEM_CATEGORIES.CLOTHING, ITEM_CATEGORIES.ACCESSORIES, ITEM_CATEGORIES.WEAPONS, ITEM_CATEGORIES.FOOD, ITEM_CATEGORIES.CONSUMABLES].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`shop-filter-btn ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {CATEGORY_ICONS[cat]}{" "}
                  {CATEGORY_LABELS[cat]}
                </button>
              )
            )}
          </div>
          <div className="shop-list-header">
            <span>{selectedArea?.name ?? selectedAreaId} — {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="shop-items">
            {filteredItems.length === 0 ? (
              <div className="shop-empty">No items in this category for this area.</div>
            ) : (
              filteredItems.map((item) => {
                const canAfford = state.player.money >= item.price;
                const maxSize = getMaxInventorySize(state);
                const currentItems = state.inventory?.length || 0;
                const hasSpace = currentItems < maxSize;
                const isInArea = state.location?.areaId === item.areaId;
                const canBuy = isInArea && canAfford && hasSpace;
                const isBuying = buyingItems[item.id];
                const areaName = getAreaById(item.areaId)?.name ?? item.areaId;

                return (
                  <div
                    key={item.id}
                    className={`shop-item ${isBuying ? "shop-item-buying" : ""}`}
                  >
                    <div className="shop-item-icon">
                      {getItemIcon(item)}
                    </div>
                    <div className="shop-item-content">
                      <div className="shop-item-header">
                        <div className="shop-item-name">{item.name}</div>
                        <div className="shop-item-price">{formatMoney(item.price)}</div>
                      </div>
                      {getItemSlotOrCategoryLabel(item) && (
                        <div className="shop-item-slot">{getItemSlotOrCategoryLabel(item)}</div>
                      )}
                      <div className="shop-item-description">{item.description}</div>
                      {item.type === "bag" && item.inventoryBonus != null && (
                        <div className="shop-item-bonus">
                          <span className="shop-item-bonus-icon">📦</span>
                          <span>
                            Inventory: {BASE_INVENTORY_SIZE} → {BASE_INVENTORY_SIZE + item.inventoryBonus} slots
                          </span>
                        </div>
                      )}
                      {isInArea ? (
                        <button
                          className={`shop-item-buy ${!canBuy ? "shop-item-buy-disabled" : ""} ${isBuying ? "shop-item-buy-active" : ""}`}
                          onClick={(e) => handleBuyClick(item, e)}
                          disabled={!canBuy}
                        >
                          {!canAfford
                            ? "Not enough money"
                            : !hasSpace
                              ? "Inventory full"
                              : isBuying
                                ? "Buying..."
                                : "Buy"}
                        </button>
                      ) : (
                        <div className="shop-item-travel-cta" title={`Travel to ${areaName} to buy this item.`}>
                          <span className="shop-item-travel-text">Travel to {areaName} to buy</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
