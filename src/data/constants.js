// Save, settings, and game constants.

export const SAVE_KEY_PREFIX = "conquer_life_save_slot_";
export const SAVE_KEY = "conquer_life_save_v1"; // Legacy key for backward compatibility
export const SETTINGS_KEY = "conquer_life_settings_v1";
export const MAX_SAVE_SLOTS = 5;

// Time system: 9:00 AM = 540 minutes (used internally in gameCore)
export const START_TIME_MINUTES = 540;

// Skill system
export const MAX_SKILL_LEVEL = 100;
export const BASE_EXP = 100;
export const EXP_MULTIPLIER = 1.1;
