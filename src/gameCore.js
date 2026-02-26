// Core game logic; data lives in ./data/

import {
  SKILL_IDS,
  BASE_SKILLS,
  SAVE_KEY_PREFIX,
  SAVE_KEY,
  SETTINGS_KEY,
  MAX_SAVE_SLOTS,
  START_TIME_MINUTES,
  MAX_SKILL_LEVEL,
  BASE_EXP,
  EXP_MULTIPLIER,
  BASE_SHIFT_EXP,
  SHIFT_CATEGORIES,
  SHIFTS,
  SHIFT_QUALITIES,
  SHIFT_QUALITY_RARITIES,
  SHIFT_EVENTS,
  SHIFT_NORMAL_OUTCOMES,
  BASE_BUSINESSES,
  CITY_AREAS,
  CITIES,
  STARTING_LOCATIONS,
  CHARACTER_BACKGROUNDS,
  EQUIPMENT_SLOTS,
  ITEM_CATEGORIES,
  EQUIPMENT_SLOT_CATEGORY,
  BASE_ITEMS,
  SHOP_ITEMS,
} from "./data/index.js";

// Re-export data so existing imports from gameCore still work
export {
  SKILL_IDS,
  BASE_SKILLS,
  SHIFT_CATEGORIES,
  SHIFTS,
  SHIFT_QUALITIES,
  SHIFT_QUALITY_RARITIES,
  SHIFT_EVENTS,
  BASE_BUSINESSES,
  CITY_AREAS,
  CITIES,
  STARTING_LOCATIONS,
  CHARACTER_BACKGROUNDS,
  EQUIPMENT_SLOTS,
  ITEM_CATEGORIES,
  EQUIPMENT_SLOT_CATEGORY,
  BASE_ITEMS,
  SHOP_ITEMS,
  SAVE_KEY_PREFIX,
  SAVE_KEY,
  SETTINGS_KEY,
  MAX_SAVE_SLOTS,
  MAX_SKILL_LEVEL,
};

function rollShiftQuality() {
  const roll = Math.random() * 100;
  let acc = 0;
  for (const [quality, weight] of Object.entries(SHIFT_QUALITY_RARITIES)) {
    acc += weight;
    if (roll < acc) return quality;
  }
  return SHIFT_QUALITIES.NORMAL;
}

export function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMins = mins.toString().padStart(2, "0");
  return `${displayHours}:${displayMins} ${period}`;
}

export function advanceTime(state, energyCost) {
  // Each energy point = 6 minutes (1 hour per 10 energy)
  // So 20 energy = 2 hours = 120 minutes
  const timeToAdd = (energyCost / 10) * 60;
  state.currentTime = (state.currentTime || START_TIME_MINUTES) + timeToAdd;
  
  // Cap at 11:59 PM (1439 minutes)
  if (state.currentTime >= 1440) {
    state.currentTime = 1439;
  }
  
  return state.currentTime;
}

export function createNewGameState(characterData = null) {
  const skills = {};
  BASE_SKILLS.forEach((skill) => {
    skills[skill.id] = 1;
  });

  // Apply background skill boosts if character data is provided
  if (characterData?.background) {
    const background = CHARACTER_BACKGROUNDS.find(
      (bg) => bg.id === characterData.background
    );
    if (background) {
      Object.entries(background.skillBoosts).forEach(([skillId, boost]) => {
        // Convert level boost to EXP boost
        const currentExp = skills[skillId] || 0;
        const currentLevel = getLevelFromExp(currentExp);
        const targetLevel = currentLevel + boost;
        skills[skillId] = getExpForLevel(targetLevel);
      });
    }
  }

  const firstName = characterData?.firstName || "Newcomer";
  const lastName = characterData?.lastName || "";
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;

  // Support both new format (cityId/areaId) and old format (location)
  const startingCity = characterData?.cityId || characterData?.location || "los_angeles";
  const startingArea = characterData?.areaId || "metropolis";
  const background = characterData?.background || "blank_slate";

  const cityData = CITIES.find((c) => c.id === startingCity);
  const areaData = CITY_AREAS.find((a) => a.id === startingArea);
  const backgroundData = CHARACTER_BACKGROUNDS.find((bg) => bg.id === background);

  return {
    player: {
      firstName,
      lastName,
      fullName,
      age: 18,
      energy: 100,
      health: 100,
      money: 500,
      notoriety: 0,
      respect: 0,
    },
    character: {
      location: startingCity,
      background,
    },
    location: {
      cityId: startingCity,
      areaId: startingArea,
    },
    skills,
    currentDay: 1,
    currentTime: START_TIME_MINUTES, // 9:00 AM
    currentJobId: null,
    ownedBusinesses: [],
    activeView: "jobs",
    jobsFilter: "all",
    cheats: {
      unlimitedEnergy: false,
      showCheatMenu: false,
      achievementsEnabled: true,
    },
    log: [
      {
        day: 1,
        time: START_TIME_MINUTES,
        text: `${fullName} arrives in ${cityData?.name || startingCity}, ${cityData?.country || ""} in the ${areaData?.name || startingArea} with big ambitions and a small stash of cash. ${backgroundData?.description || ""}`,
      },
    ],
  };
}

export function getSaveSlotKey(slotNumber) {
  return `${SAVE_KEY_PREFIX}${slotNumber}`;
}

export function loadGameState(slotNumber = null) {
  if (typeof window === "undefined") return createNewGameState();
  try {
    // If slotNumber is provided, use that slot
    let raw = null;
    if (slotNumber !== null && slotNumber >= 1 && slotNumber <= MAX_SAVE_SLOTS) {
      raw = window.localStorage.getItem(getSaveSlotKey(slotNumber));
    }
    
    // If no slot specified or slot is empty, try legacy save
    if (!raw) {
      raw = window.localStorage.getItem(SAVE_KEY);
    }
    
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    const state = {
      ...createNewGameState(),
      ...parsed,
    };
    // Ensure currentTime exists for old saves
    if (state.currentTime === undefined) {
      state.currentTime = START_TIME_MINUTES;
    }
    // Ensure lastSaved exists
    if (!state.lastSaved) {
      state.lastSaved = Date.now();
    }
    // Ensure location exists for old saves
    if (!state.location) {
      const startingCity = state.character?.location || "los_angeles";
      state.location = {
        cityId: startingCity,
        areaId: "metropolis", // Default to metropolis area
      };
    }
    
    // Migrate old skill system (levels) to new EXP system
    // Old saves stored skills as levels (1-20), new system stores EXP
    // If a skill value is <= 20, it's likely an old level and needs conversion
    if (state.skills) {
      BASE_SKILLS.forEach((skill) => {
        const skillValue = state.skills[skill.id];
        // If the value is <= 20, it's likely an old level (old max was 20)
        // Convert to EXP equivalent
        if (skillValue !== undefined && skillValue <= 20 && skillValue >= 1) {
          state.skills[skill.id] = getExpForLevel(skillValue);
        } else if (skillValue === undefined || skillValue === null) {
          // If skill doesn't exist, start at level 1 (0 EXP)
          state.skills[skill.id] = 0;
        }
        // If skillValue > 20, assume it's already EXP (from a newer save)
      });
    }
    
    // Ensure cheats object exists
    if (!state.cheats) {
      state.cheats = {
        unlimitedEnergy: false,
        showCheatMenu: false,
        achievementsEnabled: true,
      };
    } else {
      // Migrate old cheat state
      if (state.cheats.achievementsEnabled === undefined) {
        // If showCheatMenu was enabled, achievements should be disabled
        state.cheats.achievementsEnabled = !state.cheats.showCheatMenu;
      }
      if (state.cheats.showCheatMenu === undefined) {
        state.cheats.showCheatMenu = false;
      }
    }
    
    return state;
  } catch {
    return null;
  }
}

