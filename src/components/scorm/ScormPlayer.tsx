"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface ScormPlayerProps {
  packageId: string;
  version?: "1.2" | "2004";
  className?: string;
}

interface ScormRuntimeState {
  initialized: boolean;
  terminated: boolean;
  lastError: string;
}

export function ScormPlayer({
  packageId,
  version = "1.2",
  className = "",
}: ScormPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runtimeRef = useRef<ScormRuntimeState>({
    initialized: false,
    terminated: false,
    lastError: "0",
  });

  const [launchUrl, setLaunchUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [completionStatus, setCompletionStatus] = useState("not attempted");
  const containerRef = useRef<HTMLDivElement>(null);

  const apiCall = useCallback(
    async (endpoint: string, body: object = {}) => {
      try {
        return await apiFetch(`/scorm/runtime/${packageId}/${endpoint}`, {
          method: "POST",
          body: JSON.stringify(body),
        });
      } catch (err) {
        console.error(`SCORM API ${endpoint} error:`, err);
        return { result: "false", errorCode: "101" };
      }
    },
    [packageId]
  );

  // Build the SCORM API object that content will call
  const buildScormAPI = useCallback(() => {
    const runtime = runtimeRef.current;

    if (version === "1.2") {
      return {
        LMSInitialize: (_param: string = "") => {
          if (runtime.initialized) return "true";
          runtime.initialized = true;
          runtime.terminated = false;
          runtime.lastError = "0";
          apiCall("initialize");
          return "true";
        },
        LMSFinish: (_param: string = "") => {
          if (!runtime.initialized) return "false";
          runtime.terminated = true;
          runtime.initialized = false;
          apiCall("terminate");
          return "true";
        },
        LMSGetValue: (element: string) => {
          if (!runtime.initialized) {
            runtime.lastError = "301";
            return "";
          }
          runtime.lastError = "0";
          // Synchronous return with async backend sync
          return "";
        },
        LMSSetValue: (element: string, value: string) => {
          if (!runtime.initialized) {
            runtime.lastError = "301";
            return "false";
          }
          runtime.lastError = "0";

          if (
            element === "cmi.core.lesson_status" ||
            element === "cmi.completion_status"
          ) {
            setCompletionStatus(value);
          }

          apiCall("setValue", { element, value });
          return "true";
        },
        LMSCommit: (_param: string = "") => {
          if (!runtime.initialized) return "false";
          apiCall("commit");
          return "true";
        },
        LMSGetLastError: () => runtime.lastError,
        LMSGetErrorString: (errorCode: string) => {
          const errors: Record<string, string> = {
            "0": "No Error",
            "101": "General Exception",
            "201": "Invalid argument error",
            "301": "Not initialized",
            "401": "Not implemented error",
          };
          return errors[errorCode] || "Unknown Error";
        },
        LMSGetDiagnostic: (errorCode: string) =>
          `Diagnostic info for error ${errorCode}`,
      };
    }

    // SCORM 2004
    return {
      Initialize: (_param: string = "") => {
        if (runtime.initialized) return "true";
        runtime.initialized = true;
        runtime.terminated = false;
        runtime.lastError = "0";
        apiCall("initialize");
        return "true";
      },
      Terminate: (_param: string = "") => {
        if (!runtime.initialized) return "false";
        runtime.terminated = true;
        runtime.initialized = false;
        apiCall("terminate");
        return "true";
      },
      GetValue: (element: string) => {
        if (!runtime.initialized) {
          runtime.lastError = "123";
          return "";
        }
        runtime.lastError = "0";
        return "";
      },
      SetValue: (element: string, value: string) => {
        if (!runtime.initialized) {
          runtime.lastError = "132";
          return "false";
        }
        runtime.lastError = "0";

        if (
          element === "cmi.completion_status" ||
          element === "cmi.success_status"
        ) {
          setCompletionStatus(value);
        }

        apiCall("setValue", { element, value });
        return "true";
      },
      Commit: (_param: string = "") => {
        if (!runtime.initialized) return "false";
        apiCall("commit");
        return "true";
      },
      GetLastError: () => runtime.lastError,
      GetErrorString: (errorCode: string) => {
        const errors: Record<string, string> = {
          "0": "No Error",
          "101": "General Exception",
          "123": "Not Initialized",
          "132": "Store Data Before Init",
        };
        return errors[errorCode] || "Unknown Error";
      },
      GetDiagnostic: (errorCode: string) =>
        `Diagnostic info for error ${errorCode}`,
    };
  }, [version, apiCall]);

  // Load the package info and set up the API on window
  useEffect(() => {
    let mounted = true;

    const loadPackage = async () => {
      try {
        const pkg = await apiFetch(`/scorm/packages/${packageId}`);
        if (!mounted) return;

        if (pkg.status !== "ready") {
          setError("SCORM package is still processing. Please try again later.");
          return;
        }

        setLaunchUrl(pkg.fullLaunchUrl);

        // Attach API to window so SCORM content can find it
        const api = buildScormAPI();
        if (version === "1.2") {
          (window as any).API = api;
        } else {
          (window as any).API_1484_11 = api;
        }

        setLoading(false);
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load SCORM package");
      }
    };

    loadPackage();

    return () => {
      mounted = false;
      // Cleanup: terminate session if still active
      if (runtimeRef.current.initialized) {
        apiCall("terminate");
      }
      if (version === "1.2") {
        delete (window as any).API;
      } else {
        delete (window as any).API_1484_11;
      }
    };
  }, [packageId, version, buildScormAPI, apiCall]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const reload = () => {
    if (iframeRef.current && launchUrl) {
      runtimeRef.current = {
        initialized: false,
        terminated: false,
        lastError: "0",
      };
      iframeRef.current.src = launchUrl;
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <AlertTriangle className="mb-3 h-10 w-10 text-red-400" />
        <p className="font-medium text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-slate-200 bg-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              completionStatus === "completed" || completionStatus === "passed"
                ? "bg-green-500"
                : completionStatus === "incomplete"
                ? "bg-amber-500"
                : "bg-slate-300"
            }`}
          />
          <span className="text-sm font-medium capitalize text-slate-600">
            {completionStatus.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={reload}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
            title="Reload"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Iframe */}
      <div className="relative overflow-hidden rounded-b-xl border border-slate-200">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
              <p className="text-sm text-slate-500">
                Loading SCORM content...
              </p>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={launchUrl || "about:blank"}
          className="h-[600px] w-full border-0"
          title="SCORM Content"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="fullscreen"
        />
      </div>

      {(completionStatus === "completed" || completionStatus === "passed") && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-green-800">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-medium">
            You have completed this SCORM module.
          </span>
        </div>
      )}
    </div>
  );
}
