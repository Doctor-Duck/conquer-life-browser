// Core data models ---------------------------------------------------------

const JOB_CATEGORIES = {
  LEGAL: "legal",
  ILLEGAL: "illegal",
  GOVERNMENT: "government",
};

const SKILL_IDS = {
  STRENGTH: "strength",
  INTELLIGENCE: "intelligence",
  CHARISMA: "charisma",
  STREET_SMARTS: "street_smarts",
  LAW: "law",
  BUSINESS: "business",
};

const BASE_JOBS = [
  {
    id: "fast_food_worker",
    name: "Fast Food Worker",
    category: JOB_CATEGORIES.LEGAL,
    description: "Flip burgers, mop floors, and deal with impatient customers.",
    incomePerShift: 60,
    risk: 0,
    requiredSkills: {},
  },
  {
    id: "farm_hand",
    name: "Farm Hand",
    category: JOB_CATEGORIES.LEGAL,
    description: "Work the fields, care for animals, and get paid in sweat.",
    incomePerShift: 75,
    risk: 0,
    requiredSkills: { [SKILL_IDS.STRENGTH]: 5 },
  },
  {
    id: "drug_dealer",
    name: "Street Dealer",
    category: JOB_CATEGORIES.ILLEGAL,
    description: "Move product in the shadows for big, risky payouts.",
    incomePerShift: 280,
    risk: 40,
    requiredSkills: {
      [SKILL_IDS.STREET_SMARTS]: 8,
      [SKILL_IDS.CHARISMA]: 4,
    },
  },
  {
    id: "arms_seller",
    name: "Illegal Arms Seller",
    category: JOB_CATEGORIES.ILLEGAL,
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
    category: JOB_CATEGORIES.GOVERNMENT,
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

const BASE_BUSINESSES = [
  {
    id: "food_truck",
    name: "Food Truck",
    legality: "legal",
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
    id: "law_firm",
    name: "Law Firm",
    legality: "legal",
    description: "Bill by the hour and weaponize paperwork.",
    costToStart: 20000,
    upkeepPerDay: 500,
    expectedProfitPerDay: 1100,
    requiredSkills: {
      [SKILL_IDS.LAW]: 14,
      [SKILL_IDS.BUSINESS]: 12,
    },
  },
  {
    id: "black_market_network",
    name: "Black Market Network",
    legality: "illegal",
    description: "Move anything, anywhere, for the right price.",
    costToStart: 18000,
    upkeepPerDay: 650,
    expectedProfitPerDay: 1600,
    requiredSkills: {
      [SKILL_IDS.STREET_SMARTS]: 14,
      [SKILL_IDS.BUSINESS]: 12,
    },
  },
];

const BASE_SKILLS = [
  { id: SKILL_IDS.STRENGTH, name: "Strength" },
  { id: SKILL_IDS.INTELLIGENCE, name: "Intelligence" },
  { id: SKILL_IDS.CHARISMA, name: "Charisma" },
  { id: SKILL_IDS.STREET_SMARTS, name: "Street Smarts" },
  { id: SKILL_IDS.LAW, name: "Law" },
  { id: SKILL_IDS.BUSINESS, name: "Business" },
];

// Game state ---------------------------------------------------------------

const SAVE_KEY = "conquer_life_save_v1";

function createNewGameState() {
  const skills = {};
  BASE_SKILLS.forEach((skill) => {
    skills[skill.id] = 1;
  });

  return {
    player: {
      name: "Newcomer",
      age: 18,
      energy: 100,
      health: 100,
      money: 500,
      notoriety: 0, // goes up with illegal actions
      respect: 0, // goes up with achievements
    },
    skills,
    currentDay: 1,
    currentJobId: null,
    ownedBusinesses: [],
    activeView: "overview",
    jobsFilter: "all",
    log: [
      {
        day: 1,
        text: "You arrive in the city with big ambitions and a small stash of cash.",
      },
    ],
  };
}

function loadGameState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createNewGameState();
    const parsed = JSON.parse(raw);
    return {
      ...createNewGameState(),
      ...parsed,
    };
  } catch (e) {
    console.warn("Failed to load save, starting new game", e);
    return createNewGameState();
  }
}