export function saveGameState(state, slotNumber = null) {
  if (typeof window === "undefined") return false;
  try {
    const toSave = {
      ...state,
      log: state.log.slice(-80),
      lastSaved: Date.now(),
    };
    
    // If slotNumber is provided, save to that slot
    if (slotNumber !== null && slotNumber >= 1 && slotNumber <= MAX_SAVE_SLOTS) {
      window.localStorage.setItem(getSaveSlotKey(slotNumber), JSON.stringify(toSave));
      return true;
    }
    
    // Otherwise save to legacy key (for backward compatibility)
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
    return true;
  } catch {
    return false;
  }
}

export function getAllSaveSlots() {
  if (typeof window === "undefined") return [];
  const slots = [];
  for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
    try {
      const raw = window.localStorage.getItem(getSaveSlotKey(i));
      if (raw) {
        const parsed = JSON.parse(raw);
        slots.push({
          slotNumber: i,
          characterName: parsed.player?.fullName || parsed.player?.name || "Unknown",
          day: parsed.currentDay || 1,
          lastSaved: parsed.lastSaved || 0,
          money: parsed.player?.money || 0,
          // Cheats were used if achievements are disabled (once disabled, they stay disabled)
          cheatsEnabled: parsed.cheats?.achievementsEnabled === false,
        });
      }
    } catch {
      // Skip invalid saves
    }
  }
  return slots;
}

export function deleteSaveSlot(slotNumber) {
  if (typeof window === "undefined") return false;
  if (slotNumber < 1 || slotNumber > MAX_SAVE_SLOTS) return false;
  try {
    window.localStorage.removeItem(getSaveSlotKey(slotNumber));
    return true;
  } catch {
    return false;
  }
}

export function loadSettings() {
  if (typeof window === "undefined") {
    return {
      showMainMenuOnLoad: true,
      autoLoadSave: false,
      defaultSaveSlot: null,
      autoSaveAfterDay: true,
      autoSaveInterval: null, // null, 1, 3, or 5 (minutes)
    };
  }
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return {
        showMainMenuOnLoad: true,
        autoLoadSave: false,
        defaultSaveSlot: null,
        autoSaveAfterDay: true,
        autoSaveInterval: null,
      };
    }
    const settings = JSON.parse(raw);
    // Ensure new settings fields exist
    return {
      showMainMenuOnLoad: settings.showMainMenuOnLoad !== undefined ? settings.showMainMenuOnLoad : true,
      autoLoadSave: settings.autoLoadSave !== undefined ? settings.autoLoadSave : false,
      defaultSaveSlot: settings.defaultSaveSlot || settings.defaultSaveKey || null,
      autoSaveAfterDay: settings.autoSaveAfterDay !== undefined ? settings.autoSaveAfterDay : true,
      autoSaveInterval: settings.autoSaveInterval || null,
    };
  } catch {
    return {
      showMainMenuOnLoad: true,
      autoLoadSave: false,
      defaultSaveSlot: null,
      autoSaveAfterDay: true,
      autoSaveInterval: null,
    };
  }
}

export function saveSettings(settings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}

// EXP system constants
// Calculate total EXP needed to reach a specific level
export function getExpForLevel(level) {
  if (level <= 1) return 0;
  let totalExp = 0;
  // Calculate EXP for each level transition from 1 to level-1
  // This gives us the total EXP needed to reach the target level
  for (let i = 1; i < level; i++) {
    totalExp += BASE_EXP * Math.pow(EXP_MULTIPLIER, i - 1);
  }
  return Math.floor(totalExp);
}

// Calculate level from total EXP
export function getLevelFromExp(totalExp) {
  if (totalExp <= 0) return 1;
  
  // Check if we have enough EXP for max level first
  const expForMaxLevel = getExpForLevel(MAX_SKILL_LEVEL);
  if (totalExp >= expForMaxLevel) {
    return MAX_SKILL_LEVEL;
  }
  
  let level = 1;
  let expNeeded = 0;
  
  // Calculate level by accumulating EXP needed for each level transition
  while (level < MAX_SKILL_LEVEL) {
    const expForNextLevel = BASE_EXP * Math.pow(EXP_MULTIPLIER, level - 1);
    if (expNeeded + expForNextLevel > totalExp) {
      break;
    }
    expNeeded += expForNextLevel;
    level++;
  }
  
  return level;
}

// Base energy and health (before equipment bonuses)
const BASE_ENERGY = 100;
const BASE_HEALTH = 100;

// Get max energy from base + equipped item bonuses
export function getMaxEnergy(state) {
  let bonus = 0;
  const equipment = state.equipment || {};
  for (const itemId of Object.values(equipment)) {
    const item = BASE_ITEMS.find((i) => i.id === itemId);
    if (item?.energyBonus) bonus += item.energyBonus;
  }
  return BASE_ENERGY + bonus;
}

// Get max health from base + equipped item bonuses
export function getMaxHealth(state) {
  let bonus = 0;
  const equipment = state.equipment || {};
  for (const itemId of Object.values(equipment)) {
    const item = BASE_ITEMS.find((i) => i.id === itemId);
    if (item?.healthBonus) bonus += item.healthBonus;
  }
  return BASE_HEALTH + bonus;
}

// Get current skill level from EXP
export function getSkillLevel(state, skillId) {
  const exp = state.skills[skillId] ?? 0;
  return getLevelFromExp(exp);
}

// Get level bonus from equipped items only (actual level is unchanged; this is the "invisible" boost)
export function getSkillLevelBonus(state, skillId) {
  let bonus = 0;
  const equipment = state.equipment || {};
  for (const itemId of Object.values(equipment)) {
    const item = BASE_ITEMS.find((i) => i.id === itemId);
    const levelBonus = item?.skillLevelBonus?.[skillId];
    if (levelBonus) bonus += levelBonus;
  }
  return bonus;
}

// Get effective skill level (actual level + equipment bonus; what jobs/mechanics use)
export function getEffectiveSkillLevel(state, skillId) {
  return getSkillLevel(state, skillId) + getSkillLevelBonus(state, skillId);
}

