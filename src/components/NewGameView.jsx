import React from "react";
import { getAllSaveSlots, loadSettings, MAX_SAVE_SLOTS, formatMoney } from "../gameCore.js";

export function NewGameView({ onSelectSlot, onCancel }) {
  const [slots, setSlots] = React.useState(() => getAllSaveSlots());
  const [settings, setSettings] = React.useState(() => loadSettings());

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  // Create array of all slots (1-5) with their data
  const allSlots = Array.from({ length: MAX_SAVE_SLOTS }, (_, i) => {
    const slotNumber = i + 1;
    const existingSlot = slots.find((s) => s.slotNumber === slotNumber);
    return existingSlot || { slotNumber, isEmpty: true };
  });

  return (
    <div className="load-game-view">
      <div className="load-game-content">
        <div className="load-game-header">
          <h2 className="load-game-title">New Game</h2>
          <button className="load-game-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="load-game-slots">
          {allSlots.map((slot) => {
            const isEmpty = slot.isEmpty;
            return (
              <div
                key={slot.slotNumber}
                className={`load-game-slot ${isEmpty ? "empty" : "occupied"}`}
                onClick={() => onSelectSlot(slot.slotNumber)}
              >
                <div className="load-game-slot-header">
                  <div className="load-game-slot-title">
                    <span className="load-game-slot-number">Slot {slot.slotNumber}</span>
                    {!isEmpty && settings.defaultSaveSlot === slot.slotNumber && (
                      <span className="load-game-slot-default">Default</span>
                    )}
                  </div>
                </div>
                <div className="load-game-slot-body">
                  <div className="load-game-slot-info">
                    {isEmpty ? (
                      <>
                        <div className="load-game-slot-name" style={{ color: "#6b7280", fontStyle: "italic" }}>
                          Empty
                        </div>
                        <div className="load-game-slot-details" style={{ color: "#4b5563" }}>
                          Available for new game
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="load-game-slot-name">
                          {slot.characterName}
                          {slot.cheatsEnabled && <span style={{ marginLeft: "6px" }}>⚠️</span>}
                        </div>
                        <div className="load-game-slot-details">
                          Day {slot.day} · {formatMoney(slot.money)}
                        </div>
                        {slot.cheatsEnabled && (
                          <div className="load-game-slot-cheats" style={{ marginTop: "4px", color: "#f87171", fontSize: "12px" }}>
                            ⚠️ Cheats were used - Achievements disabled
                          </div>
                        )}
                        <div className="load-game-slot-time">
                          Last saved: {formatLastSaved(slot.lastSaved)}
                        </div>
                        <div className="load-game-slot-warning" style={{ marginTop: "8px", color: "#fb923c", fontSize: "12px" }}>
                          ⚠️ Starting a new game will overwrite this save
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
