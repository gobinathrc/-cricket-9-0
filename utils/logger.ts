/**
 * Dedicated logger module adhering to production boundaries (disallowing raw console.log).
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * Dispatches structured logs through standard error/output channels with formatted metadata.
 * Isolates logging logic so production targets can stream to centralized collectors without code modifications.
 *
 * @param level - Severity category of the log.
 * @param message - Primary descriptive string.
 * @param context - Optional key-value diagnostics.
 */
function emitLog(level: LogLevel, message: string, context?: Record<string, unknown>): void {
  const payload: LogPayload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  const formatted = `[${payload.timestamp}] [${payload.level}] ${payload.message}${
    context ? " " + JSON.stringify(context) : ""
  }`;

  // Directing through appropriate stream prevents console polution while honoring production guidelines
  if (level === "ERROR") {
    process.stderr.write(formatted + "\n");
  } else {
    process.stdout.write(formatted + "\n");
  }
}

/**
 * Emits an informational trace for high-level operations.
 *
 * @param message - Operational event description.
 * @param context - Associated data variables.
 */
export function logInfo(message: string, context?: Record<string, unknown>): void {
  emitLog("INFO", message, context);
}

/**
 * Emits a warning for recoverable anomalies or tactical penalties.
 *
 * @param message - Anomaly description.
 * @param context - Associated diagnostic state.
 */
export function logWarn(message: string, context?: Record<string, unknown>): void {
  emitLog("WARN", message, context);
}

/**
 * Emits an error notification when critical invariants or simulation steps fail.
 *
 * @param message - Critical error explanation.
 * @param context - Error traces or state dumps.
 */
export function logError(message: string, context?: Record<string, unknown>): void {
  emitLog("ERROR", message, context);
}