// Get total skill bonuses from all equipped items for display in Skills view
export function getEquippedSkillBonuses(state) {
  const levelBonuses = {};
  const expBonuses = {};
  const equipment = state.equipment || {};
  for (const itemId of Object.values(equipment)) {
    const item = BASE_ITEMS.find((i) => i.id === itemId);
    if (item?.skillLevelBonus && typeof item.skillLevelBonus === "object") {
      for (const [skillId, levels] of Object.entries(item.skillLevelBonus)) {
        if (levels > 0) levelBonuses[skillId] = (levelBonuses[skillId] ?? 0) + levels;
      }
    }
    if (item?.skillExpBonus && typeof item.skillExpBonus === "object") {
      for (const [skillId, mult] of Object.entries(item.skillExpBonus)) {
        if (mult > 1) expBonuses[skillId] = (expBonuses[skillId] ?? 1) * mult;
      }
    }
  }
  return { levelBonuses, expBonuses };
}

// Get skill EXP multiplier from equipped items (e.g. 1.1 = +10% when training that skill)
export function getSkillExpMultiplier(state, skillId) {
  let mult = 1;
  const equipment = state.equipment || {};
  for (const itemId of Object.values(equipment)) {
    const item = BASE_ITEMS.find((i) => i.id === itemId);
    const m = item?.skillExpBonus?.[skillId];
    if (m) mult *= m;
  }
  return mult;
}

// Get current skill EXP
export function getSkillExp(state, skillId) {
  return state.skills[skillId] ?? 0;
}

// Apply a delta to skill EXP (positive or negative). Clamps to [0, getExpForLevel(MAX_SKILL_LEVEL)].
export function addSkillExp(state, skillId, delta) {
  const current = getSkillExp(state, skillId);
  const maxExp = getExpForLevel(MAX_SKILL_LEVEL);
  state.skills[skillId] = clamp(Math.floor(current + delta), 0, maxExp);
}

// Get EXP needed for next level
export function getExpNeededForNextLevel(state, skillId) {
  const currentLevel = getSkillLevel(state, skillId);
  if (currentLevel >= MAX_SKILL_LEVEL) return 0;
  const currentExp = getSkillExp(state, skillId);
  const expForNextLevel = getExpForLevel(currentLevel + 1);
  return expForNextLevel - currentExp;
}

// EXP gained from one Train click (for display in Skills view)
export function getTrainSkillExpPerClick(state, skillId) {
  const currentLevel = getSkillLevel(state, skillId);
  const baseMoneyCost = 30;
  const moneyCost = baseMoneyCost + currentLevel * 5;
  const baseExp = Math.max(1, Math.floor(moneyCost * (1 - currentLevel * 0.005)));
  const multiplier = getSkillExpMultiplier(state, skillId);
  const totalExp = Math.floor(baseExp * multiplier);
  const bonusExp = totalExp - baseExp;
  return { baseExp, multiplier, totalExp, bonusExp };
}

// Calculate training cost and sessions needed to reach next level (matches trainSkillToNextLevel logic including EXP multiplier)
export function calculateTrainToNextLevel(state, skillId) {
  const currentLevel = getSkillLevel(state, skillId);
  if (currentLevel >= MAX_SKILL_LEVEL) {
    return { sessions: 0, totalCost: 0, days: 0, totalExpGained: 0 };
  }

  const currentExp = getSkillExp(state, skillId);
  
  const energyCost = 15;
  const baseMoneyCost = 30;
  const expMultiplier = getSkillExpMultiplier(state, skillId);
  let totalCost = 0;
  let totalExpGained = 0;
  let sessions = 0;
  let level = currentLevel;
  let simulatedExp = currentExp;
  
  // Simulate training sessions until we reach next level (apply multiplier like trainSkillToNextLevel)
  while (level < currentLevel + 1 && level < MAX_SKILL_LEVEL) {
    const moneyCost = baseMoneyCost + level * 5;
    const expGained = Math.max(1, Math.floor(moneyCost * (1 - level * 0.005)));
    const expWithMultiplier = Math.floor(expGained * expMultiplier);
    
    totalCost += moneyCost;
    totalExpGained += expWithMultiplier;
    simulatedExp += expWithMultiplier;
    sessions++;
    
    const newLevel = getLevelFromExp(simulatedExp);
    if (newLevel > level) {
      level = newLevel;
      if (level >= currentLevel + 1) {
        break;
      }
    }
  }
  
  const energyRestoredPerDay = getMaxEnergy(state);
  const totalEnergyNeeded = sessions * energyCost;
  const sessionsPerDay = Math.floor(energyRestoredPerDay / energyCost);
  const currentEnergy = state.cheats?.unlimitedEnergy ? getMaxEnergy(state) : (state.player?.energy ?? 0);
  const sessionsDoableToday = Math.floor(currentEnergy / energyCost);
  let days;
  if (sessionsDoableToday >= sessions) {
    days = 0;
  } else {
    const remainingSessions = sessions - sessionsDoableToday;
    days = Math.ceil(remainingSessions / sessionsPerDay);
  }

  return {
    sessions,
    totalCost,
    days,
    totalEnergyNeeded,
    energyRestoredPerDay,
    totalExpGained,
  };
}

export function canTakeJob(state, job) {
  const missing = [];
  for (const [skillId, requiredLevel] of Object.entries(job.requiredSkills)) {
    const current = getEffectiveSkillLevel(state, skillId);
    if (current < requiredLevel) {
      missing.push({ skillId, requiredLevel, current });
    }
  }
  return { ok: missing.length === 0, missing };
}

// Check if player can see job/business details (meets requirements)
export function canSeeJobDetails(state, job) {
  return canTakeJob(state, job).ok;
}

export function canSeeBusinessDetails(state, business) {
  const { ok } = canStartBusiness(state, business);
  // For visibility, we only care about skill requirements, not money
  const { ok: skillOk } = canTakeJob(state, {
    requiredSkills: business.requiredSkills,
  });
  return skillOk;
}

// Get job name with ??? if requirements not met
export function getJobDisplayName(state, job) {
  return canSeeJobDetails(state, job) ? job.name : "???";
}

// Get business name with ??? if requirements not met
export function getBusinessDisplayName(state, business) {
  return canSeeBusinessDetails(state, business) ? business.name : "???";
}

// Get job pay with ??? if requirements not met
export function getJobDisplayPay(state, job) {
  return canSeeJobDetails(state, job) ? formatMoney(job.incomePerShift) : "???";
}

// Check if a background can see job details (for character creator)
export function canBackgroundSeeJob(job, backgroundId) {
  const startingSkills = getStartingSkills(backgroundId);
  for (const [skillId, requiredLevel] of Object.entries(job.requiredSkills)) {
    const current = startingSkills[skillId] || 1;
    if (current < requiredLevel) {
      return false;
    }
  }
  return true;
}

// Check if a background can see business details (for character creator)
export function canBackgroundSeeBusiness(business, backgroundId) {
  const startingSkills = getStartingSkills(backgroundId);
  for (const [skillId, requiredLevel] of Object.entries(business.requiredSkills)) {
    const current = startingSkills[skillId] || 1;
    if (current < requiredLevel) {
      return false;
    }
  }
  return true;
}

