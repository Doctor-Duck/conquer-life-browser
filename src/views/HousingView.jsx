import React from "react";

export function HousingView({ state }) {
  return (
    <div className="housing-view-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Housing</div>
            <div className="card-subtitle">
              Find and upgrade your living space.
            </div>
          </div>
        </div>
        <div className="empty-state">
          Housing system coming soon...
        </div>
      </section>
    </div>
  );
}
