import React from "react";

export function InventoryView({ state }) {
  return (
    <div className="inventory-view-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Inventory</div>
            <div className="card-subtitle">
              Manage your items and equipment.
            </div>
          </div>
        </div>
        <div className="empty-state">
          Inventory system coming soon...
        </div>
      </section>
    </div>
  );
}