export function canStartBusiness(state, biz) {
  if (state.player.money < biz.costToStart) {
    return { ok: false, reason: "Not enough money" };
  }
  const { ok, missing } = canTakeJob(state, {
    requiredSkills: biz.requiredSkills,
  });
  if (!ok) {
    return { ok: false, reason: "Skills too low", missing };
  }
  // Check if business is already owned in the same city/area combination
  const currentCityId = state.location?.cityId;
  const currentAreaId = state.location?.areaId || biz.areaId;
  const already = state.ownedBusinesses.find(
    (b) => b.id === biz.id && b.cityId === currentCityId && b.areaId === currentAreaId
  );
  if (already) {
    return { ok: false, reason: "You already own this business in this location" };
  }
  return { ok: true };
}

export function pushLog(state, text) {
  state.log.push({
    day: state.currentDay,
    time: state.currentTime || START_TIME_MINUTES,
    text,
  });
}

// Build effects list for shift result UI (rewards and penalties).
function buildShiftEffects(income, moneyMod, skillExpMod, notorietyMod, job) {
  const effects = [];
  const totalMoney = income + (moneyMod || 0);
  effects.push({
    type: "money",
    value: totalMoney,
    isBonus: (moneyMod || 0) > 0,
    isPenalty: (moneyMod || 0) < 0,
  });
  if (skillExpMod && typeof skillExpMod === "object") {
    for (const [skillId, expDelta] of Object.entries(skillExpMod)) {
      if (expDelta === 0) continue;
      const skillName = BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId;
      effects.push({
        type: "skill",
        skillId,
        skillName,
        value: expDelta,
        isBonus: expDelta > 0,
        isPenalty: expDelta < 0,
      });
    }
  }
  if (notorietyMod !== undefined && notorietyMod !== 0) {
    effects.push({
      type: "notoriety",
      value: notorietyMod,
      isBonus: notorietyMod < 0,
      isPenalty: notorietyMod > 0,
    });
  }
  return effects;
}

export function workShift(state, jobId) {
  const job = SHIFTS.find((j) => j.id === jobId);
  if (!job) return state;

  // Check if player is in the correct location for this shift (area + city if shift is city-specific)
  const wrongArea = state.location?.areaId !== job.areaId;
  const wrongCity = job.cityId != null && state.location?.cityId !== job.cityId;
  if (wrongArea || wrongCity) {
    const area = getAreaById(job.areaId);
    pushLog(
      state,
      `You need to be in ${area?.name || "the correct location"} to work as ${job.name}.`
    );
    return state;
  }

  const { ok, missing } = canTakeJob(state, job);
  if (!ok) {
    pushLog(
      state,
      `You try to get a shift as ${job.name}, but you don't meet the requirements.`
    );
    if (missing.length) {
      const detail = missing
        .map((m) => {
          const skillName =
            BASE_SKILLS.find((s) => s.id === m.skillId)?.name ?? m.skillId;
          return `${skillName} ${m.current}/${m.requiredLevel}`;
        })
        .join(", ");
      pushLog(state, `Missing skills: ${detail}.`);
    }
    return state;
  }

  // Check energy requirement (bypass if unlimited energy cheat is enabled)
  const workEnergyCost = 20;
  const maxEnergy = getMaxEnergy(state);
  const effectiveEnergy = Math.min(state.player.energy ?? 0, maxEnergy);
  if (!state.cheats?.unlimitedEnergy && effectiveEnergy < workEnergyCost) {
    pushLog(
      state,
      "You're too exhausted to work another shift. Get some rest first."
    );
    return state;
  }

  const baseIncome = job.incomePerShift;
  const energyCost = workEnergyCost;

  // Only decrease energy if unlimited energy cheat is not enabled
  if (!state.cheats?.unlimitedEnergy) {
    state.player.energy = clamp(state.player.energy - energyCost, 0, maxEnergy);
  } else {
    state.player.energy = maxEnergy;
  }
  advanceTime(state, energyCost);

  // Clear previous result so the shift menu only shows this shift's outcome
  state.lastShiftResult = null;
  const moneyBeforeShift = state.player.money;

  const quality = rollShiftQuality();
  const jobEvents = SHIFT_EVENTS[job.id];
  let description;
  let moneyMod = 0;
  let skillExpMod = {};
  let notorietyMod = 0;

  if (quality === SHIFT_QUALITIES.NORMAL || !jobEvents || !jobEvents[quality]) {
    // Normal shift: base pay only, and for illegal jobs possible bust. All copy from shiftEvents.
    const normal = SHIFT_NORMAL_OUTCOMES;
    const fill = (template, moneyVal = baseIncome) =>
      template.replace(/\{jobName\}/g, job.name).replace(/\{money\}/g, formatMoney(moneyVal));

    if (job.category === SHIFT_CATEGORIES.ILLEGAL) {
      const notorietyGain = Math.round(job.risk / 8);
      state.player.notoriety = clamp(
        state.player.notoriety + notorietyGain,
        0,
        100
      );
      const bustedChance = job.risk / 100;
      if (Math.random() < bustedChance) {
        const fine = Math.min(state.player.money, baseIncome * 2);
        state.player.money -= fine;
        const bustNotoriety = normal.illegal.busted.notorietyMod;
        state.player.notoriety = clamp(
          state.player.notoriety + bustNotoriety,
          0,
          100
        );
        description = fill(normal.illegal.busted.description);
        const netBusted = baseIncome - fine;
        state.player.money += baseIncome; // we hadn't added yet; net is baseIncome - fine
        pushLog(state, description);
        state.lastShiftResult = {
          jobId: job.id,
          jobName: job.name,
          quality,
          busted: true,
          moneyBeforeShift,
          description,
          effects: buildShiftEffects(baseIncome, -fine, {}, bustNotoriety, job),
          moneyDelta: netBusted,
        };
        state.requestOpenShiftMenu = true;
        return state;
      }
      description = fill(normal.illegal.clean.description);
      state.player.money += baseIncome;
      pushLog(state, description);
    } else {
      description = fill(normal.legal.descriptionWithPay);
      state.player.money += baseIncome;
      pushLog(state, description);
    }
    // Base skill gain for normal shift (fixed base amount, no scaling)
    const skillToRaise = Object.keys(job.requiredSkills)[0] || SKILL_IDS.CHARISMA;
    if (getSkillLevel(state, skillToRaise) < MAX_SKILL_LEVEL) {
      const expToAdd = BASE_SHIFT_EXP;
      addSkillExp(state, skillToRaise, expToAdd);
      skillExpMod = { [skillToRaise]: expToAdd };
    }
    state.lastShiftResult = {
      jobId: job.id,
      jobName: job.name,
      quality,
      moneyBeforeShift,
      description,
      effects: buildShiftEffects(baseIncome, 0, skillExpMod, job.category === SHIFT_CATEGORIES.ILLEGAL ? Math.round(job.risk / 8) : 0, job),
      moneyDelta: baseIncome,
    };
    state.requestOpenShiftMenu = true;
    return state;
  }

  // Non-normal: pick random event for this job and quality
  const events = jobEvents[quality];
  const event = events[Math.floor(Math.random() * events.length)];
  description = event.description;
  const moneyModProvided = event.moneyMod !== undefined;
  moneyMod = event.moneyMod ?? 0;
  skillExpMod = event.skillExpMod ? { ...event.skillExpMod } : {};
  notorietyMod = event.notorietyMod ?? 0;

  // Bad/very bad: if moneyMod omitted → base pay only (and skillExpMod applies). If moneyMod provided → no base pay, penalty only.
  // Good/very good: earn base pay + bonus (moneyMod)
  const isBadOutcome = quality === SHIFT_QUALITIES.BAD || quality === SHIFT_QUALITIES.VERY_BAD;
  const totalMoney = isBadOutcome
    ? (moneyModProvided ? moneyMod : baseIncome)
    : baseIncome + moneyMod;
  state.player.money += totalMoney;

  if (job.category === SHIFT_CATEGORIES.ILLEGAL) {
    const baseNotoriety = Math.round(job.risk / 8);
    state.player.notoriety = clamp(
      state.player.notoriety + baseNotoriety + notorietyMod,
      0,
      100
    );
  }

  for (const [skillId, expDelta] of Object.entries(skillExpMod)) {
    addSkillExp(state, skillId, expDelta);
  }

  pushLog(state, description);
  state.lastShiftResult = {
    jobId: job.id,
    jobName: job.name,
    quality,
    moneyBeforeShift,
    description,
    moneyDelta: totalMoney,
    effects: buildShiftEffects(
      isBadOutcome ? (moneyModProvided ? 0 : baseIncome) : baseIncome,
      isBadOutcome && moneyModProvided ? moneyMod : (isBadOutcome ? 0 : moneyMod),
      skillExpMod,
      job.category === SHIFT_CATEGORIES.ILLEGAL ? Math.round(job.risk / 8) + notorietyMod : notorietyMod,
      job
    ),
  };
  state.requestOpenShiftMenu = true;
  return state;
}

