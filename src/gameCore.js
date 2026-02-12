// Core data models and game logic, adapted for React usage.

export const JOB_CATEGORIES = {
  LEGAL: "legal",
  ILLEGAL: "illegal",
  GOVERNMENT: "government",
};

export const SKILL_IDS = {
  STRENGTH: "strength",
  INTELLIGENCE: "intelligence",
  CHARISMA: "charisma",
  STREET_SMARTS: "street_smarts",
  LAW: "law",
  BUSINESS: "business",
};

export const BASE_SKILLS = [
  { id: SKILL_IDS.STRENGTH, name: "Strength" },
  { id: SKILL_IDS.INTELLIGENCE, name: "Intelligence" },
  { id: SKILL_IDS.CHARISMA, name: "Charisma" },
  { id: SKILL_IDS.STREET_SMARTS, name: "Street Smarts" },
  { id: SKILL_IDS.LAW, name: "Law" },
  { id: SKILL_IDS.BUSINESS, name: "Business" },
];

// Jobs are now area-specific
// Each job has an areaId that determines where it's available
export const BASE_JOBS = [
  // Metropolis Area Jobs
  {
    id: "fast_food_worker",
    name: "Fast Food Worker",
    category: JOB_CATEGORIES.LEGAL,
    areaId: "metropolis",
    description: "Flip burgers, mop floors, and deal with impatient customers.",
    incomePerShift: 60,
    risk: 0,
    requiredSkills: {},
  },
  {
    id: "drug_dealer",
    name: "Street Dealer",
    category: JOB_CATEGORIES.ILLEGAL,
    areaId: "metropolis",
    description: "Move product in the shadows for big, risky payouts.",
    incomePerShift: 280,
    risk: 40,
    requiredSkills: {
      [SKILL_IDS.STREET_SMARTS]: 8,
      [SKILL_IDS.CHARISMA]: 4,
    },
  },
  // Suburbs Area Jobs
  {
    id: "farm_hand",
    name: "Farm Hand",
    category: JOB_CATEGORIES.LEGAL,
    areaId: "suburbs",
    description: "Work the fields, care for animals, and get paid in sweat.",
    incomePerShift: 75,
    risk: 0,
    requiredSkills: { [SKILL_IDS.STRENGTH]: 5 },
  },
  // Industrial Area Jobs
  {
    id: "factory_worker",
    name: "Factory Worker",
    category: JOB_CATEGORIES.LEGAL,
    areaId: "industrial",
    description: "Work the assembly line, clock in, clock out, repeat.",
    incomePerShift: 90,
    risk: 5,
    requiredSkills: { [SKILL_IDS.STRENGTH]: 3 },
  },
  {
    id: "warehouse_worker",
    name: "Warehouse Worker",
    category: JOB_CATEGORIES.LEGAL,
    areaId: "industrial",
    description: "Move boxes, load trucks, and keep the supply chain moving.",
    incomePerShift: 85,
    risk: 3,
    requiredSkills: { [SKILL_IDS.STRENGTH]: 4 },
  },
  {
    id: "arms_seller",
    name: "Illegal Arms Seller",
    category: JOB_CATEGORIES.ILLEGAL,
    areaId: "industrial",
    description: "Supply weapons to people you hope to never meet again.",
    incomePerShift: 450,
    risk: 65,
    requiredSkills: {
      [SKILL_IDS.STREET_SMARTS]: 12,
      [SKILL_IDS.BUSINESS]: 8,
    },
  },
  // Downtown Area Jobs
  {
    id: "police_officer",
    name: "Police Officer",
    category: JOB_CATEGORIES.GOVERNMENT,
    areaId: "downtown",
    description: "Protect the city, enforce the law, and survive the politics.",
    incomePerShift: 160,
    risk: 15,
    requiredSkills: {
      [SKILL_IDS.STRENGTH]: 7,
      [SKILL_IDS.LAW]: 5,
    },
  },
  {
    id: "lawyer",
    name: "Lawyer",
    category: JOB_CATEGORIES.GOVERNMENT,
    areaId: "downtown",
    description: "Turn words and loopholes into money and influence.",
    incomePerShift: 260,
    risk: 0,
    requiredSkills: {
      [SKILL_IDS.INTELLIGENCE]: 10,
      [SKILL_IDS.LAW]: 10,
      [SKILL_IDS.CHARISMA]: 6,
    },
  },
  {
    id: "governor",
    name: "Governor",
    category: JOB_CATEGORIES.GOVERNMENT,
    areaId: "downtown",
    description: "Run the state. Or let donors run it for you.",
    incomePerShift: 500,
    risk: 5,
    requiredSkills: {
      [SKILL_IDS.INTELLIGENCE]: 14,
      [SKILL_IDS.CHARISMA]: 14,
      [SKILL_IDS.LAW]: 12,
      [SKILL_IDS.BUSINESS]: 10,
    },
  },
];

