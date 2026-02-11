import React from "react";
import { 
  BASE_SKILLS, 
  formatMoney, 
  getSkillLevel, 
  getSkillExp,
  getExpForLevel,
  getExpNeededForNextLevel,
  calculateTrainToNextLevel,
  MAX_SKILL_LEVEL
} from "../gameCore.js";

export function SkillsView({ state, onTrainSkill, onTrainSkillToNextLevel }) {
  const [activeTab, setActiveTab] = React.useState("skills");

  return (
    <div className="skills-view-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="skills-view-tabs">
              <button
                className={`skills-view-tab ${activeTab === "skills" ? "active" : ""}`}
                onClick={() => setActiveTab("skills")}
              >
                Skills
              </button>
              <button
                className={`skills-view-tab ${activeTab === "perks" ? "active" : ""}`}
                onClick={() => setActiveTab("perks")}
              >
                Perks
              </button>
            </div>
            <div className="card-subtitle">
              {activeTab === "skills"
                ? "Each path in life is gated by different skills. Train intentionally."
                : "Unlock powerful perks to enhance your abilities and opportunities."}
            </div>
          </div>
        </div>

        {activeTab === "skills" && (

        <div className="skills-grid-new">
          {BASE_SKILLS.map((skill) => {
            const level = getSkillLevel(state, skill.id);
            const exp = getSkillExp(state, skill.id);
            const expForCurrentLevel = getExpForLevel(level);
            const expForNextLevel = getExpForLevel(level + 1);
            const expNeeded = expForNextLevel - expForCurrentLevel;
            const currentExpProgress = exp - expForCurrentLevel;
            const fraction = level >= MAX_SKILL_LEVEL ? 1 : currentExpProgress / expNeeded;
            const cost = 30 + level * 5;
            const energyCost = 15;
            const isMaxed = level >= MAX_SKILL_LEVEL;
            const trainToNext = calculateTrainToNextLevel(state, skill.id);

            return (
              <article className="skill-card" key={skill.id}>
                <div className="skill-card-header">
                  <div className="skill-card-title-row">
                    <h3 className="skill-card-title">{skill.name}</h3>
                    <span className="skill-level-badge">
                      Level {level}/{MAX_SKILL_LEVEL}
                    </span>
                  </div>
                </div>

                <div className="skill-card-body">
                  <div className="skill-progress-section">
                    <div className="skill-progress-bar">
                      <div
                        className="skill-progress-fill"
                        style={{ transform: `scaleX(${fraction})` }}
                      />
                    </div>
                    <div className="skill-progress-text">
                      {isMaxed 
                        ? "Max Level" 
                        : `${currentExpProgress}/${expNeeded} EXP to Level ${level + 1}`}
                    </div>
                  </div>

                  <div className="skill-stats">
                    <div className="skill-stat">
                      <span className="skill-stat-label">Current Level</span>
                      <span className="skill-stat-value">{level}</span>
                    </div>
                    <div className="skill-stat">
                      <span className="skill-stat-label">Total EXP</span>
                      <span className="skill-stat-value">{exp.toLocaleString()}</span>
                    </div>
                    <div className="skill-stat">
                      <span className="skill-stat-label">Training Cost</span>
                      <span className="skill-stat-value skill-stat-money">
                        {formatMoney(cost)}
                      </span>
                    </div>
                    <div className="skill-stat">
                      <span className="skill-stat-label">Energy Cost</span>
                      <span className="skill-stat-value skill-stat-energy">
                        ⚡ {energyCost} Energy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="skill-card-footer">
                  <div className="skill-card-buttons">
                    <button
                      className={`btn ${isMaxed ? "btn-outline" : "btn-primary"} skill-train-button ${
                        isMaxed ? "disabled" : ""
                      }`}
                      onClick={() => onTrainSkill(skill.id)}
                      disabled={isMaxed}
                    >
                      {isMaxed ? "Maxed" : `Train (${formatMoney(cost)})`}
                    </button>
                    {!isMaxed && trainToNext.sessions > 0 && (
                      <button
                        className="btn btn-outline skill-train-to-next-button"
                        onClick={() => onTrainSkillToNextLevel(skill.id)}
                        disabled={state.player.money < trainToNext.totalCost}
                      >
                        Train to Level {level + 1}
                        <div className="skill-train-to-next-details">
                          {formatMoney(trainToNext.totalCost)} · {trainToNext.days} day{trainToNext.days !== 1 ? "s" : ""}
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}

        {activeTab === "perks" && (
          <div className="empty-state">Perks system coming soon...</div>
        )}
      </section>

      {activeTab === "skills" && (
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Skill Synergies</div>
            <div className="card-subtitle">
              How different builds unlock entirely different lives.
            </div>
          </div>
        </div>
        <ul className="list">
          <li className="list-item">
            <div className="list-item-main">
              <div className="list-item-title">Lawful Power</div>
              <div className="list-item-subtitle">
                Intelligence + Law + Charisma opens up lawyers, judges, and
                eventually governorship.
              </div>
            </div>
          </li>
          <li className="list-item">
            <div className="list-item-main">
              <div className="list-item-title">Street Empire</div>
              <div className="list-item-subtitle">
                Street Smarts + Business turns illegal jobs and black market
                ventures into a serious empire.
              </div>
            </div>
          </li>
          <li className="list-item">
            <div className="list-item-main">
              <div className="list-item-title">Physical Grind</div>
              <div className="list-item-subtitle">
                Strength keeps you on your feet for demanding jobs, and helps
                survive the rougher corners of the city.
              </div>
            </div>
          </li>
        </ul>
      </section>
      )}
    </div>
  );
}