export function trainSkill(state, skillId) {
  const currentLevel = getSkillLevel(state, skillId);
  if (currentLevel >= MAX_SKILL_LEVEL) {
    pushLog(
      state,
      `Your ${BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId} is already maxed out.`
    );
    return state;
  }

  const energyCost = 15;
  const baseMoneyCost = 30;
  const moneyCost = baseMoneyCost + currentLevel * 5;

  // Check energy requirement (bypass if unlimited energy cheat is enabled)
  const maxEnergyTrain = getMaxEnergy(state);
  const effectiveEnergyTrain = Math.min(state.player.energy ?? 0, maxEnergyTrain);
  if (!state.cheats?.unlimitedEnergy && effectiveEnergyTrain < energyCost) {
    pushLog(state, "You're too tired to train right now.");
    return state;
  }
  if (state.player.money < moneyCost) {
    pushLog(
      state,
      `You can't afford the $${moneyCost} needed to train right now.`
    );
    return state;
  }

  // Only decrease energy if unlimited energy cheat is not enabled
  if (!state.cheats?.unlimitedEnergy) {
    state.player.energy = clamp(state.player.energy - energyCost, 0, maxEnergyTrain);
  } else {
    state.player.energy = maxEnergyTrain; // Keep at max if unlimited energy is enabled
  }
  state.player.money -= moneyCost;
  
  // Calculate EXP gained: money spent determines EXP (1 EXP per $1 spent, with slight diminishing returns at higher levels)
  let expGained = Math.max(1, Math.floor(moneyCost * (1 - currentLevel * 0.005))); // Slight diminishing returns
  expGained = Math.floor(expGained * getSkillExpMultiplier(state, skillId));
  const currentExp = getSkillExp(state, skillId);
  const newExp = currentExp + expGained;
  const newLevel = getLevelFromExp(newExp);
  
  // Store EXP, not level
  state.skills[skillId] = Math.min(newExp, getExpForLevel(MAX_SKILL_LEVEL));
  
  // Advance time based on energy cost
  advanceTime(state, energyCost);

  const skillName =
    BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId;
  
  if (newLevel > currentLevel) {
    pushLog(
      state,
      `You invest in training and your ${skillName} rises to level ${newLevel}! (+${expGained} EXP)`
    );
  } else {
    pushLog(
      state,
      `You train your ${skillName} and gain ${expGained} EXP. (Level ${currentLevel})`
    );
  }

  return state;
}

export function trainSkillToNextLevel(state, skillId) {
  const currentLevel = getSkillLevel(state, skillId);
  if (currentLevel >= MAX_SKILL_LEVEL) {
    pushLog(
      state,
      `Your ${BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId} is already maxed out.`
    );
    return state;
  }

  const currentExp = getSkillExp(state, skillId);
  const expForCurrentLevel = getExpForLevel(currentLevel);
  const expForNextLevel = getExpForLevel(currentLevel + 1);
  const expNeeded = expForNextLevel - currentExp;
  
  const energyCost = 15;
  const baseMoneyCost = 30;
  let totalCost = 0;
  let totalExpGained = 0;
  let sessions = 0;
  let level = currentLevel;
  
  // Simulate training sessions until we reach next level
  while (level < currentLevel + 1 && level < MAX_SKILL_LEVEL) {
    const moneyCost = baseMoneyCost + level * 5;
    const expGained = Math.max(1, Math.floor(moneyCost * (1 - level * 0.005)));
    
    // Check if we have enough money
    if (state.player.money < moneyCost) {
      if (sessions > 0) {
        pushLog(
          state,
          `You trained ${sessions} time(s) but ran out of money. Need $${moneyCost - state.player.money} more to continue. Gained ${totalExpGained} EXP.`
        );
      } else {
        pushLog(
          state,
          `You don't have enough money to train to the next level. Need $${moneyCost} to start.`
        );
      }
      return state;
    }
    
    const maxEnergy = getMaxEnergy(state);
    // If we don't have enough energy, advance the day to rest (unless unlimited energy is enabled)
    if (!state.cheats?.unlimitedEnergy && state.player.energy < energyCost) {
      // Advance day to rest and restore energy
      advanceDay(state);
      // Fully restore energy after resting
      state.player.energy = getMaxEnergy(state);
      pushLog(state, `You rest for the night and wake up refreshed, ready to continue training.`);
    } else if (state.cheats?.unlimitedEnergy) {
      // Keep energy at max if unlimited energy is enabled
      state.player.energy = maxEnergy;
    }
    
    state.player.money -= moneyCost;
    // Only decrease energy if unlimited energy cheat is not enabled
    if (!state.cheats?.unlimitedEnergy) {
      state.player.energy = clamp(state.player.energy - energyCost, 0, maxEnergy);
    } else {
      state.player.energy = maxEnergy; // Keep at max if unlimited energy is enabled
    }
    totalCost += moneyCost;
    const expMultiplier = getSkillExpMultiplier(state, skillId);
    totalExpGained += Math.floor(expGained * expMultiplier);
    sessions++;
    
    // Advance time
    advanceTime(state, energyCost);
    
    // Check if we leveled up during training
    const newExp = currentExp + totalExpGained;
    const newLevel = getLevelFromExp(newExp);
    if (newLevel > level) {
      level = newLevel;
      // If we've reached the target level, we're done
      if (level >= currentLevel + 1) {
        break;
      }
    }
  }
  
  // Update skill EXP
  const finalExp = currentExp + totalExpGained;
  state.skills[skillId] = Math.min(finalExp, getExpForLevel(MAX_SKILL_LEVEL));
  
  const skillName = BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId;
  const finalLevel = getLevelFromExp(finalExp);
  
  if (finalLevel > currentLevel) {
    pushLog(
      state,
      `You train intensively and your ${skillName} rises to level ${finalLevel}! (${sessions} sessions, ${formatMoney(totalCost)})`
    );
  } else {
    pushLog(
      state,
      `You train ${sessions} time(s) and gain ${totalExpGained} EXP. (${formatMoney(totalCost)})`
    );
  }

  return state;
}

