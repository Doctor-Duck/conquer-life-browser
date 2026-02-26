import React from "react";
import { SHIFTS, BASE_SKILLS, MAX_SKILL_LEVEL, CHARACTER_BACKGROUNDS, STARTING_LOCATIONS, formatMoney, formatTime, getSkillLevel, getSkillLevelBonus, getEffectiveSkillLevel, getMaxEnergy, getMaxHealth, getCityById, getAreaById } from "../gameCore.js";
import { SmartTooltip } from "./SmartTooltip.jsx";

export function PlayerSidebar({ state, moneyDelta, onAdvanceDay, onSave, onNavigate, onWorkShift }) {
  const p = state.player;
  const currentJob =
    state.currentJobId && SHIFTS.find((j) => j.id === state.currentJobId);
  const [journalView, setJournalView] = React.useState("events"); // "events", "missions", or "achievements"
  const [cheatEmojiHovered, setCheatEmojiHovered] = React.useState(false);

  return (
    <aside className="player-sidebar">
      {/* Day Controls */}
      <div className="player-sidebar-section">
        <div className="player-sidebar-header">
          <div className="pill">
            <div className="pill-dot" />
            Day {state.currentDay}
          </div>
          <div className="pill">
            <div className="pill-dot" />
            {formatTime(state.currentTime || 540)}
          </div>
        </div>
      </div>

      {/* Character Info */}
      {(p.fullName || p.name || state.character) && (
        <div className="player-sidebar-section">
          <div className="card-header">
            <div>
              <div className="card-title">
                {p.fullName || p.name || "Unknown"}
                {state.cheats?.achievementsEnabled === false && (
                  <SmartTooltip
                    visible={cheatEmojiHovered}
                    content="Cheats were turned on in this save. Achievements are disabled."
                  >
                    <span
                      style={{ marginLeft: "6px", cursor: "help" }}
                      onMouseEnter={() => setCheatEmojiHovered(true)}
                      onMouseLeave={() => setCheatEmojiHovered(false)}
                    >
                      ⚠️
                    </span>
                  </SmartTooltip>
                )}
              </div>
              <div className="card-subtitle">
                {state.character?.background && (
                  <>
                    {CHARACTER_BACKGROUNDS.find((bg) => bg.id === state.character.background)?.name || state.character.background}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Info */}
      {state.location && (
        <div className="player-sidebar-section">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div className="card-title">Location</div>
              <div className="card-subtitle">
                {(() => {
                  const city = getCityById(state.location.cityId);
                  const area = getAreaById(state.location.areaId);
                  return city && area
                    ? `${area.name}, ${city.name}, ${city.country}`
                    : "Unknown";
                })()}
              </div>
            </div>
            {onNavigate && (
              <button
                className="btn btn-outline"
                onClick={() => onNavigate("travel")}
                style={{ flexShrink: 0, padding: "6px 12px", fontSize: "0.875rem" }}
              >
                Travel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Current Life Stats */}
      <div className="player-sidebar-section">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div className="card-title">Current Life</div>
            <div className="card-subtitle">
              Age {p.age} · {currentJob ? currentJob.name : "No primary job selected"}
            </div>
          </div>
          {currentJob && onWorkShift && (
            <button
              className="btn btn-primary"
              onClick={() => onWorkShift(currentJob.id)}
              disabled={
                !state.location ||
                state.location.areaId !== currentJob.areaId ||
                (currentJob.cityId != null &&
                  state.location.cityId !== currentJob.cityId) ||
                p.energy < 15
              }
              style={{ flexShrink: 0, padding: "6px 12px", fontSize: "0.875rem" }}
              title={
                !state.location ||
                state.location.areaId !== currentJob.areaId ||
                (currentJob.cityId != null &&
                  state.location.cityId !== currentJob.cityId)
                  ? `You need to be in ${getAreaById(currentJob.areaId)?.name || "the correct location"} to work this shift.`
                  : p.energy < 15
                  ? "You need at least 15 energy to work a shift."
                  : `Work a shift as ${currentJob.name}`
              }
            >
              Work Shift
            </button>
          )}
        </div>

        <div className="stat-row stat-row-money">
          <div className="stat-label">
            <span>Money</span>
          </div>
          <div className="stat-value stat-value-money">
            {moneyDelta != null && moneyDelta.amount !== 0 && (
              <span className={`money-delta ${moneyDelta.amount > 0 ? "money-delta-earn" : "money-delta-spend"}`}>
                {moneyDelta.amount > 0 ? `+${formatMoney(moneyDelta.amount)}` : formatMoney(moneyDelta.amount)}
              </span>
            )}
            {formatMoney(p.money)}
          </div>
        </div>

        <div className="stat-row stat-row-energy">
          <div className="stat-label">
            <span>Energy</span>
          </div>
          <div className="stat-value">{Math.min(p.energy, getMaxEnergy(state))}/{getMaxEnergy(state)}</div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill progress-bar-fill-energy"
            style={{ transform: `scaleX(${Math.min(p.energy, getMaxEnergy(state)) / getMaxEnergy(state)})` }}
          />
        </div>

        <div className="stat-row stat-row-health">
          <div className="stat-label">
            <span>Health</span>
          </div>
          <div className="stat-value">{Math.min(p.health, getMaxHealth(state))}/{getMaxHealth(state)}</div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill progress-bar-fill-health"
            style={{ transform: `scaleX(${Math.min(p.health, getMaxHealth(state)) / getMaxHealth(state)})` }}
          />
        </div>

        <div className="stat-row stat-row-notoriety">
          <div className="stat-label">
            <span>Notoriety</span>
          </div>
          <div className="stat-value">{p.notoriety}/100</div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill progress-bar-fill-notoriety"
            style={{ transform: `scaleX(${p.notoriety / 100})` }}
          />
        </div>

        <div className="tag-row">
          <span
            className={
              "tag " +
              (p.money >= 10000 ? "good" : p.money < 0 ? "bad" : "neutral")
            }
          >
            Net worth: {formatMoney(p.money)}
          </span>
          <span
            className={
              "tag " +
              (p.notoriety >= 50 ? "bad" : p.notoriety > 20 ? "neutral" : "good")
            }
          >
            Street heat:{" "}
            {p.notoriety >= 60
              ? "Radioactive"
              : p.notoriety >= 30
              ? "Noticeable"
              : "Low"}
          </span>
          <span className="tag neutral">
            Businesses: {state.ownedBusinesses.length}
          </span>
        </div>
      </div>

      {/* Skills Section */}
      <div className="player-sidebar-section">
        <div className="card-header">
          <div>
            <div className="card-title">Skills</div>
            <div className="card-subtitle">Your current skill levels.</div>
          </div>
        </div>
        <div className="player-skills-list">
          {BASE_SKILLS.map((skill) => {
            const actualLevel = getSkillLevel(state, skill.id);
            const levelBonus = getSkillLevelBonus(state, skill.id);
            const effectiveLevel = getEffectiveSkillLevel(state, skill.id);
            const fraction = Math.min(effectiveLevel / MAX_SKILL_LEVEL, 1);
            return (
              <div key={skill.id} className={`player-skill-item player-skill-${skill.id}`}>
                <div className="player-skill-header">
                  <span className="player-skill-name">{skill.name}</span>
                  <span className="player-skill-level">
                    Lv {actualLevel}
                    {levelBonus > 0 ? (
                      <span className="player-skill-level-bonus"> (+{levelBonus}) = {effectiveLevel}</span>
                    ) : null}
                  </span>
                </div>
                <div className="player-skill-progress-bar">
                  <div
                    className="player-skill-progress-fill"
                    style={{ transform: `scaleX(${fraction})` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Journal Section */}
      <div className="player-sidebar-section player-sidebar-journal-section">
        <div className="card-header">
          <div>
            <div className="card-title">Journal</div>
            <div className="journal-tabs">
              <button
                className={`journal-tab ${journalView === "events" ? "active" : ""}`}
                onClick={() => setJournalView("events")}
              >
                Recent Events
              </button>
              <button
                className={`journal-tab ${journalView === "missions" ? "active" : ""}`}
                onClick={() => setJournalView("missions")}
              >
                Missions
              </button>
              <button
                className={`journal-tab ${journalView === "achievements" ? "active" : ""}`}
                onClick={() => setJournalView("achievements")}
              >
                Achievements
              </button>
            </div>
          </div>
        </div>
        <div className="chat-log-panel">
          {journalView === "events" ? (
            state.log.length === 0 ? (
              <div className="chat-empty-state">Your story hasn&apos;t started yet.</div>
            ) : (
              [...state.log]
                .slice(-30)
                .reverse()
                .map((entry, idx) => (
                  <div className="chat-message" key={idx}>
                    <div className="chat-message-header">
                      <span className="chat-day-badge">Day {entry.day}</span>
                      {entry.time !== undefined && (
                        <span className="chat-time-badge">
                          {formatTime(entry.time)}
                        </span>
                      )}
                    </div>
                    <div className="chat-message-content">{entry.text}</div>
                  </div>
                ))
            )
          ) : journalView === "missions" ? (
            <div className="chat-empty-state">No active missions yet.</div>
          ) : (
            <div className="chat-empty-state">
              {state.cheats?.achievementsEnabled === false ? (
                <div>
                  <div style={{ marginBottom: "8px", color: "#f87171" }}>
                    Achievements are disabled for this save.
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Cheats have been enabled, which disables achievement tracking.
                  </div>
                </div>
              ) : (
                "No achievements unlocked yet."
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="player-sidebar-footer">
        <button className="btn btn-outline btn-full-width" onClick={onSave}>
          Save
        </button>
        <button className="btn btn-primary btn-full-width" onClick={onAdvanceDay}>
          End Day
        </button>
      </div>
    </aside>
  );
}
