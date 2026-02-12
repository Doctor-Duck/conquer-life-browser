// Re-export all game data for use by gameCore and optional direct imports.

export { SKILL_IDS, BASE_SKILLS } from "./skills.js";
export { SAVE_KEY_PREFIX, SAVE_KEY, SETTINGS_KEY, MAX_SAVE_SLOTS, START_TIME_MINUTES, MAX_SKILL_LEVEL, BASE_EXP, EXP_MULTIPLIER } from "./constants.js";
export { SHIFT_CATEGORIES, SHIFTS } from "./shifts.js";
export { SHIFT_QUALITIES, SHIFT_QUALITY_RARITIES, SHIFT_EVENTS } from "./shiftEvents.js";
export { BASE_BUSINESSES } from "./businesses.js";
export { CITY_AREAS, CITIES, STARTING_LOCATIONS } from "./locations.js";
export { CHARACTER_BACKGROUNDS } from "./character.js";
export {
  EQUIPMENT_SLOTS,
  ITEM_CATEGORIES,
  EQUIPMENT_SLOT_CATEGORY,
  BASE_ITEMS,
  SHOP_ITEMS,
} from "./items.js";