export function startBusiness(state, businessId) {
  const biz = BASE_BUSINESSES.find((b) => b.id === businessId);
  if (!biz) return state;

  const { ok, reason } = canStartBusiness(state, biz);
  if (!ok) {
    pushLog(
      state,
      `You can't start ${biz.name} yet. ${reason || "Requirements not met."}`
    );
    return state;
  }

  state.player.money -= biz.costToStart;
  state.ownedBusinesses.push({
    id: biz.id,
    name: biz.name,
    profitability: 1,
    cityId: state.location?.cityId,
    areaId: state.location?.areaId || biz.areaId,
  });
  
  // Starting a business takes time (30 minutes for paperwork/setup)
  advanceTime(state, 5); // 5 energy worth = 30 minutes
  
  pushLog(
    state,
    `You launch ${biz.name}, investing $${biz.costToStart} into your new venture.`
  );
  return state;
}

export function advanceDay(state) {
  state.currentDay += 1;
  // Reset time to 9:00 AM at the start of each new day
  state.currentTime = START_TIME_MINUTES;

  if (state.ownedBusinesses.length > 0) {
    let net = 0;
    state.ownedBusinesses.forEach((owned) => {
      const biz = BASE_BUSINESSES.find((b) => b.id === owned.id);
      if (!biz) return;
      const variance = (Math.random() - 0.5) * 0.4;
      const factor = Math.max(0.5, owned.profitability + variance);
      const profit =
        biz.expectedProfitPerDay * factor - biz.upkeepPerDay;
      net += profit;
    });

    const roundedNet = Math.round(net);
    state.player.money += roundedNet;
    if (roundedNet >= 0) {
      pushLog(
        state,
        `Your businesses bring in a net profit of $${roundedNet} today.`
      );
    } else {
      pushLog(
        state,
        `Your businesses lose $${Math.abs(
          roundedNet
        )} today after expenses.`
      );
    }
  }

  // Only increase energy if unlimited energy cheat is not enabled (it will stay at max anyway)
  const maxEnergy = getMaxEnergy(state);
  if (!state.cheats?.unlimitedEnergy) {
    state.player.energy = clamp(state.player.energy + 30, 0, maxEnergy);
  } else {
    state.player.energy = maxEnergy; // Keep at max if unlimited energy is enabled
  }

  if (state.player.notoriety > 40 && Math.random() < 0.1) {
    const penalty = Math.min(state.player.money, 200);
    state.player.money -= penalty;
    state.player.notoriety = clamp(
      state.player.notoriety - 8,
      0,
      100
    );
    pushLog(
      state,
      `Your past catches up with you. You pay $${penalty} in legal and cleanup costs.`
    );
  }

  if (state.player.money < 0) {
    state.player.health = clamp(state.player.health - 3, 0, getMaxHealth(state));
  }

  if (state.player.health <= 0) {
    pushLog(
      state,
      "Your health collapses under the weight of your choices. Your run is effectively over."
    );
  }

  saveGameState(state);
  return state;
}

export function formatMoney(amount) {
  const sign = amount < 0 ? "-" : "";
  const value = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${sign}$${value}`;
}

// Location helper functions: shifts available in a (city, area). Omit cityId on shift = available in all cities.
export function getShiftsForLocation(cityId, areaId) {
  return SHIFTS.filter(
    (shift) =>
      shift.areaId === areaId &&
      (shift.cityId == null || shift.cityId === cityId)
  );
}

export function getBusinessesForLocation(cityId, areaId) {
  return BASE_BUSINESSES.filter((business) => business.areaId === areaId);
}

export function getCityById(cityId) {
  return CITIES.find((c) => c.id === cityId);
}

export function getAreaById(areaId) {
  return CITY_AREAS.find((a) => a.id === areaId);
}

export function travelToLocation(state, cityId, areaId) {
  const city = getCityById(cityId);
  const area = getAreaById(areaId);
  
  if (!city || !area) {
    pushLog(state, "Invalid location. Travel cancelled.");
    return { success: false, state };
  }

  const oldCity = getCityById(state.location?.cityId);
  const oldArea = getAreaById(state.location?.areaId);
  
  // Check if already at this location
  if (oldCity?.id === cityId && oldArea?.id === areaId) {
    pushLog(state, "You are already at this location.");
    return { success: false, state };
  }

  const isInterCity = oldCity && oldCity.id !== cityId;
  const travelCost = isInterCity ? 200 : 50;
  const energyCost = isInterCity ? 0 : 10; // Energy cost for intra-city travel
  
  if (state.player.money < travelCost) {
    pushLog(state, `You need $${travelCost} to travel. You don't have enough money.`);
    return { success: false, state };
  }

  // Check energy requirement (bypass if unlimited energy cheat is enabled)
  const travelMaxEnergy = getMaxEnergy(state);
  const travelEffectiveEnergy = Math.min(state.player.energy ?? 0, travelMaxEnergy);
  if (!isInterCity && !state.cheats?.unlimitedEnergy && travelEffectiveEnergy < energyCost) {
    pushLog(state, `You need ${energyCost} energy to travel within the city. You're too tired.`);
    return { success: false, state };
  }

  state.player.money -= travelCost;
  
  // Clear current job if traveling to a different area
  if (oldArea?.id !== areaId) {
    state.currentJobId = null;
  }
  
  state.location = {
    cityId,
    areaId,
  };

  // Inter-city travel: advance day, refill energy, trigger auto-save
  const maxEnergy = isInterCity ? getMaxEnergy(state) : travelMaxEnergy;
  if (isInterCity) {
    state.currentDay += 1;
    state.currentTime = START_TIME_MINUTES; // Reset to 9:00 AM
    state.player.energy = maxEnergy; // Full energy after sleeping during travel
    pushLog(state, `You travel from ${oldCity.name} to ${city.name}, arriving in the ${area.name} the next day. Cost: $${travelCost}. You feel refreshed after the journey.`);
    return { success: true, state, shouldAutoSave: true };
  } else {
    // Intra-city travel: use energy
    if (!state.cheats?.unlimitedEnergy) {
      state.player.energy = clamp(state.player.energy - energyCost, 0, maxEnergy);
      pushLog(state, `You travel to the ${area.name} in ${city.name}. Cost: $${travelCost}, Energy: -${energyCost}`);
    } else {
      state.player.energy = maxEnergy; // Keep at max if unlimited energy is enabled
      pushLog(state, `You travel to the ${area.name} in ${city.name}. Cost: $${travelCost}`);
    }
    return { success: true, state, shouldAutoSave: false };
  }
}

