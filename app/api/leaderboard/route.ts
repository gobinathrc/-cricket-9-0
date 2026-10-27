import { NextRequest, NextResponse } from "next/server";
import { getTopLeaderboardEntries, recordRunToLeaderboard } from "../../../services/leaderboard";
import { logInfo, logError } from "../../../utils/logger";

interface RecordRunBody {
  userName: string;
  streak: number;
  isChampion: boolean;
  teamAverageOvr: number;
  finalStage: string;
  summary: string;
}

/**
 * Retrieves top leaderboard entries from the persistence service.
 *
 * @returns JSON list of top records.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const entries = getTopLeaderboardEntries(15);
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    logError("API: Failed to fetch leaderboard", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, error: "Failed to retrieve leaderboard" },
      { status: 500 }
    );
  }
}

/**
 * Records a verified tournament run to the leaderboard store.
 *
 * @param request - NextRequest containing run stats and user handle.
 * @returns JSON response with newly created record.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RecordRunBody = await request.json();

    if (!body.userName || typeof body.streak !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid payload: userName and streak are required" },
        { status: 400 }
      );
    }

    const recorded = recordRunToLeaderboard({
      userName: body.userName.slice(0, 24), // Bound length
      streak: Math.min(9, Math.max(0, body.streak)),
      isChampion: Boolean(body.isChampion),
      teamAverageOvr: body.teamAverageOvr || 80,
      finalStage: body.finalStage || "GROUP STAGE",
      summary: body.summary || "Completed run",
    });

    logInfo("API: Leaderboard entry created", { id: recorded.id, userName: recorded.userName });

    return NextResponse.json({ success: true, data: recorded }, { status: 201 });
  } catch (error) {
    logError("API: Failed to save leaderboard entry", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, error: "Failed to record run" },
      { status: 500 }
    );
  }
}
