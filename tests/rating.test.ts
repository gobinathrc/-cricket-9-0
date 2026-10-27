import { describe, expect, it } from "vitest";
import { calculatePlayerOVR, computeSubRatings, EDITION_BASELINES } from "../engine/rating";

describe("T20 Rating Engine (calculatePlayerOVR)", () => {
  const baseline2014 = EDITION_BASELINES[2014];
  const baseline2007 = EDITION_BASELINES[2007];

  it("calculates elite MVP rating (96-98) for high volume historical peaks", () => {
    // Virat Kohli 2014: 319 runs, avg 106.3, sr 129.1
    const kohli2014Stats = {
      ballsFaced: 247,
      runsScored: 319,
      dismissals: 3,
      oversBowled: 4,
      runsConceded: 26,
      wicketsTaken: 1,
      baselineBattingSr: 130.0,
      baselineBowlingEcon: 7.5,
    };

    const ovr = calculatePlayerOVR(kohli2014Stats, baseline2014, "BAT");
    expect(ovr).toBeGreaterThanOrEqual(96);
    expect(ovr).toBeLessThanOrEqual(99);
  });

  it("applies Bayesian prior shrinkage to prevent inflated rating on low sample sizes", () => {
    // Fringe/injured player who faced only 8 balls and hit 24 runs (SR 300)
    const smallSampleStats = {
      ballsFaced: 8,
      runsScored: 24,
      dismissals: 0,
      oversBowled: 0,
      runsConceded: 0,
      wicketsTaken: 0,
      baselineBattingSr: 125.0, // Historical baseline
      baselineBowlingEcon: 8.0,
    };

    const ovr = calculatePlayerOVR(smallSampleStats, baseline2007, "BAT");
    // Without shrinkage, SR 300 would give 99 OVR. With shrinkage, it should be damped to realistic range
    expect(ovr).toBeLessThan(88);
    expect(ovr).toBeGreaterThanOrEqual(60);
  });

  it("clamps ratings strictly between 60 and 99", () => {
    const terribleStats = {
      ballsFaced: 50,
      runsScored: 10,
      dismissals: 5,
      oversBowled: 10,
      runsConceded: 120,
      wicketsTaken: 0,
      baselineBattingSr: 90.0,
      baselineBowlingEcon: 10.0,
    };

    const minOvr = calculatePlayerOVR(terribleStats, baseline2007, "BAT");
    expect(minOvr).toBeGreaterThanOrEqual(60);
    expect(minOvr).toBeLessThanOrEqual(99);
  });

  it("computes role-appropriate sub-ratings", () => {
    const batSub = computeSubRatings(90, "BAT", "NONE");
    expect(batSub.batting).toBe(90);
    expect(batSub.bowling).toBe(55);

    const bowlSub = computeSubRatings(92, "BOWL", "FAST");
    expect(bowlSub.bowling).toBe(92);
    expect(bowlSub.paceOrTurn).toBe(92);

    const arSub = computeSubRatings(94, "AR", "SPIN_LEG", true);
    expect(arSub.clutch).toBeGreaterThanOrEqual(97);
  });
});
