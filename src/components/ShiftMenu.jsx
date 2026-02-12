import React from "react";
import { formatMoney, SHIFT_QUALITIES, SHIFTS } from "../gameCore.js";

const QUALITY_LABELS = {
  [SHIFT_QUALITIES.VERY_BAD]: "Very Bad Shift",
  [SHIFT_QUALITIES.BAD]: "Bad Shift",
  [SHIFT_QUALITIES.NORMAL]: "Normal Shift",
  [SHIFT_QUALITIES.GOOD]: "Good Shift",
  [SHIFT_QUALITIES.VERY_GOOD]: "Very Good Shift",
};

const QUALITY_CLASS = {
  [SHIFT_QUALITIES.VERY_BAD]: "shift-quality-very-bad",
  [SHIFT_QUALITIES.BAD]: "shift-quality-bad",
  [SHIFT_QUALITIES.NORMAL]: "shift-quality-normal",
  [SHIFT_QUALITIES.GOOD]: "shift-quality-good",
  [SHIFT_QUALITIES.VERY_GOOD]: "shift-quality-very-good",
};

export function ShiftMenu({ state, onClose, onWorkAnotherShift }) {
  const result = state?.lastShiftResult;
  if (!result) return null;

  const { jobId, jobName, quality, description, effects } = result;
  const job = SHIFTS.find((j) => j.id === jobId);
  const inCorrectLocation =
    job &&
    state?.location?.areaId === job.areaId &&
    (job.cityId == null || state?.location?.cityId === job.cityId);
  const hasEnergy = (state?.cheats?.unlimitedEnergy) || (state?.player?.energy >= 15);
  const canWorkAgain = inCorrectLocation && hasEnergy;

  return (
    <div className="shift-menu-overlay" onClick={onClose}>
      <div className="shift-menu-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shift-menu-header">
          <div className="shift-menu-title">Shift</div>
          <button type="button" className="shift-menu-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="shift-menu-content">
          <div className="shift-menu-job-name">{jobName}</div>
          <div className={`shift-menu-quality-badge ${QUALITY_CLASS[quality] || "shift-quality-normal"}`}>
            {QUALITY_LABELS[quality] || quality}
          </div>
          <p className="shift-menu-description">{description}</p>

          <div className="shift-menu-effects">
            <div className="shift-menu-effects-title">Results</div>
            <ul className="shift-menu-effects-list">
              {effects?.map((eff, idx) => (
                <li key={idx} className={`shift-menu-effect ${eff.isPenalty ? "penalty" : eff.isBonus ? "bonus" : ""}`}>
                  {eff.type === "money" && (
                    <>
                      {eff.isPenalty ? (
                        <span>Lost {formatMoney(-eff.value)}</span>
                      ) : (
                        <span>Earned {formatMoney(eff.value)}{eff.isBonus ? " (includes bonus)" : ""}</span>
                      )}
                    </>
                  )}
                  {eff.type === "skill" && (
                    <span>
                      {eff.skillName} {eff.value >= 0 ? "+" : ""}{eff.value} EXP
                    </span>
                  )}
                  {eff.type === "notoriety" && (
                    <span>
                      Notoriety {eff.value >= 0 ? "+" : ""}{eff.value}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <p className="shift-menu-rarities-note">
            Shift quality is random: 50% normal, 25% good, 15% bad, 5% very good, 5% very bad.
          </p>
        </div>
        <div className="shift-menu-footer">
          <button
            type="button"
            className="btn btn-primary shift-menu-work-again"
            onClick={() => onWorkAnotherShift(jobId)}
            disabled={!canWorkAgain}
            title={
              !inCorrectLocation
                ? `You need to be in the correct area to work as ${jobName}.`
                : !hasEnergy
                ? "You need at least 15 energy to work a shift."
                : undefined
            }
          >
            Work Another Shift
          </button>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
