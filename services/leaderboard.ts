import { DraftedSquad, MatchResult } from "../types/cricket";
import { logInfo } from "../utils/logger";

/**
 * Record of a completed or failed tournament run for the global hall of fame.
 */
export interface LeaderboardEntry {
  id: string;
  userName: string;
  streak: number; // Max 9
  isChampion: boolean;
  teamAverageOvr: number;
  finalStage: string;
  createdAt: string;
  summary: string;
}

/**
 * In-memory persistence registry for leaderboard entries.
 * Can be swapped for Redis / PostgreSQL in production without touching API layer.
 */
let leaderboardStore: LeaderboardEntry[] = [
  {
    id: "run_sample_1",
    userName: "LegendaryCaptain",
    streak: 9,
    isChampion: true,
    teamAverageOvr: 93,
    finalStage: "THE FINAL (Champions)",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    summary: "Won 9-0 clean sweep against South Africa in the Final",
  },
  {
    id: "run_sample_2",
    userName: "MasterBlaster",
    streak: 7,
    isChampion: false,
    teamAverageOvr: 89,
    finalStage: "SEMI-FINAL",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    summary: "Fell to England in the Semi-Final by 14 runs",
  },
];

/**
 * Retrieves the top leaderboard entries sorted by streak and team rating.
 *
 * @param limit - Maximum entries to return.
 * @returns Sorted array of LeaderboardEntry objects.
 */
export function getTopLeaderboardEntries(limit: number = 10): LeaderboardEntry[] {
  return [...leaderboardStore]
    .sort((a, b) => b.streak - a.streak || b.teamAverageOvr - a.teamAverageOvr)
    .slice(0, limit);
}

/**
 * Appends a verified run record to the leaderboard store.
 *
 * @param entry - Validated LeaderboardEntry.
 */
export function recordRunToLeaderboard(entry: Omit<LeaderboardEntry, "id" | "createdAt">): LeaderboardEntry {
  const newRecord: LeaderboardEntry = {
    ...entry,
    id: `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  leaderboardStore.push(newRecord);
  logInfo("Recorded tournament run to leaderboard", {
    id: newRecord.id,
    streak: newRecord.streak,
    isChampion: newRecord.isChampion,
  });

  return newRecord;
}
