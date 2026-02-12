// Character creation: backgrounds and starting skill boosts.

import { SKILL_IDS } from "./skills.js";

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