// Businesses are now area-specific
export const BASE_BUSINESSES = [
  // Metropolis Area Businesses
  {
    id: "food_truck",
    name: "Food Truck",
    legality: "legal",
    areaId: "metropolis",
    description: "Park, cook, and hustle the lunch crowd.",
    costToStart: 4000,
    upkeepPerDay: 80,
    expectedProfitPerDay: 200,
    requiredSkills: {
      [SKILL_IDS.BUSINESS]: 5,
    },
  },
  {
    id: "nightclub",
    name: "Nightclub",
    legality: "mixed",
    areaId: "metropolis",
    description: "Loud music, high margins, and even higher risks.",
    costToStart: 12000,
    upkeepPerDay: 280,
    expectedProfitPerDay: 600,
    requiredSkills: {
      [SKILL_IDS.BUSINESS]: 10,
      [SKILL_IDS.CHARISMA]: 10,
    },
  },
  // Suburbs Area Businesses
  {
    id: "convenience_store",
    name: "Convenience Store",
    legality: "legal",
    areaId: "suburbs",
    description: "A neighborhood staple, open late for the community.",
    costToStart: 3500,
    upkeepPerDay: 70,
    expectedProfitPerDay: 180,
    requiredSkills: {
      [SKILL_IDS.BUSINESS]: 4,
    },
  },
  // Industrial Area Businesses
  {
    id: "warehouse_business",
    name: "Warehouse Business",
    legality: "legal",
    areaId: "industrial",
    description: "Store and distribute goods for profit.",
    costToStart: 8000,
    upkeepPerDay: 150,
    expectedProfitPerDay: 350,
    requiredSkills: {
      [SKILL_IDS.BUSINESS]: 8,
    },
  },
  {
    id: "black_market_network",
    name: "Black Market Network",
    legality: "illegal",
    areaId: "industrial",
    description: "Move anything, anywhere, for the right price.",
    costToStart: 18000,
    upkeepPerDay: 650,
    expectedProfitPerDay: 1600,
    requiredSkills: {
      [SKILL_IDS.STREET_SMARTS]: 14,
      [SKILL_IDS.BUSINESS]: 12,
    },
  },
  // Downtown Area Businesses
  {
    id: "law_firm",
    name: "Law Firm",
    legality: "legal",
    areaId: "downtown",
    description: "Bill by the hour and weaponize paperwork.",
    costToStart: 20000,
    upkeepPerDay: 500,
    expectedProfitPerDay: 1100,
    requiredSkills: {
      [SKILL_IDS.LAW]: 14,
      [SKILL_IDS.BUSINESS]: 12,
    },
  },
];

// City Areas (same for all cities)
export const CITY_AREAS = [
  {
    id: "metropolis",
    name: "Metropolis",
    description: "A bustling city where opportunity and danger walk hand in hand.",
  },
  {
    id: "suburbs",
    name: "The Suburbs",
    description: "Quiet streets, steady jobs, and a slower pace of life.",
  },
  {
    id: "industrial",
    name: "Industrial District",
    description: "Factories, warehouses, and hard work define this area.",
  },
  {
    id: "downtown",
    name: "Downtown",
    description: "The heart of commerce, law, and high-stakes business.",
  },
];