function saveGameState(state) {
  try {
    const toSave = {
      ...state,
      log: state.log.slice(-80),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn("Failed to save game", e);
  }
}

// Utility helpers ----------------------------------------------------------

function getSkillLevel(state, skillId) {
  return state.skills[skillId] ?? 1;
}

function canTakeJob(state, job) {
  const missing = [];
  for (const [skillId, requiredLevel] of Object.entries(job.requiredSkills)) {
    const current = getSkillLevel(state, skillId);
    if (current < requiredLevel) {
      missing.push({ skillId, requiredLevel, current });
    }
  }
  return { ok: missing.length === 0, missing };
}

function canStartBusiness(state, biz) {
  if (state.player.money < biz.costToStart) {
    return { ok: false, reason: "Not enough money" };
  }
  const { ok, missing } = canTakeJob(state, {
    requiredSkills: biz.requiredSkills,
  });
  if (!ok) {
    return { ok: false, reason: "Skills too low", missing };
  }
  const already = state.ownedBusinesses.find((b) => b.id === biz.id);
  if (already) {
    return { ok: false, reason: "You already own this business" };
  }
  return { ok: true };
}

function pushLog(state, text) {
  state.log.push({
    day: state.currentDay,
    text,
  });
}

function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}

// Core game actions --------------------------------------------------------

function workShift(state, jobId) {
  const job = BASE_JOBS.find((j) => j.id === jobId);
  if (!job) return state;

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

  if (state.player.energy < 15) {
    pushLog(
      state,
      `You're too exhausted to work another shift. Get some rest first.`
    );
    return state;
  }

  const income = job.incomePerShift;
  state.player.money += income;
  state.player.energy = clamp(state.player.energy - 20, 0, 100);

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
    state.skills[skillToRaise] = clamp(
      getSkillLevel(state, skillToRaise) + 1,
      1,
      20
    );
  } else {
    state.skills[SKILL_IDS.CHARISMA] = clamp(
      getSkillLevel(state, SKILL_IDS.CHARISMA) + 1,
      1,
      20
    );
  }

  return state;
}

function trainSkill(state, skillId) {
  const currentLevel = getSkillLevel(state, skillId);
  if (currentLevel >= 20) {
    pushLog(
      state,
      `Your ${BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId} is already maxed out.`
    );
    return state;
  }

  const energyCost = 15;
  const moneyCost = 30 + currentLevel * 5;

  if (state.player.energy < energyCost) {
    pushLog(state, `You're too tired to train right now.`);
    return state;
  }
  if (state.player.money < moneyCost) {
    pushLog(
      state,
      `You can't afford the $${moneyCost} needed to train right now.`
    );
    return state;
  }

  state.player.energy = clamp(state.player.energy - energyCost, 0, 100);
  state.player.money -= moneyCost;
  state.skills[skillId] = currentLevel + 1;

  const skillName =
    BASE_SKILLS.find((s) => s.id === skillId)?.name ?? skillId;
  pushLog(
    state,
    `You invest in training and your ${skillName} rises to level ${currentLevel + 1}.`
  );

  return state;
}

function startBusiness(state, businessId) {
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
  });
  pushLog(
    state,
    `You launch ${biz.name}, investing $${biz.costToStart} into your new venture.`
  );
  return state;
}

