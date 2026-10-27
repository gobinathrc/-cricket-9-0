import { NextRequest, NextResponse } from "next/server";
import {
  LEAGUE_TEAMS,
  generateLeagueSchedule,
  createInitialStandings,
  simulateLeagueMatchday,
  generatePlayoffs,
  TeamStanding,
  LeagueTeam,
} from "../../../engine/league";
import { evaluateSquadTactics, simulateFixture, OpponentTeamProfile } from "../../../engine/simulator";
import { PlayerEditionRecord, TacticalFormation } from "../../../types/cricket";
import { logInfo, logWarn, logError } from "../../../utils/logger";

interface LeagueRequestBody {
  draftedPlayers: PlayerEditionRecord[];
  matchdayIndex: number; // 0 to 13
  currentStandings: TeamStanding[];
  formation?: TacticalFormation;
  isPlayoff?: boolean;
  playoffStage?: "SEMI_FINAL" | "FINAL";
  playoffOpponentId?: string;
}

/**
 * GET /api/league
 * Initializes and returns the static 8 league teams, 14-matchday schedule, and fresh 0-played standings.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const schedule = generateLeagueSchedule(LEAGUE_TEAMS);
    const initialStandings = createInitialStandings(LEAGUE_TEAMS);

    return NextResponse.json({
      success: true,
      data: {
        teams: LEAGUE_TEAMS,
        schedule,
        initialStandings,
        totalMatchdays: schedule.length, // 14
      },
    });
  } catch (error) {
    logError("API: Failed to generate league data", { error });
    return NextResponse.json(
      { success: false, error: "Internal error initializing league" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/league
 * Authoritative server-side simulation of a matchday (or playoff fixture).
 * Simulates all 4 matchday fixtures concurrently and returns the updated standings table.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: LeagueRequestBody = await request.json();

    if (!Array.isArray(body.draftedPlayers) || body.draftedPlayers.length !== 11) {
      logWarn("API: League simulation rejected - Incomplete squad submitted", {
        count: body.draftedPlayers?.length,
      });
      return NextResponse.json(
        { success: false, error: "A complete Starting XI of exactly 11 players is required" },
        { status: 422 }
      );
    }

    const squad = evaluateSquadTactics(body.draftedPlayers, body.formation);
    if (!squad.hasRequiredRoles) {
      logWarn("API: League simulation rejected - Squad failed role composition", {
        missing: squad.missingRoleDescriptions,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Invalid Starting XI composition: ${squad.missingRoleDescriptions.join(". ")}.`,
        },
        { status: 422 }
      );
    }

    // --- Handling Playoff Match ---
    if (body.isPlayoff && body.playoffStage && body.playoffOpponentId) {
      const oppTeam = LEAGUE_TEAMS.find((t) => t.id === body.playoffOpponentId) || LEAGUE_TEAMS[1];
      const matchNumber = body.playoffStage === "SEMI_FINAL" ? 15 : 16;
      const stageName = body.playoffStage === "SEMI_FINAL" ? "SEMI-FINAL" : "THE FINAL";

      const oppProfile: OpponentTeamProfile = {
        id: oppTeam.id,
        stageName,
        matchNumber,
        name: oppTeam.name,
        countryCode: oppTeam.countryCode,
        difficultyTier: body.playoffStage === "FINAL" ? "CHAMPION" : "ELITE",
        battingOvr: oppTeam.battingOvr,
        bowlingOvr: oppTeam.bowlingOvr,
        starPlayer: oppTeam.starPlayer,
      };

      const playoffResult = simulateFixture(squad, oppProfile, matchNumber);
      const isChampion = body.playoffStage === "FINAL" && playoffResult.userWon;

      logInfo("API: Playoff match simulated", {
        stage: body.playoffStage,
        opponent: oppTeam.name,
        userWon: playoffResult.userWon,
        isChampion,
      });

      return NextResponse.json({
        success: true,
        data: {
          isPlayoff: true,
          stage: body.playoffStage,
          playoffResult,
          isChampion,
        },
      });
    }

    // --- Handling Regular Season Matchday ---
    const schedule = generateLeagueSchedule(LEAGUE_TEAMS);
    if (typeof body.matchdayIndex !== "number" || body.matchdayIndex < 0 || body.matchdayIndex >= schedule.length) {
      return NextResponse.json(
        { success: false, error: `Invalid matchdayIndex: must be between 0 and ${schedule.length - 1}` },
        { status: 400 }
      );
    }

    const currentStandings = Array.isArray(body.currentStandings) && body.currentStandings.length === 8
      ? body.currentStandings
      : createInitialStandings(LEAGUE_TEAMS);

    const matchdaySchedule = schedule[body.matchdayIndex];
    const matchdayResult = simulateLeagueMatchday(
      matchdaySchedule,
      currentStandings,
      squad,
      "ind"
    );

    const isRegularSeasonFinished = body.matchdayIndex === schedule.length - 1;
    let userQualifiedForPlayoffs = false;
    let playoffBracket = null;

    if (isRegularSeasonFinished) {
      const userStanding = matchdayResult.updatedStandings.find((s) => s.teamId === "ind");
      userQualifiedForPlayoffs = (userStanding?.rank || 99) <= 4;
      playoffBracket = generatePlayoffs(matchdayResult.updatedStandings);
    }

    logInfo("API: League matchday simulated", {
      matchday: body.matchdayIndex + 1,
      userWon: matchdayResult.userMatchResult.userWon,
      isFinished: isRegularSeasonFinished,
    });

    return NextResponse.json({
      success: true,
      data: {
        matchdayResult,
        isRegularSeasonFinished,
        userQualifiedForPlayoffs,
        playoffBracket,
      },
    });
  } catch (error) {
    logError("API: Error during league simulation", { error });
    return NextResponse.json(
      { success: false, error: "Internal server error during league matchday simulation" },
      { status: 500 }
    );
  }
}
