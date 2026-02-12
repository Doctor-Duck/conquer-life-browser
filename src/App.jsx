import React from "react";
import { PlayerSidebar } from "./components/PlayerSidebar.jsx";
import { TopBar } from "./components/TopBar.jsx";
import { MainMenu } from "./components/MainMenu.jsx";
import { CharacterCreator } from "./components/CharacterCreator.jsx";
import { Settings } from "./components/Settings.jsx";
import { LoadGameView } from "./components/LoadGameView.jsx";
import { NewGameView } from "./components/NewGameView.jsx";
import { SaveNotification } from "./components/SaveNotification.jsx";
import { CheatMenu } from "./components/CheatMenu.jsx";
import { JobsView } from "./views/JobsView.jsx";
import { SkillsView } from "./views/SkillsView.jsx";
import { AssetsView } from "./views/AssetsView.jsx";
import { TravelView } from "./views/TravelView.jsx";
import { HousingView } from "./views/HousingView.jsx";
import { ShopView } from "./components/ShopView.jsx";
import { ShiftMenu } from "./components/ShiftMenu.jsx";
import {
  advanceDay,
  buyItem,
  createNewGameState,
  deleteItem,
  equipItem,
  loadGameState,
  loadSettings,
  saveGameState,
  startBusiness,
  trainSkill,
  trainSkillToNextLevel,
  travelToLocation,
  unequipItem,
  workShift,
} from "./gameCore.js";

function cloneState(state) {
  return {
    ...state,
    player: { ...state.player },
    skills: { ...state.skills },
    ownedBusinesses: state.ownedBusinesses.map((b) => ({ ...b })),
    log: [...state.log],
    inventory: state.inventory ? [...state.inventory] : [],
    equipment: state.equipment ? { ...state.equipment } : {},
  };
}