// Cities
export const CITIES = [
  {
    id: "los_angeles",
    name: "Los Angeles",
    country: "USA",
    description: "The City of Angels, where dreams are made and broken.",
  },
  {
    id: "chicago",
    name: "Chicago",
    country: "USA",
    description: "The Windy City, a hub of industry and opportunity.",
  },
  {
    id: "new_york",
    name: "New York",
    country: "USA",
    description: "The Big Apple, where ambition meets opportunity.",
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    description: "The capital of the United Kingdom, rich in history and opportunity.",
  },
  {
    id: "moscow",
    name: "Moscow",
    country: "Russia",
    description: "The capital of Russia, where power and opportunity converge.",
  },
  {
    id: "beijing",
    name: "Beijing",
    country: "China",
    description: "The capital of China, a city of ancient tradition and modern ambition.",
  },
];

// Starting locations are now cities
export const STARTING_LOCATIONS = CITIES.map((city) => ({
  id: city.id,
  name: `${city.name}, ${city.country}`,
  description: city.description,
}));

export const CHARACTER_BACKGROUNDS = [
  {
    id: "street_rat",
    name: "Street Rat",
    description: "You grew up on the streets, learning to survive by any means necessary.",
    skillBoosts: {
      [SKILL_IDS.STREET_SMARTS]: 3,
      [SKILL_IDS.CHARISMA]: 1,
    },
  },
  {
    id: "college_grad",
    name: "College Graduate",
    description: "You have a degree and the knowledge to back it up.",
    skillBoosts: {
      [SKILL_IDS.INTELLIGENCE]: 3,
      [SKILL_IDS.LAW]: 1,
    },
  },
  {
    id: "business_heir",
    name: "Business Heir",
    description: "Born into wealth, you understand money and influence.",
    skillBoosts: {
      [SKILL_IDS.BUSINESS]: 3,
      [SKILL_IDS.CHARISMA]: 1,
    },
  },
  {
    id: "athlete",
    name: "Former Athlete",
    description: "Your physical prowess and discipline set you apart.",
    skillBoosts: {
      [SKILL_IDS.STRENGTH]: 3,
      [SKILL_IDS.CHARISMA]: 1,
    },
  },
  {
    id: "military",
    name: "Military Veteran",
    description: "Discipline, strength, and a no-nonsense approach to life.",
    skillBoosts: {
      [SKILL_IDS.STRENGTH]: 2,
      [SKILL_IDS.INTELLIGENCE]: 1,
      [SKILL_IDS.STREET_SMARTS]: 1,
    },
  },
  {
    id: "blank_slate",
    name: "Blank Slate",
    description: "A fresh start with no advantages or disadvantages.",
    skillBoosts: {},
  },
];

export const SAVE_KEY_PREFIX = "conquer_life_save_slot_";
export const SAVE_KEY = "conquer_life_save_v1"; // Legacy key for backward compatibility
export const SETTINGS_KEY = "conquer_life_settings_v1";
export const MAX_SAVE_SLOTS = 5;

// Time system: time is stored in minutes since midnight
// 9:00 AM = 540 minutes
const START_TIME_MINUTES = 540; // 9:00 AM

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
export const MAX_SKILL_LEVEL = 100;
const BASE_EXP = 100; // Base EXP for level 1->2
const EXP_MULTIPLIER = 1.1; // Exponential growth multiplier

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

// Get current skill level from EXP
export function getSkillLevel(state, skillId) {
  const exp = state.skills[skillId] ?? 0;
  return getLevelFromExp(exp);
}

// Get current skill EXP
export function getSkillExp(state, skillId) {
  return state.skills[skillId] ?? 0;
}

// Get EXP needed for next level
export function getExpNeededForNextLevel(state, skillId) {
  const currentLevel = getSkillLevel(state, skillId);
  if (currentLevel >= MAX_SKILL_LEVEL) return 0;
  const currentExp = getSkillExp(state, skillId);
  const expForNextLevel = getExpForLevel(currentLevel + 1);
  return expForNextLevel - currentExp;
}

