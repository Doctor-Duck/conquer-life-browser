import React from "react";
import { loadSettings, saveSettings, getAllSaveSlots, MAX_SAVE_SLOTS, loadGameState } from "../gameCore.js";

export function Settings({ onClose, currentSaveSlot, onCheatToggleChange }) {
  const [settings, setSettings] = React.useState(() => loadSettings());
  const [saveSlots, setSaveSlots] = React.useState(() => getAllSaveSlots());
  
  // Get cheat state from current save
  const [cheatState, setCheatState] = React.useState(() => {
    if (currentSaveSlot) {
      const save = loadGameState(currentSaveSlot);
      return {
        showCheatMenu: save?.cheats?.showCheatMenu || false,
        achievementsEnabled: save?.cheats?.achievementsEnabled !== false, // Default to true if not set
      };
    }
    return { showCheatMenu: false, achievementsEnabled: true };
  });

  // Update cheat state when save slot changes
  React.useEffect(() => {
    if (currentSaveSlot) {
      const save = loadGameState(currentSaveSlot);
      setCheatState({
        showCheatMenu: save?.cheats?.showCheatMenu || false,
        achievementsEnabled: save?.cheats?.achievementsEnabled !== false,
      });
    } else {
      setCheatState({ showCheatMenu: false, achievementsEnabled: true });
    }
  }, [currentSaveSlot]);

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleDefaultSaveChange = (e) => {
    const value = e.target.value;
    const newSettings = {
      ...settings,
      defaultSaveSlot: value ? parseInt(value, 10) : null,
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleAutoSaveIntervalChange = (e) => {
    const value = e.target.value;
    const newSettings = {
      ...settings,
      autoSaveInterval: value ? parseInt(value, 10) : null,
    };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleCheatMenuToggle = () => {
    if (!currentSaveSlot) {
      // eslint-disable-next-line no-alert
      alert("Please load a save game first to enable/disable cheats.");
      return;
    }

    const newValue = !cheatState.showCheatMenu;
    
    // Only show warning if achievements are still enabled (meaning cheats were never used before)
    // Once achievements are disabled, never show the warning again
    if (newValue && cheatState.achievementsEnabled !== false) {
      const confirmMessage = 
        "⚠️ WARNING: Enabling cheats will disable achievements for this save.\n\n" +
        "Once cheats are enabled, you will not be able to earn achievements in this save file. " +
        "This cannot be undone.\n\n" +
        "Do you want to continue?";
      
      // eslint-disable-next-line no-alert
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    setCheatState((prev) => ({ ...prev, showCheatMenu: newValue }));
    
    // Notify parent to update save
    if (onCheatToggleChange) {
      onCheatToggleChange(newValue);
    }
  };

  return (
    <div className="settings">
      <div className="settings-content">
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="settings-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Show Main Menu on Load</div>
              <div className="settings-item-desc">
                When enabled, you'll see the main menu every time you open the
                game. When disabled, the game will attempt to auto-load your
                save.
              </div>
            </div>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.showMainMenuOnLoad}
                onChange={() => handleToggle("showMainMenuOnLoad")}
              />
              <span className="settings-toggle-slider" />
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Auto-Load Save</div>
              <div className="settings-item-desc">
                Automatically load a saved game when the page loads (only works if
                "Show Main Menu on Load" is disabled).
              </div>
            </div>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.autoLoadSave}
                onChange={() => handleToggle("autoLoadSave")}
                disabled={settings.showMainMenuOnLoad}
              />
              <span className="settings-toggle-slider" />
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Default Save Slot</div>
              <div className="settings-item-desc">
                Select which save slot to load automatically (if auto-load is
                enabled).
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.defaultSaveSlot || ""}
              onChange={handleDefaultSaveChange}
              disabled={!settings.autoLoadSave || settings.showMainMenuOnLoad}
            >
              <option value="">None</option>
              {Array.from({ length: MAX_SAVE_SLOTS }, (_, i) => i + 1).map((slotNum) => {
                const slot = saveSlots.find((s) => s.slotNumber === slotNum);
                return (
                  <option key={slotNum} value={slotNum}>
                    Slot {slotNum} {slot ? `(${slot.characterName})` : "(Empty)"}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Auto-Save After Day</div>
              <div className="settings-item-desc">
                Automatically save your game when you click "End Day".
              </div>
            </div>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={settings.autoSaveAfterDay}
                onChange={() => handleToggle("autoSaveAfterDay")}
              />
              <span className="settings-toggle-slider" />
            </label>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Auto-Save Interval</div>
              <div className="settings-item-desc">
                Automatically save your game at regular intervals while playing.
              </div>
            </div>
            <select
              className="settings-select"
              value={settings.autoSaveInterval || ""}
              onChange={handleAutoSaveIntervalChange}
            >
              <option value="">Disabled</option>
              <option value="1">Every 1 minute</option>
              <option value="3">Every 3 minutes</option>
              <option value="5">Every 5 minutes</option>
            </select>
          </div>

          <div className="settings-item">
            <div className="settings-item-info">
              <div className="settings-item-label">Show Cheat Menu</div>
              <div className="settings-item-desc">
                {currentSaveSlot ? (
                  <>
                    {cheatState.achievementsEnabled === false ? (
                      <>
                        <strong style={{ color: "#f87171" }}>Cheats were turned on in this save.</strong> Achievements are disabled.
                      </>
                    ) : (
                      "Enable the cheat menu button in the game view. Enabling this will disable achievements for this save."
                    )}
                  </>
                ) : (
                  "Load a save game to enable or disable cheats."
                )}
              </div>
            </div>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={cheatState.showCheatMenu}
                onChange={handleCheatMenuToggle}
                disabled={!currentSaveSlot}
              />
              <span className="settings-toggle-slider" />
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