export function App() {
  const [appView, setAppView] = React.useState("menu"); // "menu", "character", "settings", "load", "game"
  const [state, setState] = React.useState(null);
  const [currentSaveSlot, setCurrentSaveSlot] = React.useState(1);
  const [lastSaved, setLastSaved] = React.useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [saveNotification, setSaveNotification] = React.useState({ visible: false, isAutoSave: false });
  const [travelCooldown, setTravelCooldown] = React.useState(0);
  const [showCheatMenu, setShowCheatMenu] = React.useState(false);
  const [showShop, setShowShop] = React.useState(false);
  const [showShiftMenu, setShowShiftMenu] = React.useState(false);
  const autoSaveTimerRef = React.useRef(null);
  const travelCooldownTimerRef = React.useRef(null);

  React.useEffect(() => {
    // Check settings to determine initial view
    const settings = loadSettings();
    if (!settings.showMainMenuOnLoad && settings.autoLoadSave && settings.defaultSaveSlot) {
      // Try to load game from default slot
      const loadedState = loadGameState(settings.defaultSaveSlot);
      if (loadedState && loadedState.player) {
        // Migrate old view names
        if (loadedState.activeView === "businesses" || loadedState.activeView === "inventory") {
          loadedState.activeView = loadedState.activeView === "businesses" ? "jobs" : "assets";
        }
        setState({ ...loadedState, currentSaveSlot: settings.defaultSaveSlot });
        setCurrentSaveSlot(settings.defaultSaveSlot);
        setLastSaved(loadedState.lastSaved || Date.now());
        setAppView("game");
        return;
      }
    }
    // Otherwise show main menu
    setAppView("menu");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save timer effect
  React.useEffect(() => {
    if (appView !== "game" || !state) {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      return;
    }

    const settings = loadSettings();
    if (settings.autoSaveInterval) {
      const intervalMs = settings.autoSaveInterval * 60 * 1000;
      autoSaveTimerRef.current = setInterval(() => {
        if (state && state.player) {
          const saved = saveGameState(state, currentSaveSlot);
          if (saved) {
            setLastSaved(Date.now());
            setHasUnsavedChanges(false);
            setSaveNotification({ visible: true, isAutoSave: true });
          }
        }
      }, intervalMs);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [appView, state, currentSaveSlot]);

  // Unsaved changes warning on navigation
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && appView === "game") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, appView]);

  const updateState = React.useCallback((updater) => {
    setState((prev) => {
      const base = prev && prev.player ? prev : createNewGameState();
      const next = updater(cloneState(base));
      setHasUnsavedChanges(true);
      return next;
    });
  }, []);

  const handleNavigate = (viewId) => {
    setState((prev) => ({ ...prev, activeView: viewId }));
  };

  const handleAdvanceDay = () => {
    updateState((s) => {
      const newState = advanceDay(s);
      const settings = loadSettings();
      if (settings.autoSaveAfterDay) {
        const saved = saveGameState(newState, currentSaveSlot);
        if (saved) {
          setLastSaved(Date.now());
          setHasUnsavedChanges(false);
          setSaveNotification({ visible: true, isAutoSave: true });
        }
      }
      return newState;
    });
  };

  const handleSave = () => {
    if (!state) return;
    const saved = saveGameState(state, currentSaveSlot);
    if (saved) {
      setLastSaved(Date.now());
      setHasUnsavedChanges(false);
      setSaveNotification({ visible: true, isAutoSave: false });
    }
  };

  const handleChangeJobsFilter = (filter) => {
    setState((prev) => ({ ...prev, jobsFilter: filter }));
  };

  const handleWorkShift = (jobId) => {
    updateState((s) => {
      workShift(s, jobId);
      s.currentJobId = jobId;
      return s;
    });
  };

  React.useEffect(() => {
    if (state?.requestOpenShiftMenu) {
      setState((prev) => (prev ? { ...prev, requestOpenShiftMenu: false } : prev));
      setShowShiftMenu(true);
    }
  }, [state?.requestOpenShiftMenu]);

  const handleWorkAnotherShift = (jobId) => {
    updateState((s) => {
      workShift(s, jobId);
      return s;
    });
    setShowShiftMenu(true);
  };

  const handleTrainSkill = (skillId) => {
    updateState((s) => {
      trainSkill(s, skillId);
      return s;
    });
  };

  const handleTrainSkillToNextLevel = (skillId) => {
    updateState((s) => {
      trainSkillToNextLevel(s, skillId);
      return s;
    });
  };

  const handleStartBusiness = (businessId) => {
    updateState((s) => {
      startBusiness(s, businessId);
      return s;
    });
  };

  const handleBuyItem = (itemId) => {
    updateState((s) => {
      buyItem(s, itemId);
      return s;
    });
  };

  const handleEquipItem = (itemId, slot) => {
    updateState((s) => {
      equipItem(s, itemId, slot);
      return s;
    });
  };

  const handleUnequipItem = (slot) => {
    updateState((s) => {
      unequipItem(s, slot);
      return s;
    });
  };

  const handleDeleteItem = (itemId) => {
    updateState((s) => {
      deleteItem(s, itemId);
      return s;
    });
  };

  // Travel cooldown timer
  React.useEffect(() => {
    if (travelCooldown > 0) {
      travelCooldownTimerRef.current = setInterval(() => {
        setTravelCooldown((prev) => {
          if (prev <= 1) {
            if (travelCooldownTimerRef.current) {
              clearInterval(travelCooldownTimerRef.current);
              travelCooldownTimerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (travelCooldownTimerRef.current) {
        clearInterval(travelCooldownTimerRef.current);
        travelCooldownTimerRef.current = null;
      }
    };
  }, [travelCooldown]);

  const handleTravel = (cityId, areaId) => {
    if (travelCooldown > 0) return;

    updateState((s) => {
      const result = travelToLocation(s, cityId, areaId);
      if (result.success) {
        // Set 3 second cooldown
        setTravelCooldown(3);
        
        // Handle auto-save for inter-city travel
        if (result.shouldAutoSave) {
          const settings = loadSettings();
          if (settings.autoSaveAfterDay) {
            const saved = saveGameState(result.state, currentSaveSlot);
            if (saved) {
              setLastSaved(Date.now());
              setHasUnsavedChanges(false);
              setSaveNotification({ visible: true, isAutoSave: true });
            }
          }
        }
        
        return result.state;
      }
      return s;
    });
  };

  const handleNewGame = () => {
    setAppView("newgame");
  };

  const handleNewGameSlotSelect = (slotNumber) => {
    setAppView("character");
    // Store the selected slot number to pass to character creator
    setCurrentSaveSlot(slotNumber);
  };

  const handleLoadGame = () => {
    setAppView("load");
  };

  const handleLoadGameSlot = (loadedState, slotNumber) => {
    if (hasUnsavedChanges) {
      // eslint-disable-next-line no-alert
      if (!window.confirm("You have unsaved changes. Are you sure you want to load a different game?")) {
        return;
      }
    }
    
    // Migrate old view names
    if (loadedState.activeView === "businesses" || loadedState.activeView === "inventory") {
      loadedState.activeView = loadedState.activeView === "businesses" ? "jobs" : "assets";
    }
    
    // Ensure cheats object exists and initialize achievementsEnabled if not set
    if (!loadedState.cheats) {
      loadedState.cheats = {
        unlimitedEnergy: false,
        showCheatMenu: false,
        achievementsEnabled: true,
      };
    } else {
      // If cheats were used (showCheatMenu is true), ensure achievements are disabled
      if (loadedState.cheats.showCheatMenu && loadedState.cheats.achievementsEnabled !== false) {
        loadedState.cheats.achievementsEnabled = false;
      }
      // If achievementsEnabled is not set, default to true (unless cheats are enabled)
      if (loadedState.cheats.achievementsEnabled === undefined) {
        loadedState.cheats.achievementsEnabled = !loadedState.cheats.showCheatMenu;
      }
    }
    
    setState({ ...loadedState, currentSaveSlot: slotNumber });
    setCurrentSaveSlot(slotNumber);
    setLastSaved(loadedState.lastSaved || Date.now());
    setHasUnsavedChanges(false);
    setAppView("game");
  };

  const handleCharacterComplete = (characterData) => {
    // Use the save slot from currentSaveSlot state (set when selecting slot in NewGameView)
    // or fall back to the one in characterData (for backward compatibility)
    const saveSlot = currentSaveSlot || characterData.saveSlot || 1;
    const newState = createNewGameState(characterData);
    const saved = saveGameState(newState, saveSlot);
    if (saved) {
      setState({ ...newState, currentSaveSlot: saveSlot });
      setCurrentSaveSlot(saveSlot);
      setLastSaved(Date.now());
      setHasUnsavedChanges(false);
      setAppView("game");
    }
  };

  const handleCharacterCancel = () => {
    // Return to new game slot selection instead of main menu
    setAppView("newgame");
  };

  const handleShowSettings = () => {
    setAppView("settings");
  };

  const handleCloseSettings = () => {
    setAppView("game");
  };

  const handleShowMainMenu = () => {
    if (hasUnsavedChanges) {
      // eslint-disable-next-line no-alert
      if (!window.confirm("You have unsaved changes. Are you sure you want to return to the main menu?")) {
        return;
      }
    }
    setAppView("menu");
  };

  const handleShowCheatMenu = () => {
    setShowCheatMenu(true);
  };

  const handleCloseCheatMenu = () => {
    setShowCheatMenu(false);
  };

  const handleApplyCheat = React.useCallback((updater) => {
    updateState(updater);
  }, [updateState]);

  const handleCheatToggleChange = React.useCallback((enabled) => {
    if (!state || !currentSaveSlot) return;
    
    updateState((s) => {
      if (!s.cheats) {
        s.cheats = {};
      }
      s.cheats.showCheatMenu = enabled;
      // Disable achievements when cheats are enabled (and never re-enable them)
      if (enabled) {
        s.cheats.achievementsEnabled = false;
      }
      // Note: We don't re-enable achievements when disabling cheats - once disabled, they stay disabled
      return s;
    });
    
    // Save immediately
    const updatedState = { ...state };
    if (!updatedState.cheats) {
      updatedState.cheats = {};
    }
    updatedState.cheats.showCheatMenu = enabled;
    // If enabling cheats, disable achievements permanently
    if (enabled) {
      updatedState.cheats.achievementsEnabled = false;
    }
    // If disabling cheats, keep achievements disabled (don't change achievementsEnabled)
    saveGameState(updatedState, currentSaveSlot);
  }, [state, currentSaveSlot, updateState]);

  // Render menu views
  if (appView === "menu") {
    return (
      <div className="app-shell app-shell-menu">
        <MainMenu
          onNewGame={handleNewGame}
          onLoadGame={handleLoadGame}
          onSettings={() => setAppView("settings")}
        />
      </div>
    );
  }

  if (appView === "newgame") {
    return (
      <div className="app-shell app-shell-menu">
        <NewGameView
          onSelectSlot={handleNewGameSlotSelect}
          onCancel={() => setAppView("menu")}
        />
      </div>
    );
  }

  if (appView === "character") {
    return (
      <div className="app-shell app-shell-menu">
        <CharacterCreator
          onComplete={handleCharacterComplete}
          onCancel={handleCharacterCancel}
        />
      </div>
    );
  }

  if (appView === "load") {
    return (
      <div className="app-shell app-shell-menu">
        <LoadGameView
          onLoad={handleLoadGameSlot}
          onCancel={() => setAppView("menu")}
        />
      </div>
    );
  }

  if (appView === "settings") {
    return (
      <div className="app-shell app-shell-menu">
        <Settings
          onClose={state ? handleCloseSettings : () => setAppView("menu")}
          currentSaveSlot={state ? currentSaveSlot : null}
          onCheatToggleChange={handleCheatToggleChange}
        />
      </div>
    );
  }

  // Render game view
  if (!state || !state.player) {
    return (
      <div className="app-shell app-shell-menu">
        <MainMenu
          onNewGame={handleNewGame}
          onLoadGame={handleLoadGame}
          onSettings={() => setAppView("settings")}
        />
      </div>
    );
  }

  const view = state.activeView || "jobs";

  return (
    <div className="app-shell">
      <main className="main-panel">
        <TopBar
          activeView={view}
          ownedBusinessesCount={state.ownedBusinesses.length}
          onNavigate={handleNavigate}
          onShowMainMenu={handleShowMainMenu}
          onShowSettings={handleShowSettings}
          onShowCheatMenu={handleShowCheatMenu}
          showCheatMenu={state.cheats?.showCheatMenu || false}
          onShowShop={() => setShowShop(true)}
        />
        {view === "jobs" && (
          <JobsView
            state={state}
            onChangeFilter={handleChangeJobsFilter}
            onWorkShift={handleWorkShift}
            onStartBusiness={handleStartBusiness}
          />
        )}
        {view === "skills" && (
          <SkillsView 
            state={state} 
            onTrainSkill={handleTrainSkill}
            onTrainSkillToNextLevel={handleTrainSkillToNextLevel}
          />
        )}
        {view === "assets" && (
          <AssetsView
            state={state}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onDeleteItem={handleDeleteItem}
            onBuyItem={handleBuyItem}
            showShop={showShop}
            setShowShop={setShowShop}
          />
        )}
        {showShop && (
          <ShopView
            state={state}
            onBuyItem={handleBuyItem}
            onClose={() => setShowShop(false)}
          />
        )}
        {view === "travel" && (
          <TravelView
            state={state}
            onTravel={handleTravel}
            travelCooldown={travelCooldown}
            canTravel={travelCooldown === 0}
          />
        )}
        {view === "housing" && (
          <HousingView state={state} />
        )}
      </main>
      <PlayerSidebar
        state={state}
        onAdvanceDay={handleAdvanceDay}
        onSave={handleSave}
        onNavigate={handleNavigate}
        onWorkShift={handleWorkShift}
      />
      <SaveNotification
        isVisible={saveNotification.visible}
        isAutoSave={saveNotification.isAutoSave}
        onClose={() => setSaveNotification({ visible: false, isAutoSave: false })}
      />
      {showShiftMenu && state?.lastShiftResult && (
        <ShiftMenu
          state={state}
          onClose={() => setShowShiftMenu(false)}
          onWorkAnotherShift={handleWorkAnotherShift}
        />
      )}
      {showCheatMenu && state && (
        <CheatMenu
          state={state}
          onClose={handleCloseCheatMenu}
          onApplyCheat={handleApplyCheat}
        />
      )}
    </div>
  );
}