// Helper function to calculate starting skills based on background
export function getStartingSkills(backgroundId) {
  const skills = {};
  BASE_SKILLS.forEach((skill) => {
    skills[skill.id] = 0; // Start with 0 EXP (level 1)
  });

  const background = CHARACTER_BACKGROUNDS.find((bg) => bg.id === backgroundId);
  if (background) {
    Object.entries(background.skillBoosts).forEach(([skillId, boost]) => {
      // Convert level boost to EXP boost
      const currentExp = skills[skillId] || 0;
      const currentLevel = getLevelFromExp(currentExp);
      const targetLevel = currentLevel + boost;
      skills[skillId] = getExpForLevel(targetLevel);
    });
  }

  return skills;
}

// Check if player can do any shifts in a (city, area) with given background
export function canDoAnyJobInArea(cityId, areaId, backgroundId) {
  const startingSkills = getStartingSkills(backgroundId);
  const areaShifts = getShiftsForLocation(cityId, areaId);

  if (areaShifts.length === 0) return false;

  return areaShifts.some((shift) => {
    if (Object.keys(shift.requiredSkills).length === 0) return true;
    for (const [skillId, requiredLevel] of Object.entries(shift.requiredSkills)) {
      const currentLevel = startingSkills[skillId] || 1;
      if (currentLevel < requiredLevel) return false;
    }
    return true;
  });
}

// Get shift and business counts for a (city, area)
export function getAreaOpportunities(cityId, areaId) {
  const shifts = getShiftsForLocation(cityId, areaId);
  const businesses = BASE_BUSINESSES.filter((business) => business.areaId === areaId);

  return {
    jobCount: shifts.length,
    businessCount: businesses.length,
  };
}

/** Returns items sold in a given area (same item list for that area in every city). */
export function getShopItemsForArea(areaId) {
  if (!areaId) return [];
  return BASE_ITEMS.filter((item) => item.areaId === areaId && item.price != null);
}

const SLOT_LABELS = {
  [EQUIPMENT_SLOTS.HEAD]: "Head",
  [EQUIPMENT_SLOTS.CHEST]: "Chest",
  [EQUIPMENT_SLOTS.LEGS]: "Legs",
  [EQUIPMENT_SLOTS.HANDS]: "Hands",
  [EQUIPMENT_SLOTS.EYE]: "Eye",
  [EQUIPMENT_SLOTS.FACE]: "Face",
  [EQUIPMENT_SLOTS.BAG]: "Bag",
  [EQUIPMENT_SLOTS.RING]: "Ring",
  [EQUIPMENT_SLOTS.NECKLACE]: "Necklace",
  [EQUIPMENT_SLOTS.MELEE]: "Melee",
  [EQUIPMENT_SLOTS.GUN]: "Gun",
};

/** Returns a short label for item slot (equipment) or category (consumables), for display in shop and inventory. */
export function getItemSlotOrCategoryLabel(item) {
  if (!item) return null;
  if (item.slot && SLOT_LABELS[item.slot]) return SLOT_LABELS[item.slot];
  if (item.category === ITEM_CATEGORIES.FOOD) return "Food";
  if (item.category === ITEM_CATEGORIES.CONSUMABLES) return "Consumable";
  if (item.category) return item.category.charAt(0).toUpperCase() + item.category.slice(1);
  return null;
}

/** Returns an array of bonus description lines for an item (for shop, inventory, equipment tooltips). */
export function getItemBonusLines(item) {
  if (!item) return [];
  const lines = [];
  if (item.energyBonus != null && item.energyBonus > 0) {
    lines.push(`+${item.energyBonus} Max Energy`);
  }
  if (item.healthBonus != null && item.healthBonus > 0) {
    lines.push(`+${item.healthBonus} Max Health`);
  }
  if (item.skillLevelBonus && typeof item.skillLevelBonus === "object") {
    for (const [skillId, levels] of Object.entries(item.skillLevelBonus)) {
      if (levels > 0) {
        const name = BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId;
        lines.push(`+${levels} ${name} (level when equipped)`);
      }
    }
  }
  if (item.skillExpBonus && typeof item.skillExpBonus === "object") {
    for (const [skillId, mult] of Object.entries(item.skillExpBonus)) {
      if (mult > 1) {
        const name = BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId;
        const pct = Math.round((mult - 1) * 100);
        lines.push(`+${pct}% ${name} XP when training`);
      }
    }
  }
  if (item.inventoryBonus != null && item.inventoryBonus > 0) {
    lines.push(`+${item.inventoryBonus} inventory slots`);
  }
  return lines;
}

// Base inventory size (pockets)
export const BASE_INVENTORY_SIZE = 5;

// Get maximum inventory size based on equipped bag
export function getMaxInventorySize(state) {
  const equippedBag = state.equipment?.[EQUIPMENT_SLOTS.BAG];
  if (!equippedBag) {
    return BASE_INVENTORY_SIZE;
  }
  const bagItem = BASE_ITEMS.find((item) => item.id === equippedBag);
  if (!bagItem || !bagItem.inventoryBonus) {
    return BASE_INVENTORY_SIZE;
  }
  return BASE_INVENTORY_SIZE + bagItem.inventoryBonus;
}

// Get current storage tier name
export function getStorageTierName(state) {
  const equippedBag = state.equipment?.[EQUIPMENT_SLOTS.BAG];
  if (!equippedBag) {
    return "Pockets";
  }
  const bagItem = BASE_ITEMS.find((item) => item.id === equippedBag);
  return bagItem?.name || "Pockets";
}

// Get slot type and bag ID for a given slot index
// Returns { type: "pocket" | "bag", bagId: string | null }
export function getSlotType(state, slotIndex) {
  const BASE_SIZE = BASE_INVENTORY_SIZE;
  
  if (slotIndex < BASE_SIZE) {
    return { type: "pocket", bagId: null };
  }
  
  const equippedBag = state.equipment?.[EQUIPMENT_SLOTS.BAG];
  if (!equippedBag) {
    return { type: "pocket", bagId: null };
  }
  
  return { type: "bag", bagId: equippedBag };
}

