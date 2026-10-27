import { NextRequest, NextResponse } from "next/server";
import { evaluateSquadTactics, WORLD_CUP_SCHEDULE, simulateFixture } from "../../../engine/simulator";
import { PlayerEditionRecord } from "../../../types/cricket";
import { logInfo, logWarn, logError } from "../../../utils/logger";

interface SimulateRequestBody {
  draftedPlayers: PlayerEditionRecord[];
  matchIndex: number; // 0 to 8
}

/**
 * Handles authoritative server-side simulation of a World Cup fixture.
 * Prevents client-side tampering of match outcomes or stats.
 *
 * @param request - NextRequest containing the 11 drafted players and target match index.
 * @returns JSON response with simulated MatchResult.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SimulateRequestBody = await request.json();

    if (!Array.isArray(body.draftedPlayers) || body.draftedPlayers.length !== 11) {
      logWarn("API: Simulation rejected - Incomplete squad submitted", {
        receivedCount: body.draftedPlayers?.length,
      });
      return NextResponse.json(
        { success: false, error: "A complete Starting XI of exactly 11 players is required to simulate" },
        { status: 422 }
      );
    }

    if (typeof body.matchIndex !== "number" || body.matchIndex < 0 || body.matchIndex >= 9) {
      return NextResponse.json(
        { success: false, error: "Invalid matchIndex: must be an integer between 0 and 8" },
        { status: 400 }
      );
    }

    const opponent = WORLD_CUP_SCHEDULE[body.matchIndex];
    const matchNumber = body.matchIndex + 1;

    const squad = evaluateSquadTactics(body.draftedPlayers);
    const result = simulateFixture(squad, opponent, matchNumber);

    const isChampion = result.userWon && matchNumber === 9;

    logInfo("API: Match simulated on server", {
      matchNumber,
      stage: opponent.stageName,
      opponent: opponent.name,
      userWon: result.userWon,
      isChampion,
    });

    return NextResponse.json({
      success: true,
      data: {
        result,
        stageName: opponent.stageName,
        isChampion,
        squadEvaluation: {
          battingOvr: squad.teamBattingOvr,
          bowlingOvr: squad.teamBowlingOvr,
          hasWicketKeeper: squad.hasWicketKeeper,
          bowlerCount: squad.bowlerCount,
          isBalancedAttack: squad.isBalancedAttack,
        },
      },
    });
  } catch (error) {
    logError("API: Error simulating match", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, error: "Internal server error during match simulation" },
      { status: 500 }
    );
  }
}