// Calculate training cost and sessions needed to reach next level
export function calculateTrainToNextLevel(state, skillId) {
  const currentLevel = getSkillLevel(state, skillId);
  if (currentLevel >= MAX_SKILL_LEVEL) {
    return { sessions: 0, totalCost: 0, days: 0 };
  }

  const currentExp = getSkillExp(state, skillId);
  const expForNextLevel = getExpForLevel(currentLevel + 1);
  const expNeeded = expForNextLevel - currentExp;
  
  const energyCost = 15;
  const baseMoneyCost = 30;
  let totalCost = 0;
  let totalExpGained = 0;
  let sessions = 0;
  let level = currentLevel;
  let simulatedExp = currentExp;
  
  // Simulate training sessions until we reach next level
  while (level < currentLevel + 1 && level < MAX_SKILL_LEVEL) {
    const moneyCost = baseMoneyCost + level * 5;
    const expGained = Math.max(1, Math.floor(moneyCost * (1 - level * 0.005)));
    
    totalCost += moneyCost;
    totalExpGained += expGained;
    simulatedExp += expGained;
    sessions++;
    
    // Check if we leveled up during training
    const newLevel = getLevelFromExp(simulatedExp);
    if (newLevel > level) {
      level = newLevel;
      // If we've reached the target level, we're done
      if (level >= currentLevel + 1) {
        break;
      }
    }
  }
  
  // Calculate days needed
  // Each training session uses 15 energy
  // Each day provides 100 energy (assuming full energy at start of day)
  // So we can do floor(100/15) = 6 sessions per day (with 10 energy left)
  const sessionsPerDay = Math.floor(100 / energyCost); // 6 sessions per day
  const days = Math.ceil(sessions / sessionsPerDay);
  
  return { sessions, totalCost, days };
}

