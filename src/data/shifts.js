// Shift categories and shift definitions.
// Each shift has areaId (required) and optional cityId.
// If cityId is omitted, the shift is available in that area in all cities.
// If cityId is set, the shift is only available in that city's area (for unique/city-specific shifts).

import { SKILL_IDS } from "./skills.js";

export const SHIFT_CATEGORIES = {
  LEGAL: "legal",
  ILLEGAL: "illegal",
  GOVERNMENT: "government",
};

/** List of all shifts. Base shifts have no cityId (available in that area in every city). */
export const SHIFTS = [
  {
    id: "fast_food_worker",
    name: "Fast Food Worker",
    category: SHIFT_CATEGORIES.LEGAL,
    areaId: "metropolis",
    description: "Flip burgers, mop floors, and deal with impatient customers.",
    incomePerShift: 60,
    risk: 0,
    requiredSkills: {},
  },
  {
    id: "drug_dealer",
    name: "Street Dealer",
    category: SHIFT_CATEGORIES.ILLEGAL,
    areaId: "metropolis",
    description: "Move product in the shadows for big, risky payouts.",
    incomePerShift: 280,
    risk: 40,
    requiredSkills: {
      [SKILL_IDS.STREET_SMARTS]: 8,
      [SKILL_IDS.CHARISMA]: 4,
    },
  },
  {
    id: "farm_hand",
    name: "Farm Hand",
    category: SHIFT_CATEGORIES.LEGAL,
    areaId: "suburbs",
    description: "Work the fields, care for animals, and get paid in sweat.",
    incomePerShift: 75,
    risk: 0,
    requiredSkills: { [SKILL_IDS.STRENGTH]: 5 },
  },
  {
    id: "factory_worker",
    name: "Factory Worker",
    category: SHIFT_CATEGORIES.LEGAL,
    areaId: "industrial",
    description: "Work the assembly line, clock in, clock out, repeat.",
    incomePerShift: 90,
    risk: 5,
    requiredSkills: { [SKILL_IDS.STRENGTH]: 3 },
  },
  {
    id: "warehouse_worker",
    name: "Warehouse Worker",
    category: SHIFT_CATEGORIES.LEGAL,
    areaId: "industrial",
    description: "Move boxes, load trucks, and keep the supply chain moving.",
    incomePerShift: 85,
    risk: 3,
    requiredSkills: { [SKILL_IDS.STRENGTH]: 4 },
  },
  {
    id: "arms_seller",
    name: "Illegal Arms Seller",
    category: SHIFT_CATEGORIES.ILLEGAL,
    areaId: "industrial",
    description: "Supply weapons to people you hope to never meet again.",
    incomePerShift: 450,
    risk: 65,
    requiredSkills: {
      [SKILL_IDS.STREET_SMARTS]: 12,
      [SKILL_IDS.BUSINESS]: 8,
    },
  },
  {
    id: "police_officer",
    name: "Police Officer",
    category: SHIFT_CATEGORIES.GOVERNMENT,
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
    category: SHIFT_CATEGORIES.GOVERNMENT,
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
    category: SHIFT_CATEGORIES.GOVERNMENT,
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
