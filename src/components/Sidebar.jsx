import React from "react";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">CL</div>
        <div>
          <div className="logo-text-main">Conquer Life</div>
          <div className="logo-text-sub">Life Sim · Browser RPG</div>
        </div>
      </div>

      <div className="sidebar-footer">
        <strong>Single-page simulation</strong>
        <br />
        All choices, one screen. Your story persists in this browser.
      </div>
    </aside>
  );
}

