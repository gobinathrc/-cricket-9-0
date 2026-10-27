import { NextResponse } from "next/server";
import { ALL_TOURNAMENT_SQUADS } from "../../../../data/squads";
import { createDraftSession } from "../../../../engine/draft";
import { logInfo, logError } from "../../../../utils/logger";

/**
 * Handles initialization of a new draft session.
 * Exposes server-verified squad catalogs and default state parameters.
 *
 * @returns JSON response with newly initialized DraftSessionState.
 */
export async function POST(): Promise<NextResponse> {
  try {
    const session = createDraftSession(ALL_TOURNAMENT_SQUADS);
    logInfo("API: Created new draft session", { totalSquads: ALL_TOURNAMENT_SQUADS.length });
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    logError("API: Failed to initialize draft session", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, error: "Internal server error initializing draft" },
      { status: 500 }
    );
  }
}

/**
 * Convenience GET endpoint to retrieve active session parameters and edition catalog info.
 */
export async function GET(): Promise<NextResponse> {
  return POST();
}