export function canTakeJob(state, job) {
  const missing = [];
  for (const [skillId, requiredLevel] of Object.entries(job.requiredSkills)) {
    const current = getSkillLevel(state, skillId);
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

export function workShift(state, jobId) {
  const job = BASE_JOBS.find((j) => j.id === jobId);
  if (!job) return state;

  // Check if player is in the correct location for this job
  if (state.location?.areaId !== job.areaId) {
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
  if (!state.cheats?.unlimitedEnergy && state.player.energy < 15) {
    pushLog(
      state,
      "You're too exhausted to work another shift. Get some rest first."
    );
    return state;
  }

  const income = job.incomePerShift;
  const energyCost = 20;
  state.player.money += income;
  // Only decrease energy if unlimited energy cheat is not enabled
  if (!state.cheats?.unlimitedEnergy) {
    state.player.energy = clamp(state.player.energy - energyCost, 0, 100);
  } else {
    state.player.energy = 100; // Keep at max if unlimited energy is enabled
  }
  
  // Advance time based on energy cost
  advanceTime(state, energyCost);

  if (job.category === JOB_CATEGORIES.ILLEGAL) {
    const notorietyGain = Math.round(job.risk / 8);
    state.player.notoriety = clamp(
      state.player.notoriety + notorietyGain,
      0,
      100
    );

    const bustedChance = job.risk / 100;
    if (Math.random() < bustedChance) {
      const fine = Math.min(state.player.money, income * 2);
      state.player.money -= fine;
      state.player.notoriety = clamp(
        state.player.notoriety + 10,
        0,
        100
      );
      pushLog(
        state,
        `You get busted running ${job.name}. You pay a fine of $${fine}.`
      );
    } else {
      pushLog(
        state,
        `You run a risky ${job.name} shift and make $${income} without getting caught.`
      );
    }
  } else {
    pushLog(
      state,
      `You work a shift as ${job.name} and earn $${income}.`
    );
  }

  const skillToRaise = Object.keys(job.requiredSkills)[0];
  if (skillToRaise) {
    // Add EXP for skill gain from work (equivalent to gaining enough EXP for 1 level)
    const currentExp = getSkillExp(state, skillToRaise);
    const currentLevel = getSkillLevel(state, skillToRaise);
    if (currentLevel < MAX_SKILL_LEVEL) {
      const expForCurrentLevel = getExpForLevel(currentLevel);
      const expForNextLevel = getExpForLevel(currentLevel + 1);
      const expNeededForNextLevel = expForNextLevel - expForCurrentLevel;
      // Give enough EXP to level up once
      state.skills[skillToRaise] = Math.min(
        expForNextLevel,
        getExpForLevel(MAX_SKILL_LEVEL)
      );
    }
  } else {
    // Add EXP for charisma gain from work
    const currentExp = getSkillExp(state, SKILL_IDS.CHARISMA);
    const currentLevel = getSkillLevel(state, SKILL_IDS.CHARISMA);
    if (currentLevel < MAX_SKILL_LEVEL) {
      const expForCurrentLevel = getExpForLevel(currentLevel);
      const expForNextLevel = getExpForLevel(currentLevel + 1);
      // Give enough EXP to level up once
      state.skills[SKILL_IDS.CHARISMA] = Math.min(
        expForNextLevel,
        getExpForLevel(MAX_SKILL_LEVEL)
      );
    }
  }

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
  if (!state.cheats?.unlimitedEnergy && state.player.energy < energyCost) {
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
    state.player.energy = clamp(state.player.energy - energyCost, 0, 100);
  } else {
    state.player.energy = 100; // Keep at max if unlimited energy is enabled
  }
  state.player.money -= moneyCost;
  
  // Calculate EXP gained: money spent determines EXP (1 EXP per $1 spent, with slight diminishing returns at higher levels)
  const expGained = Math.max(1, Math.floor(moneyCost * (1 - currentLevel * 0.005))); // Slight diminishing returns
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
    
    // If we don't have enough energy, advance the day to rest (unless unlimited energy is enabled)
    if (!state.cheats?.unlimitedEnergy && state.player.energy < energyCost) {
      // Advance day to rest and restore energy
      advanceDay(state);
      // Fully restore energy after resting
      state.player.energy = 100;
      pushLog(state, `You rest for the night and wake up refreshed, ready to continue training.`);
    } else if (state.cheats?.unlimitedEnergy) {
      // Keep energy at max if unlimited energy is enabled
      state.player.energy = 100;
    }
    
    state.player.money -= moneyCost;
    // Only decrease energy if unlimited energy cheat is not enabled
    if (!state.cheats?.unlimitedEnergy) {
      state.player.energy = clamp(state.player.energy - energyCost, 0, 100);
    } else {
      state.player.energy = 100; // Keep at max if unlimited energy is enabled
    }
    totalCost += moneyCost;
    totalExpGained += expGained;
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

  // Only increase energy if unlimited energy cheat is not enabled (it will stay at 100 anyway)
  if (!state.cheats?.unlimitedEnergy) {
    state.player.energy = clamp(state.player.energy + 30, 0, 100);
  } else {
    state.player.energy = 100; // Keep at max if unlimited energy is enabled
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
    state.player.health = clamp(state.player.health - 3, 0, 100);
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

// Location helper functions
export function getJobsForLocation(cityId, areaId) {
  return BASE_JOBS.filter((job) => job.areaId === areaId);
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
  if (!isInterCity && !state.cheats?.unlimitedEnergy && state.player.energy < energyCost) {
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
  if (isInterCity) {
    state.currentDay += 1;
    state.currentTime = START_TIME_MINUTES; // Reset to 9:00 AM
    state.player.energy = 100; // Full energy after sleeping during travel
    pushLog(state, `You travel from ${oldCity.name} to ${city.name}, arriving in the ${area.name} the next day. Cost: $${travelCost}. You feel refreshed after the journey.`);
    return { success: true, state, shouldAutoSave: true };
  } else {
    // Intra-city travel: use energy
    // Only decrease energy if unlimited energy cheat is not enabled
    if (!state.cheats?.unlimitedEnergy) {
      state.player.energy = clamp(state.player.energy - energyCost, 0, 100);
      pushLog(state, `You travel to the ${area.name} in ${city.name}. Cost: $${travelCost}, Energy: -${energyCost}`);
    } else {
      state.player.energy = 100; // Keep at max if unlimited energy is enabled
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

// Check if player can do any jobs in an area with given background
export function canDoAnyJobInArea(areaId, backgroundId) {
  const startingSkills = getStartingSkills(backgroundId);
  const areaJobs = BASE_JOBS.filter((job) => job.areaId === areaId);
  
  if (areaJobs.length === 0) return false;
  
  // Check if at least one job has no requirements or player meets requirements
  return areaJobs.some((job) => {
    if (Object.keys(job.requiredSkills).length === 0) return true;
    
    for (const [skillId, requiredLevel] of Object.entries(job.requiredSkills)) {
      const currentLevel = startingSkills[skillId] || 1;
      if (currentLevel < requiredLevel) {
        return false;
      }
    }
    return true;
  });
}

// Get job and business counts for an area
export function getAreaOpportunities(areaId) {
  const jobs = BASE_JOBS.filter((job) => job.areaId === areaId);
  const businesses = BASE_BUSINESSES.filter((business) => business.areaId === areaId);
  
  return {
    jobCount: jobs.length,
    businessCount: businesses.length,
  };
}

// Item and Equipment System
export const EQUIPMENT_SLOTS = {
  HEAD: "head",
  CHEST: "chest",
  LEGS: "legs",
  HANDS: "hands",
  EYE: "eye",
  FACE: "face",
  BAG: "bag",
  RING: "ring",
  NECKLACE: "necklace",
  MELEE: "melee",
  GUN: "gun",
};

// Item categories for shop filters. Clothing = head, chest, legs, hands, eye, face. Accessories = bag, ring, necklace. Weapons = melee, gun.
export const ITEM_CATEGORIES = {
  CLOTHING: "clothing",
  ACCESSORIES: "accessories",
  WEAPONS: "weapons",
  FOOD: "food",
  CONSUMABLES: "consumables",
};

export const EQUIPMENT_SLOT_CATEGORY = {
  [EQUIPMENT_SLOTS.HEAD]: ITEM_CATEGORIES.CLOTHING,
  [EQUIPMENT_SLOTS.CHEST]: ITEM_CATEGORIES.CLOTHING,
  [EQUIPMENT_SLOTS.LEGS]: ITEM_CATEGORIES.CLOTHING,
  [EQUIPMENT_SLOTS.HANDS]: ITEM_CATEGORIES.CLOTHING,
  [EQUIPMENT_SLOTS.EYE]: ITEM_CATEGORIES.CLOTHING,
  [EQUIPMENT_SLOTS.FACE]: ITEM_CATEGORIES.CLOTHING,
  [EQUIPMENT_SLOTS.BAG]: ITEM_CATEGORIES.ACCESSORIES,
  [EQUIPMENT_SLOTS.RING]: ITEM_CATEGORIES.ACCESSORIES,
  [EQUIPMENT_SLOTS.NECKLACE]: ITEM_CATEGORIES.ACCESSORIES,
  [EQUIPMENT_SLOTS.MELEE]: ITEM_CATEGORIES.WEAPONS,
  [EQUIPMENT_SLOTS.GUN]: ITEM_CATEGORIES.WEAPONS,
};

export const BASE_ITEMS = [
  // ---- SUBURBS ----
  {
    id: "small_bag",
    name: "Small Bag",
    description: "A small bag that increases inventory capacity from 5 to 6 slots.",
    type: "bag",
    slot: EQUIPMENT_SLOTS.BAG,
    inventoryBonus: 1,
    price: 50,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "small_backpack",
    name: "Small Backpack",
    description: "A small backpack that increases inventory capacity from 5 to 8 slots.",
    type: "bag",
    slot: EQUIPMENT_SLOTS.BAG,
    inventoryBonus: 3,
    price: 150,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "hoodie_suburbs",
    name: "Casual Hoodie",
    description: "Comfortable hoodie for the suburbs.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.CHEST,
    price: 35,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "baseball_cap",
    name: "Baseball Cap",
    description: "A simple baseball cap.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.HEAD,
    price: 20,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "sneakers",
    name: "Sneakers",
    description: "Everyday sneakers.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.LEGS,
    price: 45,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "work_gloves_suburbs",
    name: "Garden Gloves",
    description: "Light gloves for yard work.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.HANDS,
    price: 12,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "reading_glasses",
    name: "Reading Glasses",
    description: "Simple reading glasses.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.EYE,
    price: 25,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "bandana_suburbs",
    name: "Bandana",
    description: "A casual bandana.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.FACE,
    price: 8,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "rope_bracelet",
    name: "Rope Bracelet",
    description: "A simple rope bracelet.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.RING,
    price: 5,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "dog_tag_chain",
    name: "Dog Tag Chain",
    description: "A basic chain for a dog tag.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.NECKLACE,
    price: 15,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "pocket_knife",
    name: "Pocket Knife",
    description: "A small folding pocket knife.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.MELEE,
    price: 30,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.WEAPONS,
  },
  {
    id: "sandwich",
    name: "Deli Sandwich",
    description: "A hearty deli sandwich. Restores some health and energy.",
    type: "consumable",
    price: 8,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.FOOD,
  },
  {
    id: "apple_pie",
    name: "Apple Pie Slice",
    description: "A slice of homemade apple pie.",
    type: "consumable",
    price: 6,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.FOOD,
  },
  {
    id: "lemonade",
    name: "Lemonade",
    description: "Fresh lemonade. Refreshing.",
    type: "consumable",
    price: 4,
    areaId: "suburbs",
    category: ITEM_CATEGORIES.FOOD,
  },
  // ---- METROPOLIS ----
  {
    id: "designer_cap",
    name: "Designer Cap",
    description: "A high-end designer cap.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.HEAD,
    price: 120,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "blazer",
    name: "Designer Blazer",
    description: "A sharp designer blazer.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.CHEST,
    price: 280,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "designer_pants",
    name: "Designer Trousers",
    description: "Tailored designer trousers.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.LEGS,
    price: 180,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "leather_driving_gloves",
    name: "Leather Driving Gloves",
    description: "Elegant leather driving gloves.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.HANDS,
    price: 95,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "aviators",
    name: "Aviator Sunglasses",
    description: "Classic aviator sunglasses.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.EYE,
    price: 150,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "silk_scarf",
    name: "Silk Scarf",
    description: "A luxurious silk scarf.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.FACE,
    price: 75,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "designer_messenger",
    name: "Designer Messenger Bag",
    description: "Increases inventory capacity from 5 to 10 slots. Luxury brand.",
    type: "bag",
    slot: EQUIPMENT_SLOTS.BAG,
    inventoryBonus: 5,
    price: 450,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "signet_ring",
    name: "Signet Ring",
    description: "An understated signet ring.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.RING,
    price: 200,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "gold_chain",
    name: "Gold Chain",
    description: "A fine gold chain.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.NECKLACE,
    price: 320,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "titanium_briefcase",
    name: "Titanium Briefcase",
    description: "A reinforced briefcase that doubles as a melee weapon.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.MELEE,
    price: 380,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.WEAPONS,
  },
  {
    id: "sushi_platter",
    name: "Sushi Platter",
    description: "Fresh sushi. Restores health and energy.",
    type: "consumable",
    price: 35,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.FOOD,
  },
  {
    id: "espresso_martini",
    name: "Espresso Martini",
    description: "A premium espresso martini.",
    type: "consumable",
    price: 22,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.FOOD,
  },
  {
    id: "caviar_toast",
    name: "Caviar Toast",
    description: "Luxury caviar on toast.",
    type: "consumable",
    price: 55,
    areaId: "metropolis",
    category: ITEM_CATEGORIES.FOOD,
  },
  // ---- INDUSTRIAL ----
  {
    id: "hard_hat",
    name: "Hard Hat",
    description: "Safety hard hat for industrial work.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.HEAD,
    price: 28,
    areaId: "industrial",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "work_jacket",
    name: "Work Jacket",
    description: "Durable heavy-duty work jacket.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.CHEST,
    price: 65,
    areaId: "industrial",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "steel_toe_boots",
    name: "Steel-Toe Boots",
    description: "Industrial steel-toe boots.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.LEGS,
    price: 85,
    areaId: "industrial",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "work_gloves_industrial",
    name: "Heavy Work Gloves",
    description: "Thick gloves for machinery and welding.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.HANDS,
    price: 22,
    areaId: "industrial",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "safety_goggles",
    name: "Safety Goggles",
    description: "Industrial safety goggles.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.EYE,
    price: 18,
    areaId: "industrial",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "dust_mask",
    name: "Dust Mask",
    description: "Respirator-style dust mask.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.FACE,
    price: 14,
    areaId: "industrial",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "tool_bag",
    name: "Tool Bag",
    description: "Increases inventory from 5 to 9 slots. Built for tools.",
    type: "bag",
    slot: EQUIPMENT_SLOTS.BAG,
    inventoryBonus: 4,
    price: 95,
    areaId: "industrial",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "welders_ring",
    name: "Welder's Ring",
    description: "A simple metal ring; no risk of spark.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.RING,
    price: 12,
    areaId: "industrial",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "id_lanyard",
    name: "ID Lanyard",
    description: "Company ID on a lanyard.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.NECKLACE,
    price: 6,
    areaId: "industrial",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "wrench_melee",
    name: "Wrench",
    description: "Heavy wrench. Effective in a pinch.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.MELEE,
    price: 42,
    areaId: "industrial",
    category: ITEM_CATEGORIES.WEAPONS,
  },
  {
    id: "energy_drink",
    name: "Energy Drink",
    description: "High caffeine. Restores energy quickly.",
    type: "consumable",
    price: 5,
    areaId: "industrial",
    category: ITEM_CATEGORIES.FOOD,
  },
  {
    id: "protein_bar",
    name: "Protein Bar",
    description: "High-protein bar for long shifts.",
    type: "consumable",
    price: 4,
    areaId: "industrial",
    category: ITEM_CATEGORIES.FOOD,
  },
  {
    id: "thermos_soup",
    name: "Thermos of Soup",
    description: "Hot soup. Restores health and energy.",
    type: "consumable",
    price: 7,
    areaId: "industrial",
    category: ITEM_CATEGORIES.FOOD,
  },
  // ---- DOWNTOWN ----
  {
    id: "fedora",
    name: "Fedora",
    description: "A classic fedora for downtown style.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.HEAD,
    price: 55,
    areaId: "downtown",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "dress_shirt",
    name: "Dress Shirt",
    description: "Crisp white dress shirt.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.CHEST,
    price: 72,
    areaId: "downtown",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "dress_pants",
    name: "Dress Pants",
    description: "Professional dress pants.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.LEGS,
    price: 68,
    areaId: "downtown",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "dress_gloves",
    name: "Dress Gloves",
    description: "Formal leather gloves.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.HANDS,
    price: 48,
    areaId: "downtown",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "wire_frame_glasses",
    name: "Wire-Frame Glasses",
    description: "Professional wire-frame glasses.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.EYE,
    price: 90,
    areaId: "downtown",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "face_mask_black",
    name: "Black Face Mask",
    description: "Discreet black face mask.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.FACE,
    price: 10,
    areaId: "downtown",
    category: ITEM_CATEGORIES.CLOTHING,
  },
  {
    id: "briefcase_bag",
    name: "Leather Briefcase",
    description: "Increases inventory from 5 to 8 slots. Professional look.",
    type: "bag",
    slot: EQUIPMENT_SLOTS.BAG,
    inventoryBonus: 3,
    price: 165,
    areaId: "downtown",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "class_ring",
    name: "Class Ring",
    description: "A classic class ring.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.RING,
    price: 85,
    areaId: "downtown",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "tie_clip",
    name: "Tie Clip",
    description: "A sleek tie clip worn as a necklace.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.NECKLACE,
    price: 35,
    areaId: "downtown",
    category: ITEM_CATEGORIES.ACCESSORIES,
  },
  {
    id: "taser",
    name: "Taser",
    description: "Compact taser for self-defense.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.GUN,
    price: 120,
    areaId: "downtown",
    category: ITEM_CATEGORIES.WEAPONS,
  },
  {
    id: "pepper_spray",
    name: "Pepper Spray",
    description: "Small canister of pepper spray.",
    type: "equipment",
    slot: EQUIPMENT_SLOTS.MELEE,
    price: 18,
    areaId: "downtown",
    category: ITEM_CATEGORIES.WEAPONS,
  },
  {
    id: "hamburger",
    name: "Hamburger",
    description: "A delicious hamburger. Restores some health and energy.",
    type: "consumable",
    price: 10,
    areaId: "downtown",
    category: ITEM_CATEGORIES.FOOD,
  },
  {
    id: "coffee_to_go",
    name: "Coffee To-Go",
    description: "Hot coffee. Restores energy.",
    type: "consumable",
    price: 5,
    areaId: "downtown",
    category: ITEM_CATEGORIES.FOOD,
  },
  {
    id: "weed",
    name: "Weed",
    description: "Some weed. Use at your own risk.",
    type: "consumable",
    price: 25,
    areaId: "downtown",
    category: ITEM_CATEGORIES.CONSUMABLES,
  },
];

// Items available in shops (any area); for backward compatibility. Prefer getShopItemsForArea(areaId).
export const SHOP_ITEMS = BASE_ITEMS.filter((item) => item.price !== undefined);

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