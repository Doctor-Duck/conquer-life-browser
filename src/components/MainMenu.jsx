import React from "react";

export function MainMenu({ onNewGame, onLoadGame, onSettings }) {
  return (
    <div className="main-menu">
      <div className="main-menu-content">
        <div className="main-menu-logo">
          <div className="main-menu-logo-mark">CL</div>
          <div>
            <div className="main-menu-logo-text-main">Conquer Life</div>
            <div className="main-menu-logo-text-sub">Life Sim · Browser RPG</div>
          </div>
        </div>
        <div className="main-menu-actions">
          <button className="btn btn-primary btn-large" onClick={onNewGame}>
            New Game
          </button>
          <button className="btn btn-outline btn-large" onClick={onLoadGame}>
            Load Game
          </button>
          <button className="btn btn-outline btn-large" onClick={onSettings}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
