// Utility to suppress ResizeObserver loop warnings
// These warnings are typically harmless and caused by rapid DOM changes
// Common in React apps with charts, responsive components, or strict mode

let isErrorHandlerSetup = false;

// Debounce ResizeObserver callbacks to prevent loops
let resizeObserverTimeout: number | null = null;

export function setupResizeObserverErrorHandler() {
  if (isErrorHandlerSetup) return;

  // Handle ResizeObserver loop errors
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args[0];

    // Suppress ResizeObserver loop warnings
    if (
      typeof errorMessage === "string" &&
      (errorMessage.includes("ResizeObserver loop") ||
        errorMessage.includes("ResizeObserver loop completed"))
    ) {
      return; // Don't log this error
    }

    // Also suppress React strict mode ResizeObserver warnings
    if (
      typeof errorMessage === "string" &&
      errorMessage.includes("Warning") &&
      errorMessage.includes("ResizeObserver")
    ) {
      return;
    }

    // Log all other errors normally
    originalConsoleError.apply(console, args);
  };

  // Override ResizeObserver to add debouncing
  if (typeof window !== "undefined" && window.ResizeObserver) {
    const OriginalResizeObserver = window.ResizeObserver;

    window.ResizeObserver = class extends OriginalResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        const debouncedCallback: ResizeObserverCallback = (
          entries,
          observer,
        ) => {
          if (resizeObserverTimeout) {
            clearTimeout(resizeObserverTimeout);
          }

          resizeObserverTimeout = setTimeout(() => {
            try {
              callback(entries, observer);
            } catch (error) {
              // Suppress ResizeObserver errors silently
              if (
                error instanceof Error &&
                error.message.includes("ResizeObserver loop")
              ) {
                return;
              }
              throw error;
            }
          }, 0) as any;
        };

        super(debouncedCallback);
      }
    };
  }

  // Handle global error events
  const handleGlobalError = (event: ErrorEvent) => {
    if (
      event.message ===
        "ResizeObserver loop completed with undelivered notifications." ||
      event.message.includes("ResizeObserver loop")
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return false;
    }
  };

  // Handle unhandled promise rejections
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (
      event.reason?.message?.includes("ResizeObserver loop") ||
      (typeof event.reason === "string" &&
        event.reason.includes("ResizeObserver loop"))
    ) {
      event.preventDefault();
      return false;
    }
  };

  window.addEventListener("error", handleGlobalError);
  window.addEventListener("unhandledrejection", handleUnhandledRejection);

  isErrorHandlerSetup = true;

  // Return cleanup function
  return () => {
    window.removeEventListener("error", handleGlobalError);
    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    console.error = originalConsoleError;
    isErrorHandlerSetup = false;
  };
}

// Auto-setup when imported
if (typeof window !== "undefined") {
  setupResizeObserverErrorHandler();
}
