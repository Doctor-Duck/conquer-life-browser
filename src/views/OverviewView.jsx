import React from "react";
import { SHIFTS, formatMoney, getMaxEnergy, getMaxHealth } from "../gameCore.js";

export function OverviewView({ state }) {
  const p = state.player;
  const currentJob =
    state.currentJobId &&
    SHIFTS.find((j) => j.id === state.currentJobId);

  return (
    <div className="content-layout">
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Current Life</div>
            <div className="card-subtitle">
              Age {p.age} · {currentJob ? currentJob.name : "No primary job selected"}
            </div>
          </div>
        </div>

        <div className="stat-row stat-row-money">
          <div className="stat-label">
            <span>Money</span>
          </div>
          <div className="stat-value">{formatMoney(p.money)}</div>
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
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Events</div>
            <div className="card-subtitle">
              A running log of the choices you make and what they cost you.
            </div>
          </div>
        </div>
        <div className="log-panel">
          {state.log.length === 0 ? (
            <div className="empty-state">Your story hasn&apos;t started yet.</div>
          ) : (
            [...state.log]
              .slice(-30)
              .reverse()
              .map((entry, idx) => (
                <div className="log-entry" key={idx}>
                  <span>Day {entry.day}</span> · {entry.text}
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}

