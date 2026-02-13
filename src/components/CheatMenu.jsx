import React from "react";
import { BASE_SKILLS, BASE_BUSINESSES, BASE_ITEMS, CITIES, CITY_AREAS, MAX_SKILL_LEVEL, getExpForLevel, getSkillLevel, spawnItem } from "../gameCore.js";

export function CheatMenu({ state, onClose, onApplyCheat }) {
  // Initialize cheats object if it doesn't exist and disable achievements when any cheat is used
  React.useEffect(() => {
    if (state && !state.cheats) {
      onApplyCheat((s) => {
        if (!s.cheats) {
          s.cheats = {
            unlimitedEnergy: false,
            showCheatMenu: true, // If cheat menu is open, it's enabled
            achievementsEnabled: false, // Disable achievements when cheats are used
          };
        }
        return s;
      });
    } else if (state?.cheats && state.cheats.achievementsEnabled !== false) {
      // If achievements are still enabled but we're using cheats, disable them
      onApplyCheat((s) => {
        if (s.cheats) {
          s.cheats.achievementsEnabled = false;
        }
        return s;
      });
    }
  }, [state, onApplyCheat]);

  const unlimitedEnergy = state?.cheats?.unlimitedEnergy || false;

  // Keep energy at 100 when unlimited energy is enabled
  React.useEffect(() => {
    if (unlimitedEnergy && state?.player && state.player.energy < 100) {
      onApplyCheat((s) => {
        s.player.energy = 100;
        return s;
      });
    }
  }, [unlimitedEnergy, state?.player?.energy, onApplyCheat]);

  const handleAddCash = (amount) => {
    onApplyCheat((s) => {
      s.player.money += amount;
      return s;
    });
  };

  const handleToggleUnlimitedEnergy = () => {
    const newValue = !unlimitedEnergy;
    onApplyCheat((s) => {
      if (!s.cheats) {
        s.cheats = {};
      }
      s.cheats.unlimitedEnergy = newValue;
      // Set energy to 100 when enabling
      if (newValue) {
        s.player.energy = 100;
      }
      return s;
    });
  };

  const handleUnlockAllBusinessesInCity = (cityId) => {
    onApplyCheat((s) => {
      const city = CITIES.find((c) => c.id === cityId);
      if (!city) return s;

      BASE_BUSINESSES.forEach((biz) => {
        // Check if business is already owned in this city/area combination
        const areaId = biz.areaId || "metropolis";
        const alreadyOwned = s.ownedBusinesses.some(
          (b) => b.id === biz.id && b.cityId === cityId && b.areaId === areaId
        );
        if (!alreadyOwned) {
          s.ownedBusinesses.push({
            id: biz.id,
            name: biz.name,
            profitability: 1,
            cityId: cityId,
            areaId: areaId,
          });
        }
      });
      return s;
    });
  };

  const handleUnlockAllBusinesses = () => {
    onApplyCheat((s) => {
      // Unlock all businesses in all cities
      CITIES.forEach((city) => {
        BASE_BUSINESSES.forEach((biz) => {
          const areaId = biz.areaId || "metropolis";
          const alreadyOwned = s.ownedBusinesses.some(
            (b) => b.id === biz.id && b.cityId === city.id && b.areaId === areaId
          );
          if (!alreadyOwned) {
            s.ownedBusinesses.push({
              id: biz.id,
              name: biz.name,
              profitability: 1,
              cityId: city.id,
              areaId: areaId,
            });
          }
        });
      });
      return s;
    });
  };

  const handleIncreaseSkillLevel = (skillId, levels = 1) => {
    onApplyCheat((s) => {
      const currentLevel = getSkillLevel(s, skillId);
      if (currentLevel < MAX_SKILL_LEVEL) {
        const newLevel = Math.min(currentLevel + levels, MAX_SKILL_LEVEL);
        s.skills[skillId] = getExpForLevel(newLevel);
      }
      return s;
    });
  };

  const handleMaxAllSkills = () => {
    onApplyCheat((s) => {
      BASE_SKILLS.forEach((skill) => {
        s.skills[skill.id] = getExpForLevel(MAX_SKILL_LEVEL);
      });
      return s;
    });
  };

  const handleSpawnItem = (itemId) => {
    onApplyCheat((s) => {
      return spawnItem(s, itemId);
    });
  };

  // Group items by category for better organization
  const itemsByCategory = {};
  BASE_ITEMS.forEach((item) => {
    const category = item.category || "other";
    if (!itemsByCategory[category]) {
      itemsByCategory[category] = [];
    }
    itemsByCategory[category].push(item);
  });

  return (
    <div className="cheat-menu-overlay" onClick={onClose}>
      <div className="cheat-menu" onClick={(e) => e.stopPropagation()}>
        <div className="cheat-menu-header">
          <h2>Cheat Menu</h2>
          <button className="cheat-menu-close" onClick={onClose}>×</button>
        </div>
        
        <div className="cheat-menu-content">
          <section className="cheat-section">
            <h3>Cash</h3>
            <div className="cheat-buttons">
              <button className="btn btn-outline" onClick={() => handleAddCash(1000)}>
                +$1,000
              </button>
              <button className="btn btn-outline" onClick={() => handleAddCash(10000)}>
                +$10,000
              </button>
              <button className="btn btn-outline" onClick={() => handleAddCash(100000)}>
                +$100,000
              </button>
              <button className="btn btn-outline" onClick={() => handleAddCash(1000000)}>
                +$1,000,000
              </button>
              <button className="btn btn-outline" onClick={() => handleAddCash(10000000)}>
                +$10,000,000
              </button>
              <button className="btn btn-outline" onClick={() => handleAddCash(100000000)}>
                +$100,000,000
              </button>
            </div>
          </section>

          <section className="cheat-section">
            <h3>Energy</h3>
            <div className="cheat-buttons">
              <button 
                className={`btn ${unlimitedEnergy ? "btn-primary" : "btn-outline"}`}
                onClick={handleToggleUnlimitedEnergy}
              >
                {unlimitedEnergy ? "Unlimited Energy: ON" : "Unlimited Energy: OFF"}
              </button>
            </div>
          </section>

          <section className="cheat-section">
            <h3>Businesses</h3>
            <div className="cheat-buttons">
              <button className="btn btn-outline" onClick={handleUnlockAllBusinesses}>
                Unlock All Businesses (All Cities)
              </button>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <h4 style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px" }}>
                Unlock All in City:
              </h4>
              <div className="cheat-buttons">
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    className="btn btn-outline btn-small"
                    onClick={() => handleUnlockAllBusinessesInCity(city.id)}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="cheat-section">
            <h3>Skills</h3>
            <div className="cheat-skill-list">
              {BASE_SKILLS.map((skill) => {
                const currentLevel = getSkillLevel(state, skill.id);
                const isMaxed = currentLevel >= MAX_SKILL_LEVEL;
                return (
                  <div key={skill.id} className="cheat-skill-item">
                    <span className="cheat-skill-name">{skill.name} (Lv. {currentLevel})</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        className="btn btn-outline btn-small"
                        onClick={() => handleIncreaseSkillLevel(skill.id, 1)}
                        disabled={isMaxed}
                      >
                        +1 Level
                      </button>
                      <button 
                        className="btn btn-outline btn-small"
                        onClick={() => handleIncreaseSkillLevel(skill.id, 5)}
                        disabled={isMaxed}
                      >
                        +5 Levels
                      </button>
                      <button 
                        className="btn btn-outline btn-small"
                        onClick={() => handleIncreaseSkillLevel(skill.id, 10)}
                        disabled={isMaxed}
                      >
                        +10 Levels
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cheat-buttons" style={{ marginTop: "1rem" }}>
              <button className="btn btn-outline" onClick={handleMaxAllSkills}>
                Max All Skills
              </button>
            </div>
          </section>

          <section className="cheat-section">
            <h3>Items</h3>
            <div style={{ marginBottom: "1rem", fontSize: "12px", color: "#94a3b8" }}>
              Spawn items into your inventory. Only adds if you have available inventory slots.
            </div>
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <div key={category} style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px", textTransform: "capitalize" }}>
                  {category}
                </h4>
                <div className="cheat-buttons" style={{ flexWrap: "wrap" }}>
                  {items.map((item) => (
                    <button
                      key={item.id}
                      className="btn btn-outline btn-small"
                      onClick={() => handleSpawnItem(item.id)}
                      title={item.description}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
