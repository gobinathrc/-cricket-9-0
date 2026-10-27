"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "../utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Global boundary capturing unhandled React rendering errors to prevent total application crash.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError("React rendering crash caught by ErrorBoundary", {
      error: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 bg-red-950/20 border border-red-500/30 rounded-2xl text-center backdrop-blur-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Simulation Rendering Exception</h2>
          <p className="text-sm text-slate-300 max-w-md mb-4">{this.state.errorMessage}</p>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: "" })}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition"
          >
            Retry Session
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