// Buy item from shop (only when player is in the same area as the shop)
export function buyItem(state, itemId) {
  const item = BASE_ITEMS.find((i) => i.id === itemId);
  if (!item || !item.price) {
    pushLog(state, "Item not available for purchase.");
    return state;
  }

  if (item.areaId && state.location?.areaId !== item.areaId) {
    const area = CITY_AREAS.find((a) => a.id === item.areaId);
    pushLog(state, `You must be in ${area?.name || item.areaId} to buy this item.`);
    return state;
  }

  if (state.player.money < item.price) {
    pushLog(state, `You don't have enough money. You need ${formatMoney(item.price)}.`);
    return state;
  }

  // Check if inventory has space
  const maxSize = getMaxInventorySize(state);
  const currentItems = state.inventory?.length || 0;
  if (currentItems >= maxSize) {
    pushLog(state, `Your inventory is full. You have ${currentItems}/${maxSize} slots used.`);
    return state;
  }

  state.player.money -= item.price;
  if (!state.inventory) {
    state.inventory = [];
  }
  state.inventory = [...state.inventory, itemId];
  pushLog(state, `You bought ${item.name} for ${formatMoney(item.price)}.`);
  return state;
}

// Spawn item (cheat function) - only adds if inventory has space
export function spawnItem(state, itemId) {
  const item = BASE_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    pushLog(state, "Invalid item ID.");
    return state;
  }

  // Check if inventory has space
  const maxSize = getMaxInventorySize(state);
  const currentItems = state.inventory?.length || 0;
  if (currentItems >= maxSize) {
    pushLog(state, `Your inventory is full. You have ${currentItems}/${maxSize} slots used. Cannot spawn ${item.name}.`);
    return state;
  }

  if (!state.inventory) {
    state.inventory = [];
  }
  state.inventory = [...state.inventory, itemId];
  pushLog(state, `Spawned ${item.name} into your inventory.`);
  return state;
}

// Equip item
export function equipItem(state, itemId, slot) {
  if (!state.inventory) {
    state.inventory = [];
  }

  const itemIndex = state.inventory.indexOf(itemId);
  if (itemIndex === -1) {
    pushLog(state, "Item not found in inventory.");
    return state;
  }

  const item = BASE_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    pushLog(state, "Invalid item.");
    return state;
  }

  // If equipping a bag, check if it would cause item loss
  if (slot === EQUIPMENT_SLOTS.BAG && item.type === "bag") {
    const currentMaxSize = getMaxInventorySize(state);
    const newMaxSize = BASE_INVENTORY_SIZE + (item.inventoryBonus || 0);
    const currentItems = state.inventory.length;

    // If new bag is smaller and we have more items than it can hold
    if (newMaxSize < currentMaxSize && currentItems > newMaxSize) {
      // This will be handled by the UI with a warning dialog
      // For now, just return without equipping
      return state;
    }
  }

  // If slot already has an item, unequip it first
  if (!state.equipment) {
    state.equipment = {};
  }
  const currentlyEquipped = state.equipment[slot];
  if (currentlyEquipped) {
    // Add currently equipped item back to inventory
    state.inventory.push(currentlyEquipped);
  }

  // Equip the new item
  state.equipment[slot] = itemId;
  // Remove from inventory
  state.inventory.splice(itemIndex, 1);

  const itemName = item.name;
  pushLog(state, `You equipped ${itemName}.`);

  // If equipping a bag, update inventory size
  if (slot === EQUIPMENT_SLOTS.BAG && item.type === "bag") {
    const newMaxSize = getMaxInventorySize(state);
    pushLog(state, `Your inventory capacity is now ${newMaxSize} slots.`);
  }

  return state;
}

// Unequip item
export function unequipItem(state, slot) {
  if (!state.equipment || !state.equipment[slot]) {
    pushLog(state, "No item equipped in that slot.");
    return state;
  }

  const itemId = state.equipment[slot];
  const item = BASE_ITEMS.find((i) => i.id === itemId);
  
  // If unequipping a bag, check if it would cause item loss
  if (slot === EQUIPMENT_SLOTS.BAG && item?.type === "bag") {
    const currentMaxSize = getMaxInventorySize(state);
    const newMaxSize = BASE_INVENTORY_SIZE; // Back to pockets
    const currentItems = state.inventory?.length || 0;

    // If we have more items than pockets can hold, warn the user
    if (currentItems > newMaxSize) {
      // This will be handled by the UI with a warning dialog
      // For now, just return without unequipping
      return state;
    }
  }

  // Check if inventory has space
  const maxSize = getMaxInventorySize(state);
  const currentItems = state.inventory?.length || 0;
  if (currentItems >= maxSize) {
    pushLog(state, "Your inventory is full. Cannot unequip item.");
    return state;
  }

  if (!state.inventory) {
    state.inventory = [];
  }
  state.inventory.push(itemId);
  delete state.equipment[slot];

  const itemName = item?.name || "item";
  pushLog(state, `You unequipped ${itemName}.`);

  // If unequipping a bag, update inventory size
  if (slot === EQUIPMENT_SLOTS.BAG && item?.type === "bag") {
    pushLog(state, `Your inventory capacity is now ${BASE_INVENTORY_SIZE} slots (Pockets).`);
  }

  return state;
}

// Delete item from inventory
export function deleteItem(state, itemId) {
  if (!state.inventory) {
    state.inventory = [];
  }

  const itemIndex = state.inventory.indexOf(itemId);
  if (itemIndex === -1) {
    pushLog(state, "Item not found in inventory.");
    return state;
  }

  const item = BASE_ITEMS.find((i) => i.id === itemId);
  const itemName = item?.name || "item";
  
  state.inventory = state.inventory.filter((_, i) => i !== itemIndex);
  pushLog(state, `You deleted ${itemName} from your inventory.`);
  return state;
}

// Check if unequipping bag would cause item loss
export function wouldUnequipBagCauseItemLoss(state, slot) {
  if (slot !== EQUIPMENT_SLOTS.BAG) return false;
  
  const itemId = state.equipment?.[slot];
  if (!itemId) return false;
  
  const item = BASE_ITEMS.find((i) => i.id === itemId);
  if (!item || item.type !== "bag") return false;

  const currentMaxSize = getMaxInventorySize(state);
  const newMaxSize = BASE_INVENTORY_SIZE;
  const currentItems = state.inventory?.length || 0;

  return currentItems > newMaxSize;
}

// Check if equipping bag would cause item loss (when switching from larger to smaller)
export function wouldEquipBagCauseItemLoss(state, itemId) {
  const item = BASE_ITEMS.find((i) => i.id === itemId);
  if (!item || item.type !== "bag") return false;

  const currentMaxSize = getMaxInventorySize(state);
  const newMaxSize = BASE_INVENTORY_SIZE + (item.inventoryBonus || 0);
  const currentItems = state.inventory?.length || 0;

  // If new bag is smaller and we have more items than it can hold
  return newMaxSize < currentMaxSize && currentItems > newMaxSize;
}