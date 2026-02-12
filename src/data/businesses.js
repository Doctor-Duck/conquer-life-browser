// Business definitions (area-specific).

import { SKILL_IDS } from "./skills.js";

export const BASE_BUSINESSES = [
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