function advanceDay(state) {
  state.currentDay += 1;

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

  state.player.energy = clamp(state.player.energy + 30, 0, 100);

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

// Rendering ---------------------------------------------------------------

const root = document.getElementById("app-root");
let state = loadGameState();

function setState(mutator) {
  state = mutator({ ...state, player: { ...state.player }, skills: { ...state.skills }, ownedBusinesses: [...state.ownedBusinesses], log: [...state.log] });
  render();
  saveGameState(state);
}

function formatMoney(amount) {
  const sign = amount < 0 ? "-" : "";
  const value = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${sign}$${value}`;
}

function renderTopBar() {
  const title =
    state.activeView === "overview"
      ? "Life Overview"
      : state.activeView === "jobs"
      ? "Work & Hustles"
      : state.activeView === "businesses"
      ? "Businesses"
      : "Character & Skills";

  const subtitle =
    state.activeView === "overview"
      ? "Track your resources, risk, and long-term path."
      : state.activeView === "jobs"
      ? "Choose how you'll earn today—clean or dirty."
      : state.activeView === "businesses"
      ? "Invest in ventures that work even when you sleep."
      : "Level up the skills that shape your destiny.";

  return `
    <div class="top-bar">
      <div class="top-bar-left">
        <div class="top-bar-title">${title}</div>
        <div class="top-bar-subtitle">${subtitle}</div>
      </div>
      <div class="top-bar-actions">
        <div class="pill">
          <div class="pill-dot"></div>
          Day ${state.currentDay}
        </div>
        <button class="btn btn-outline" data-action="advance-day">
          End Day
        </button>
        <button class="btn btn-primary" data-action="save-game">
          Save
        </button>
      </div>
    </div>
  `;
}

function renderSidebar() {
  const navButton = (id, title, subtitle, badge) => {
    const active = state.activeView === id ? "active" : "";
    return `
      <li class="nav-item">
        <button class="nav-button ${active}" data-nav="${id}">
          <div class="nav-button-label">
            <span class="nav-button-title">${title}</span>
            <span class="nav-button-subtitle">${subtitle}</span>
          </div>
          ${
            badge
              ? `<span class="nav-button-badge">${badge}</span>`
              : ""
          }
        </button>
      </li>
    `;
  };

  return `
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-mark">CL</div>
        <div>
          <div class="logo-text-main">Conquer Life</div>
          <div class="logo-text-sub">Life Sim · Browser RPG</div>
        </div>
      </div>

      <div class="sidebar-section-title">Life</div>
      <ul class="nav-list">
        ${navButton(
          "overview",
          "Overview",
          "Stats, status and log",
          "Core"
        )}
      </ul>

      <div class="sidebar-section-title">Income Paths</div>
      <ul class="nav-list">
        ${navButton(
          "jobs",
          "Jobs & Gigs",
          "Shift work & hustles",
          "Active"
        )}
        ${navButton(
          "businesses",
          "Businesses",
          "Own and scale ventures",
          state.ownedBusinesses.length
            ? `${state.ownedBusinesses.length} owned`
            : "Locked"
        )}
      </ul>

      <div class="sidebar-section-title">Growth</div>
      <ul class="nav-list">
        ${navButton(
          "skills",
          "Skills & Training",
          "Gateways to better lives",
          "Progress"
        )}
      </ul>

      <div class="sidebar-footer">
        <strong>Single-page simulation</strong><br />
        All choices, one screen. Your story persists in this browser.
      </div>
    </aside>
  `;
}

function renderOverview() {
  const p = state.player;
  return `
    <div class="content-layout">
      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Current Life</div>
            <div class="card-subtitle">
              Age ${p.age} · ${
                state.currentJobId
                  ? BASE_JOBS.find((j) => j.id === state.currentJobId)
                      ?.name || "Unemployed"
                  : "No primary job selected"
              }
            </div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-label">
            <span>Money</span>
          </div>
          <div class="stat-value">${formatMoney(p.money)}</div>
        </div>
        <div class="stat-row">
          <div class="stat-label">
            <span>Energy</span>
          </div>
          <div class="stat-value">${p.energy}/100</div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="transform: scaleX(${
            p.energy / 100
          });"></div>
        </div>

        <div class="stat-row">
          <div class="stat-label">
            <span>Health</span>
          </div>
          <div class="stat-value">${p.health}/100</div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="transform: scaleX(${
            p.health / 100
          }); background: linear-gradient(90deg,#2dd4bf,#0ea5e9);"></div>
        </div>

        <div class="stat-row">
          <div class="stat-label">
            <span>Notoriety</span>
          </div>
          <div class="stat-value">${p.notoriety}/100</div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="transform: scaleX(${
            p.notoriety / 100
          }); background: linear-gradient(90deg,#f97316,#ef4444);"></div>
        </div>

        <div class="tag-row">
          <span class="tag ${
            p.money >= 10000 ? "good" : p.money < 0 ? "bad" : "neutral"
          }">
            Net worth: ${formatMoney(p.money)}
          </span>
          <span class="tag ${
            p.notoriety >= 50 ? "bad" : p.notoriety > 20 ? "neutral" : "good"
          }">
            Street heat: ${p.notoriety >= 60 ? "Radioactive" : p.notoriety >= 30 ? "Noticeable" : "Low"}
          </span>
          <span class="tag neutral">
            Businesses: ${state.ownedBusinesses.length}
          </span>
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Recent Events</div>
            <div class="card-subtitle">
              A running log of the choices you make and what they cost you.
            </div>
          </div>
        </div>
        <div class="log-panel">
          ${
            state.log.length === 0
              ? `<div class="empty-state">Your story hasn't started yet.</div>`
              : state.log
                  .slice(-30)
                  .reverse()
                  .map(
                    (entry) => `
                <div class="log-entry">
                  <span>Day ${entry.day}</span> · ${entry.text}
                </div>
              `
                  )
                  .join("")
          }
        </div>
      </section>
    </div>
  `;
}

function renderJobs() {
  const filter = state.jobsFilter;
  const visibleJobs = BASE_JOBS.filter((job) => {
    if (filter === "all") return true;
    if (filter === "legal") return job.category === JOB_CATEGORIES.LEGAL;
    if (filter === "illegal") return job.category === JOB_CATEGORIES.ILLEGAL;
    if (filter === "government")
      return job.category === JOB_CATEGORIES.GOVERNMENT;
    return true;
  });

  const categoryLabel = (category) => {
    if (category === JOB_CATEGORIES.LEGAL) return "Legal";
    if (category === JOB_CATEGORIES.ILLEGAL) return "Illegal";
    if (category === JOB_CATEGORIES.GOVERNMENT) return "Government";
    return category;
  };

  return `
    <div class="content-layout">
      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Jobs & Shifts</div>
            <div class="card-subtitle">
              Work to earn cash, gain skills, and shape your reputation.
            </div>
          </div>
        </div>

        <div class="jobs-filter-row">
          <div class="segmented-control">
            <button class="segment-btn ${
              filter === "all" ? "active" : ""
            }" data-jobs-filter="all">All</button>
            <button class="segment-btn ${
              filter === "legal" ? "active" : ""
            }" data-jobs-filter="legal">Legal</button>
            <button class="segment-btn ${
              filter === "illegal" ? "active" : ""
            }" data-jobs-filter="illegal">Illegal</button>
            <button class="segment-btn ${
              filter === "government" ? "active" : ""
            }" data-jobs-filter="government">Government</button>
          </div>
          <div class="pill">
            <div class="pill-dot"></div>
            Energy: ${state.player.energy}/100
          </div>
        </div>

        <div class="jobs-grid">
          ${visibleJobs
            .map((job) => {
              const { ok, missing } = canTakeJob(state, job);
              const btnDisabled = !ok;
              const riskLabel =
                job.category === JOB_CATEGORIES.ILLEGAL
                  ? `Risk: ${job.risk}%`
                  : "Low legal risk";
              const riskClass =
                job.category === JOB_CATEGORIES.ILLEGAL
                  ? job.risk >= 50
                    ? "negative"
                    : "neutral"
                  : "positive";

              const reqs =
                Object.keys(job.requiredSkills).length === 0
                  ? "No requirements"
                  : Object.entries(job.requiredSkills)
                      .map(([skillId, level]) => {
                        const skillName =
                          BASE_SKILLS.find((s) => s.id === skillId)?.name ??
                          skillId;
                        const current = getSkillLevel(state, skillId);
                        const ok = current >= level;
                        return `${skillName} ${current}/${level}${
                          ok ? "" : " ✕"
                        }`;
                      })
                      .join(" · ");

              return `
              <article class="list-item">
                <div class="list-item-main">
                  <div class="list-item-title">${job.name}</div>
                  <div class="list-item-subtitle">
                    ${job.description}
                  </div>
                  <div class="tag-row">
                    <span class="tag neutral">${categoryLabel(
                      job.category
                    )}</span>
                    <span class="tag ${
                      btnDisabled ? "bad" : "good"
                    }">${reqs}</span>
                  </div>
                </div>
                <div class="list-item-meta">
                  <div class="pill-soft positive">${formatMoney(
                    job.incomePerShift
                  )} / shift</div>
                  <div class="pill-soft ${riskClass}">${riskLabel}</div>
                  <button
                    class="btn btn-primary"
                    data-work-job="${job.id}"
                    ${btnDisabled ? "disabled" : ""}
                  >
                    Work Shift
                  </button>
                </div>
              </article>
            `;
            })
            .join("")}
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Notes & Consequences</div>
            <div class="card-subtitle">
              Illegal work can pay huge, but raises your notoriety and the odds of getting busted.
            </div>
          </div>
        </div>
        <ul class="list">
          <li class="list-item">
            <div class="list-item-main">
              <div class="list-item-title">Illegal Gigs</div>
              <div class="list-item-subtitle">
                High risk, high reward. Each run adds to your notoriety.
              </div>
            </div>
            <div class="list-item-meta">
              <span class="pill-soft negative">Random bust chance</span>
              <span class="pill-soft neutral">Fines & setbacks possible</span>
            </div>
          </li>
          <li class="list-item">
            <div class="list-item-main">
              <div class="list-item-title">Legal Careers</div>
              <div class="list-item-subtitle">
                Safer, slower, but unlock advanced government paths if you invest in law and intelligence.
              </div>
            </div>
            <div class="list-item-meta">
              <span class="pill-soft positive">Stable income</span>
              <span class="pill-soft neutral">Pairs well with businesses</span>
            </div>
          </li>
        </ul>
      </section>
    </div>
  `;
}

function renderBusinesses() {
  return `
    <div class="content-layout">
      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Available Businesses</div>
            <div class="card-subtitle">
              Invest in ventures that earn money as days pass.
            </div>
          </div>
        </div>

        <div class="list">
          ${BASE_BUSINESSES.map((biz) => {
            const owned = state.ownedBusinesses.some(
              (b) => b.id === biz.id
            );
            const { ok, reason } = canStartBusiness(state, biz);
            const disabled = owned || !ok;
            const legalLabel =
              biz.legality === "legal"
                ? "Legal"
                : biz.legality === "illegal"
                ? "Illegal"
                : "Mixed";
            const legalClass =
              biz.legality === "illegal"
                ? "negative"
                : biz.legality === "legal"
                ? "positive"
                : "neutral";
            const reqs =
              Object.entries(biz.requiredSkills).length === 0
                ? "No special skills required"
                : Object.entries(biz.requiredSkills)
                    .map(([skillId, level]) => {
                      const skillName =
                        BASE_SKILLS.find((s) => s.id === skillId)
                          ?.name ?? skillId;
                      const current = getSkillLevel(state, skillId);
                      const ok = current >= level;
                      return `${skillName} ${current}/${level}${
                        ok ? "" : " ✕"
                      }`;
                    })
                    .join(" · ");

            return `
              <article class="list-item">
                <div class="list-item-main">
                  <div class="list-item-title">${biz.name}</div>
                  <div class="list-item-subtitle">
                    ${biz.description}
                  </div>
                  <div class="tag-row">
                    <span class="tag ${legalClass}">${legalLabel}</span>
                    <span class="tag ${disabled && !owned ? "bad" : "good"}">
                      ${reqs}
                    </span>
                  </div>
                </div>
                <div class="list-item-meta">
                  <div class="pill-soft neutral">
                    Start: ${formatMoney(biz.costToStart)}
                  </div>
                  <div class="pill-soft positive">
                    ~${formatMoney(
                      biz.expectedProfitPerDay
                    )}/day (before upkeep)
                  </div>
                  <button
                    class="btn btn-primary"
                    data-start-business="${biz.id}"
                    ${disabled ? "disabled" : ""}
                  >
                    ${owned ? "Owned" : "Start"}
                  </button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Owned Portfolio</div>
            <div class="card-subtitle">
              Assets you control and how they're currently performing.
            </div>
          </div>
        </div>

        <div class="list">
          ${
            state.ownedBusinesses.length === 0
              ? `<div class="empty-state">You don't own any businesses yet. Save up and invest to escape the shift grind.</div>`
              : state.ownedBusinesses
                  .map((owned) => {
                    const biz = BASE_BUSINESSES.find(
                      (b) => b.id === owned.id
                    );
                    if (!biz) return "";
                    return `
                      <article class="list-item">
                        <div class="list-item-main">
                          <div class="list-item-title">${biz.name}</div>
                          <div class="list-item-subtitle">
                            Profitability multiplier: ${owned.profitability.toFixed(
                              2
                            )}×
                          </div>
                          <div class="tag-row">
                            <span class="tag neutral">
                              Upkeep: ${formatMoney(biz.upkeepPerDay)} / day
                            </span>
                          </div>
                        </div>
                        <div class="list-item-meta">
                          <div class="pill-soft positive">
                            Est. net: ${formatMoney(
                              biz.expectedProfitPerDay * owned.profitability -
                                biz.upkeepPerDay
                            )} / day
                          </div>
                        </div>
                      </article>
                    `;
                  })
                  .join("")
          }
        </div>
      </section>
    </div>
  `;
}

function renderSkills() {
  return `
    <div class="content-layout">
      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Skills</div>
            <div class="card-subtitle">
              Each path in life is gated by different skills. Train intentionally.
            </div>
          </div>
        </div>

        <div class="skills-grid">
          ${BASE_SKILLS.map((skill) => {
            const level = getSkillLevel(state, skill.id);
            const fraction = Math.min(level / 20, 1);
            return `
              <div class="skill-row">
                <div class="skill-top">
                  <span>${skill.name}</span>
                  <span>Lv ${level}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="transform: scaleX(${fraction});"></div>
                </div>
                <div class="skill-actions">
                  <button class="btn btn-outline" data-train-skill="${skill.id}">
                    Train (${formatMoney(30 + level * 5)})
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Skill Synergies</div>
            <div class="card-subtitle">
              How different builds unlock entirely different lives.
            </div>
          </div>
        </div>
        <ul class="list">
          <li class="list-item">
            <div class="list-item-main">
              <div class="list-item-title">Lawful Power</div>
              <div class="list-item-subtitle">
                Intelligence + Law + Charisma opens up lawyers, judges, and eventually governorship.
              </div>
            </div>
          </li>
          <li class="list-item">
            <div class="list-item-main">
              <div class="list-item-title">Street Empire</div>
              <div class="list-item-subtitle">
                Street Smarts + Business turns illegal jobs and black market ventures into a serious empire.
              </div>
            </div>
          </li>
          <li class="list-item">
            <div class="list-item-main">
              <div class="list-item-title">Physical Grind</div>
              <div class="list-item-subtitle">
                Strength keeps you on your feet for demanding jobs, and helps survive the rougher corners of the city.
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  `;
}

function renderMain() {
  let viewHtml;
  if (state.activeView === "overview") viewHtml = renderOverview();
  else if (state.activeView === "jobs") viewHtml = renderJobs();
  else if (state.activeView === "businesses") viewHtml = renderBusinesses();
  else viewHtml = renderSkills();

  return `
    <main class="main-panel">
      ${renderTopBar()}
      ${viewHtml}
    </main>
  `;
}

function render() {
  root.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      ${renderMain()}
    </div>
  `;

  attachEventHandlers();
}

function attachEventHandlers() {
  root.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-nav");
      setState((s) => ({ ...s, activeView: id }));
    });
  });

  const endDayBtn = root.querySelector("[data-action='advance-day']");
  if (endDayBtn) {
    endDayBtn.addEventListener("click", () => {
      setState((s) => advanceDay({ ...s }));
    });
  }

  const saveBtn = root.querySelector("[data-action='save-game']");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveGameState(state);
      alert("Game saved in this browser.");
    });
  }

  root.querySelectorAll("[data-jobs-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-jobs-filter");
      setState((s) => ({ ...s, jobsFilter: filter }));
    });
  });

  root.querySelectorAll("[data-work-job]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const jobId = btn.getAttribute("data-work-job");
      setState((s) => {
        const clone = {
          ...s,
          player: { ...s.player },
          skills: { ...s.skills },
          ownedBusinesses: [...s.ownedBusinesses],
          log: [...s.log],
        };
        workShift(clone, jobId);
        clone.currentJobId = jobId;
        return clone;
      });
    });
  });

  root.querySelectorAll("[data-train-skill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const skillId = btn.getAttribute("data-train-skill");
      setState((s) => {
        const clone = {
          ...s,
          player: { ...s.player },
          skills: { ...s.skills },
          ownedBusinesses: [...s.ownedBusinesses],
          log: [...s.log],
        };
        trainSkill(clone, skillId);
        return clone;
      });
    });
  });

  root.querySelectorAll("[data-start-business]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const businessId = btn.getAttribute("data-start-business");
      setState((s) => {
        const clone = {
          ...s,
          player: { ...s.player },
          skills: { ...s.skills },
          ownedBusinesses: [...s.ownedBusinesses],
          log: [...s.log],
        };
        startBusiness(clone, businessId);
        return clone;
      });
    });
  });
}

render();

