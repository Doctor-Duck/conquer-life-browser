// Shift quality and per-job shift events (3 events per quality, except normal).

import { SKILL_IDS } from "./skills.js";

export const SHIFT_QUALITIES = {
  VERY_BAD: "very_bad",
  BAD: "bad",
  NORMAL: "normal",
  GOOD: "good",
  VERY_GOOD: "very_good",
};

export const SHIFT_QUALITY_RARITIES = {
  [SHIFT_QUALITIES.VERY_BAD]: 5,
  [SHIFT_QUALITIES.BAD]: 15,
  [SHIFT_QUALITIES.NORMAL]: 50,
  [SHIFT_QUALITIES.GOOD]: 25,
  [SHIFT_QUALITIES.VERY_GOOD]: 5,
};

export const SHIFT_EVENTS = {
  fast_food_worker: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "A customer throws food at you and the manager blames you. You're docked pay and leave feeling humiliated.", moneyMod: -25, skillExpMod: {} },
      { description: "The fryer malfunctions and you burn your hand. You finish the shift in pain and get written up.", moneyMod: -20, skillExpMod: {} },
      { description: "You accidentally short the register and have to cover the difference out of your pocket.", moneyMod: -30, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "A rush never stops. You leave exhausted with no tip jar to show for it.", moneyMod: -10, skillExpMod: {} },
      { description: "A coworker no-call-no-shows and you have to cover their station. No extra pay.", moneyMod: 0, skillExpMod: {} },
      { description: "The health inspector drops by and everyone is stressed. You get a stern talking-to for a minor slip.", moneyMod: -15, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "A regular leaves a generous tip and tells the manager you're the best. You get a small bonus.", moneyMod: 25, skillExpMod: { [SKILL_IDS.CHARISMA]: 15 } },
      { description: "You handle a difficult customer so well the manager gives you a spot bonus.", moneyMod: 20, skillExpMod: { [SKILL_IDS.CHARISMA]: 10 } },
      { description: "Slow shift means you get sent home early with full pay. You use the extra time to practice your smile.", moneyMod: 10, skillExpMod: { [SKILL_IDS.CHARISMA]: 12 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "A viral moment gets your location featured. The district manager hands you a bonus and a handshake.", moneyMod: 50, skillExpMod: { [SKILL_IDS.CHARISMA]: 30 } },
      { description: "You cover for the shift lead and they put in a good word. You get a raise preview and extra cash.", moneyMod: 45, skillExpMod: { [SKILL_IDS.CHARISMA]: 25 } },
      { description: "You suggest a small efficiency fix and it's adopted. Corporate sends a thank-you bonus.", moneyMod: 40, skillExpMod: { [SKILL_IDS.CHARISMA]: 20 } },
    ],
  },
  drug_dealer: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "You get jumped and lose product and cash. You're lucky to walk away.", moneyMod: -120, notorietyMod: 15, skillExpMod: {} },
      { description: "A deal goes bad and you have to pay off the wrong people to stay safe.", moneyMod: -150, notorietyMod: 10, skillExpMod: {} },
      { description: "Cops sweep the block. You ditch the stash but lose the night's take.", moneyMod: -100, notorietyMod: 20, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "A buyer flakes and you're stuck holding product in a hot spot. You sell at a loss.", moneyMod: -50, notorietyMod: 5, skillExpMod: {} },
      { description: "Word gets out you're short. Your rep takes a hit and so does your pocket.", moneyMod: -40, notorietyMod: 8, skillExpMod: {} },
      { description: "You have to lay low after a close call. Fewer sales, same risk.", moneyMod: -60, notorietyMod: 3, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "A big client sends friends. You move volume and stay under the radar.", moneyMod: 80, notorietyMod: -2, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 20, [SKILL_IDS.CHARISMA]: 15 } },
      { description: "You negotiate a better cut with your supplier. Tonight's margin is sweet.", moneyMod: 70, notorietyMod: 0, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 18, [SKILL_IDS.CHARISMA]: 12 } },
      { description: "Smooth handoffs, no heat. You count the stack and feel like a pro.", moneyMod: 90, notorietyMod: -3, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 22 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "A whale wants a regular arrangement. You lock in a premium rate and a fat advance.", moneyMod: 180, notorietyMod: -5, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 35, [SKILL_IDS.CHARISMA]: 30 } },
      { description: "You spot a tail and abort clean. Your connect rewards your caution with a bonus.", moneyMod: 150, notorietyMod: -8, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 40 } },
      { description: "You broker a one-time deal between two crews and take a cut. Everyone wins.", moneyMod: 200, notorietyMod: 2, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 30, [SKILL_IDS.CHARISMA]: 25 } },
    ],
  },
  farm_hand: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "You twist your back lifting bales. The farmer sends you home with half pay and a warning.", moneyMod: -35, skillExpMod: {} },
      { description: "A storm ruins part of the crop you were supposed to protect. The boss docks your pay.", moneyMod: -40, skillExpMod: {} },
      { description: "Equipment breaks on your watch. You're blamed and lose a day's wage.", moneyMod: -30, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "The heat is brutal and you slow down. The farmer isn't happy but you get base pay.", moneyMod: -15, skillExpMod: {} },
      { description: "You mix up two fields and waste half the morning. No bonus this week.", moneyMod: -10, skillExpMod: {} },
      { description: "Animals get loose and you spend the shift rounding them up. Exhausting and unrewarding.", moneyMod: -20, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "You finish the north field early and the farmer pays you a bonus for the extra acre.", moneyMod: 30, skillExpMod: { [SKILL_IDS.STRENGTH]: 20 } },
      { description: "You spot a sick calf and get the vet in time. The farmer is grateful and slips you cash.", moneyMod: 25, skillExpMod: { [SKILL_IDS.STRENGTH]: 15 } },
      { description: "Harvest runs smooth. The farmer shares lunch and a little extra for the team.", moneyMod: 20, skillExpMod: { [SKILL_IDS.STRENGTH]: 18 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "You suggest a better irrigation layout. The farmer tries it and gives you a share of the savings.", moneyMod: 60, skillExpMod: { [SKILL_IDS.STRENGTH]: 35 } },
      { description: "A big buyer visits and you help close the deal. The farmer cuts you in as thanks.", moneyMod: 55, skillExpMod: { [SKILL_IDS.STRENGTH]: 25, [SKILL_IDS.CHARISMA]: 20 } },
      { description: "You take the lead on a tough job and the crew follows. The farmer names you lead hand and adds a bonus.", moneyMod: 50, skillExpMod: { [SKILL_IDS.STRENGTH]: 40 } },
    ],
  },
  factory_worker: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "You get written up for a safety violation you didn't commit. The union rep is busy; you eat the fine.", moneyMod: -35, skillExpMod: {} },
      { description: "The line jams and supervisors blame your station. You're docked and sent home early.", moneyMod: -40, skillExpMod: {} },
      { description: "A piece of equipment injures your hand. You finish the shift but lose pay for 'incident' paperwork.", moneyMod: -45, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "Overtime is cancelled at the last minute. You needed that extra cash.", moneyMod: -20, skillExpMod: {} },
      { description: "You're put on the worst station and can't hit rate. No bonus, just frowns.", moneyMod: -15, skillExpMod: {} },
      { description: "The foreman is in a mood. Everyone gets nitpicked; you get an extra task and no thanks.", moneyMod: -10, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "You hit rate early and help others catch up. The foreman notes it and you get a small bonus.", moneyMod: 25, skillExpMod: { [SKILL_IDS.STRENGTH]: 18 } },
      { description: "You spot a defect before it ships. Quality gives you a spot bonus.", moneyMod: 30, skillExpMod: { [SKILL_IDS.STRENGTH]: 15 } },
      { description: "Smooth shift, no downtime. The line lead buys lunch and you get a little extra on the check.", moneyMod: 20, skillExpMod: { [SKILL_IDS.STRENGTH]: 20 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "You suggest a small change that speeds the line. Management implements it and cuts you a bonus.", moneyMod: 55, skillExpMod: { [SKILL_IDS.STRENGTH]: 35 } },
      { description: "You fill in for a lead and the shift runs perfectly. They add a lead premium to your pay.", moneyMod: 50, skillExpMod: { [SKILL_IDS.STRENGTH]: 30 } },
      { description: "A big order ships on time because of your station. The plant manager shakes your hand and adds cash.", moneyMod: 60, skillExpMod: { [SKILL_IDS.STRENGTH]: 28 } },
    ],
  },
  warehouse_worker: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "You mis-ship a pallet and the client complains. The cost comes out of your check.", moneyMod: -35, skillExpMod: {} },
      { description: "You pull your back and have to sit out half the shift. Half pay and a write-up.", moneyMod: -40, skillExpMod: {} },
      { description: "Inventory is off and they blame your zone. You're docked and put on probation.", moneyMod: -30, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "The dock is chaos and you're stuck doing someone else's picks. No extra pay.", moneyMod: -15, skillExpMod: {} },
      { description: "Equipment is broken and you lose time waiting. Your numbers look bad.", moneyMod: -20, skillExpMod: {} },
      { description: "A supervisor rides you all shift. You leave tired and underappreciated.", moneyMod: -10, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "You clear a backlog that's been sitting. The supervisor gives you a bonus and a nod.", moneyMod: 28, skillExpMod: { [SKILL_IDS.STRENGTH]: 20 } },
      { description: "You find a mislabeled shipment before it goes out. They add a spot bonus to your check.", moneyMod: 25, skillExpMod: { [SKILL_IDS.STRENGTH]: 15 } },
      { description: "You and your partner crush the pick list. You both get a little extra.", moneyMod: 22, skillExpMod: { [SKILL_IDS.STRENGTH]: 18 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "You reorganize a section and pick times drop. Management gives you a one-time bonus.", moneyMod: 55, skillExpMod: { [SKILL_IDS.STRENGTH]: 35 } },
      { description: "You train a new hire and they're already productive. You get a trainer bonus.", moneyMod: 50, skillExpMod: { [SKILL_IDS.STRENGTH]: 25, [SKILL_IDS.CHARISMA]: 20 } },
      { description: "Rush order comes in and you lead the pull. The manager hands you cash and says 'you saved us'.", moneyMod: 60, skillExpMod: { [SKILL_IDS.STRENGTH]: 32 } },
    ],
  },
  arms_seller: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "A deal turns into a rip. You lose product and barely escape. Your rep and wallet take a hit.", moneyMod: -200, notorietyMod: 25, skillExpMod: {} },
      { description: "Law enforcement gets too close. You burn the stash and eat the loss.", moneyMod: -180, notorietyMod: 30, skillExpMod: {} },
      { description: "A buyer turns out to be an informant. You lose the shipment and have to lay low.", moneyMod: -220, notorietyMod: 20, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "A shipment is delayed and you can't fulfill. You refund and lose margin.", moneyMod: -80, notorietyMod: 5, skillExpMod: {} },
      { description: "A competitor undercuts you and you have to drop price to move product.", moneyMod: -100, notorietyMod: 0, skillExpMod: {} },
      { description: "Heat is up and you have to move through a middleman. Their cut hurts.", moneyMod: -90, notorietyMod: 8, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "A serious buyer commits to a bulk order. You negotiate a premium and deliver clean.", moneyMod: 120, notorietyMod: -3, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 25, [SKILL_IDS.BUSINESS]: 20 } },
      { description: "You vet a new contact perfectly and close a repeat deal. Your network grows.", moneyMod: 100, notorietyMod: -2, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 22, [SKILL_IDS.BUSINESS]: 18 } },
      { description: "You find a safer route and the client pays extra for discretion.", moneyMod: 110, notorietyMod: -5, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 28 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "A high-level buyer wants an exclusive arrangement. You lock in terms and a huge advance.", moneyMod: 250, notorietyMod: -8, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 45, [SKILL_IDS.BUSINESS]: 40 } },
      { description: "You broker a one-time deal between two factions and take a fat cut. Nobody gets burned.", moneyMod: 220, notorietyMod: 0, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 40, [SKILL_IDS.BUSINESS]: 35 } },
      { description: "You upgrade your security and a nervous client commits to a long-term deal. Premium rates.", moneyMod: 200, notorietyMod: -10, skillExpMod: { [SKILL_IDS.STREET_SMARTS]: 42, [SKILL_IDS.BUSINESS]: 38 } },
    ],
  },
  police_officer: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "A suspect resists and you're injured. You're on desk duty and the union is fighting your comp.", moneyMod: -50, skillExpMod: {} },
      { description: "A complaint is filed and Internal Affairs gets involved. You're suspended with pay—but the stress costs you.", moneyMod: -30, skillExpMod: {} },
      { description: "You miss a critical detail and a perp walks. The captain reams you and you lose overtime.", moneyMod: -40, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "Paperwork pile-up. You spend the shift at the desk and get nothing extra.", moneyMod: -20, skillExpMod: {} },
      { description: "A call goes bad and you have to de-escalate for hours. You're drained and underappreciated.", moneyMod: -15, skillExpMod: {} },
      { description: "Politicians are in the building. Everyone is on edge and you get the worst assignments.", moneyMod: -25, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "You defuse a situation without force and the sergeant puts you in for a commendation. Small bonus.", moneyMod: 35, skillExpMod: { [SKILL_IDS.STRENGTH]: 15, [SKILL_IDS.LAW]: 18 } },
      { description: "You help close a case with good fieldwork. The DA's office sends thanks and the department adds a bonus.", moneyMod: 40, skillExpMod: { [SKILL_IDS.LAW]: 20, [SKILL_IDS.STRENGTH]: 12 } },
      { description: "Community outreach goes well and the captain notices. You get a small bonus and a pat on the back.", moneyMod: 30, skillExpMod: { [SKILL_IDS.CHARISMA]: 18, [SKILL_IDS.LAW]: 15 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "You lead a successful operation and everyone goes home safe. The chief hands you a bonus and a medal.", moneyMod: 75, skillExpMod: { [SKILL_IDS.STRENGTH]: 35, [SKILL_IDS.LAW]: 30 } },
      { description: "You crack a cold case with a single lead. The department and the family thank you; bonus and recognition.", moneyMod: 80, skillExpMod: { [SKILL_IDS.LAW]: 40, [SKILL_IDS.INTELLIGENCE]: 25 } },
      { description: "You mentor a rookie through a tough arrest. The union and the brass both recognize you with cash.", moneyMod: 70, skillExpMod: { [SKILL_IDS.STRENGTH]: 28, [SKILL_IDS.CHARISMA]: 30 } },
    ],
  },
  lawyer: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "You miss a filing deadline and the client threatens to sue you. You cover the cost and your reputation dips.", moneyMod: -80, skillExpMod: {} },
      { description: "A judge tears into your argument. You leave court humiliated and the client is talking about malpractice.", moneyMod: -70, skillExpMod: {} },
      { description: "A key witness flips and your case collapses. The client demands a refund and you oblige.", moneyMod: -90, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "A long deposition goes nowhere. You bill the hours but the partner isn't impressed.", moneyMod: -30, skillExpMod: {} },
      { description: "Opposing counsel outmaneuvers you in discovery. You spend the night catching up for free.", moneyMod: -25, skillExpMod: {} },
      { description: "A client is unhappy with the strategy. You smooth it over but take a fee cut.", moneyMod: -40, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "You win a motion and the partner shares the credit and a bonus.", moneyMod: 50, skillExpMod: { [SKILL_IDS.INTELLIGENCE]: 20, [SKILL_IDS.LAW]: 22 } },
      { description: "A client refers a new case. The firm gives you a referral bonus.", moneyMod: 45, skillExpMod: { [SKILL_IDS.CHARISMA]: 20, [SKILL_IDS.LAW]: 18 } },
      { description: "You find a precedent that saves the case. The senior partner notices and adds to your bonus.", moneyMod: 55, skillExpMod: { [SKILL_IDS.INTELLIGENCE]: 25, [SKILL_IDS.LAW]: 20 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "You win a major case and the client sends a thank-you bonus. The firm matches it.", moneyMod: 120, skillExpMod: { [SKILL_IDS.INTELLIGENCE]: 40, [SKILL_IDS.LAW]: 35, [SKILL_IDS.CHARISMA]: 25 } },
      { description: "You land a huge client with a pitch. The firm makes you a bonus and a name.", moneyMod: 100, skillExpMod: { [SKILL_IDS.CHARISMA]: 45, [SKILL_IDS.LAW]: 30 } },
      { description: "You argue at a higher court and win. Your reputation and your check both get a bump.", moneyMod: 110, skillExpMod: { [SKILL_IDS.LAW]: 45, [SKILL_IDS.INTELLIGENCE]: 35 } },
    ],
  },
  governor: {
    [SHIFT_QUALITIES.VERY_BAD]: [
      { description: "A scandal breaks and your name is in the mix. Donors pull back and you have to return a contribution.", moneyMod: -150, skillExpMod: {} },
      { description: "You flub a major speech and the clips go viral. Your team has to spend to fix the narrative.", moneyMod: -120, skillExpMod: {} },
      { description: "A policy backfires and you're in damage control. You dig into your own pocket to fund a fix.", moneyMod: -180, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.BAD]: [
      { description: "A long day of meetings with no wins. You leave with nothing to show but fatigue.", moneyMod: -60, skillExpMod: {} },
      { description: "Opposition blocks your initiative. You burn political capital and get no progress.", moneyMod: -50, skillExpMod: {} },
      { description: "A donor meeting goes sideways. You keep the relationship but lose a check.", moneyMod: -70, skillExpMod: {} },
    ],
    [SHIFT_QUALITIES.GOOD]: [
      { description: "You sign a popular bill and the polls move. A donor sends a thank-you contribution.", moneyMod: 100, skillExpMod: { [SKILL_IDS.INTELLIGENCE]: 25, [SKILL_IDS.CHARISMA]: 28, [SKILL_IDS.LAW]: 22 } },
      { description: "A key endorsement comes through. Your war chest and your confidence both grow.", moneyMod: 90, skillExpMod: { [SKILL_IDS.CHARISMA]: 30, [SKILL_IDS.BUSINESS]: 20 } },
      { description: "You broker a bipartisan deal. The press and the donors both notice.", moneyMod: 95, skillExpMod: { [SKILL_IDS.LAW]: 28, [SKILL_IDS.CHARISMA]: 25 } },
    ],
    [SHIFT_QUALITIES.VERY_GOOD]: [
      { description: "You announce a landmark initiative and fundraising goes through the roof. You take a personal cut from a grateful donor.", moneyMod: 200, skillExpMod: { [SKILL_IDS.INTELLIGENCE]: 45, [SKILL_IDS.CHARISMA]: 50, [SKILL_IDS.LAW]: 40 } },
      { description: "You win a major legislative fight. Your party rewards you with a speaking slot and a bonus.", moneyMod: 180, skillExpMod: { [SKILL_IDS.CHARISMA]: 48, [SKILL_IDS.LAW]: 42 } },
      { description: "A crisis hits and you lead. Your approval soars and so does your campaign fund.", moneyMod: 220, skillExpMod: { [SKILL_IDS.INTELLIGENCE]: 50, [SKILL_IDS.CHARISMA]: 45 } },
    ],
  },
};
