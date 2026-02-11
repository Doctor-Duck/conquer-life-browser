import React from "react";

export function TopBar({ activeView, ownedBusinessesCount, onNavigate, onShowMainMenu, onShowSettings }) {
  const tabs = [
    { id: "jobs", label: "Work" },
    { id: "skills", label: "Training" },
    { id: "assets", label: "Assets" },
    { id: "housing", label: "Housing" },
  ];

  const title =
    activeView === "jobs"
      ? "Work & Hustles"
      : activeView === "skills"
      ? "Character & Skills"
      : activeView === "assets"
      ? "Assets"
      : activeView === "housing"
      ? "Housing"
      : "";

  const subtitle =
    activeView === "jobs"
      ? "Choose how you'll earn today—clean or dirty."
      : activeView === "skills"
      ? "Level up the skills that shape your destiny."
      : activeView === "assets"
      ? "Manage your inventory, businesses, and properties."
      : activeView === "housing"
      ? "Find and upgrade your living space."
      : "";

  return (
    <div className="top-bar-container">
      <div className="top-bar-header">
        <div className="top-bar-logo">
          <div className="top-bar-logo-mark">CL</div>
          <div>
            <div className="top-bar-logo-text-main">Conquer Life</div>
            <div className="top-bar-logo-text-sub">Life Sim · Browser RPG</div>
          </div>
        </div>
        <div className="top-bar-header-actions">
          <button
            className="top-bar-menu-btn"
            onClick={onShowMainMenu}
            title="Main Menu"
          >
            Menu
          </button>
          <button
            className="top-bar-menu-btn"
            onClick={onShowSettings}
            title="Settings"
          >
            Settings
          </button>
        </div>
      </div>
      <div className="top-bar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`top-bar-tab ${activeView === tab.id ? "active" : ""}`}
            onClick={() => onNavigate(tab.id)}
          >
            {tab.label}
            {tab.id === "assets" && ownedBusinessesCount > 0 && (
              <span className="top-bar-tab-badge">{ownedBusinessesCount}</span>
            )}
          </button>
        ))}
      </div>
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="top-bar-title">{title}</div>
          <div className="top-bar-subtitle">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

