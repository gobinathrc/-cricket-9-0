import { NextResponse } from "next/server";
import { ALL_TOURNAMENT_SQUADS } from "../../../../data/squads";
import { createDraftSession } from "../../../../engine/draft";
import { logInfo, logError } from "../../../../utils/logger";

/**
 * Handles initialization of a new draft session.
 * Exposes server-verified squad catalogs and default state parameters.
 *
 * @param request - HTTP request with custom formation parameters.
 * @returns JSON response with newly initialized DraftSessionState.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    let formation;
    try {
      const body = await request.json();
      formation = body?.formation;
    } catch {
      // Empty or non-JSON body provided
    }
    const session = createDraftSession(ALL_TOURNAMENT_SQUADS, formation);
    logInfo("API: Created new draft session", {
      totalSquads: ALL_TOURNAMENT_SQUADS.length,
      formation: session.formation.shortCode,
    });
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
export async function GET(request: Request): Promise<NextResponse> {
  return POST(request);
}
