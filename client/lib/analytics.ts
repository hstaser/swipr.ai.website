// Analytics tracking utility
export interface AnalyticsEvent {
  eventType:
    | "page_view"
    | "button_click"
    | "form_submit"
    | "link_click"
    | "scroll_depth"
    | "time_on_page"
    | "apply_button_click"
    | "waitlist_signup_attempt"
    | "contact_form_open"
    | "learn_more_click";
  page: string;
  element?: string;
  value?: string | number;
  sessionId: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  location?: string;
}

class Analytics {
  private sessionId: string;
  private startTime: number;
  private lastScrollDepth: number = 0;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();

    // Disable analytics in embedded environments or if fetch might be intercepted
    const isEmbedded = window.top !== window.self ||
                      window.location.href.includes('reload=') ||
                      !!window.FS; // FullStory detection

    if (isEmbedded) {
      console.debug('Analytics disabled: embedded environment detected');
      this.isEnabled = false;
      return; // Skip initialization entirely
    }

    // Wait for page to be fully loaded before initializing analytics
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.checkAnalyticsAvailability();
        this.initializeTracking();
      });
    } else {
      // Page already loaded
      setTimeout(() => {
        this.checkAnalyticsAvailability();
        this.initializeTracking();
      }, 100); // Small delay to ensure everything is ready
    }
  }

  private async checkAnalyticsAvailability() {
    try {
      // Quick health check for analytics endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch("/api/analytics/track", {
        method: "OPTIONS",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.isEnabled = response.ok || response.status === 404; // 404 is ok for OPTIONS
    } catch (error) {
      // Start with analytics disabled and enable on first successful request
      console.debug(
        "Analytics endpoint check failed, starting with limited tracking",
      );
      this.isEnabled = false;

      // Try to enable analytics after a delay by testing with a minimal request
      setTimeout(() => {
        this.testAnalyticsEndpoint();
      }, 5000);
    }
  }

  private async testAnalyticsEndpoint() {
    try {
      const testPayload = {
        event: "health_check",
        properties: { test: true },
        userId: "test",
      };

      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        this.isEnabled = true;
        console.debug("Analytics endpoint is now available");
      }
    } catch (error) {
      console.debug("Analytics endpoint still unavailable");
    }
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async trackEvent(
    event: Omit<
      AnalyticsEvent,
      "sessionId" | "timestamp" | "userAgent" | "referrer"
    >,
    useBeacon: boolean = false,
  ) {
    if (!this.isEnabled) {
      return;
    }

    try {
      // Transform to match API expectations
      const apiPayload = {
        event: event.eventType,
        properties: {
          page: event.page,
          element: event.element,
          value: event.value,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || undefined,
          location: window.location.href,
        },
        userId: this.sessionId, // Use sessionId as userId for anonymous tracking
      };

      const payload = JSON.stringify(apiPayload);

      // Use navigator.sendBeacon for page unload events (more reliable)
      if (useBeacon && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
        console.log("📊 Analytics beacon sent:", event.eventType);
        return;
      }

      // Use regular fetch for other events
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced to 3 second timeout

      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Analytics API returned ${response.status}`);
      }

      console.log(
        "📊 Analytics tracked:",
        event.eventType,
        event.element || event.page,
      );
    } catch (error) {
      // Silently fail for analytics to not disrupt user experience
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.debug("Analytics request timed out");
        } else if (error.message.includes("Failed to fetch")) {
          console.debug("Analytics network error - disabling for session");
          this.isEnabled = false; // Disable for rest of session to prevent spam
        } else {
          console.debug("Analytics tracking failed:", error.message);
        }
      }
    }
  }

  private initializeTracking() {
    // Track page view on initialization
    this.trackPageView();

    // Track scroll depth with throttling and error handling
    let ticking = false;
    let lastScrollTime = 0;
    const trackScroll = () => {
      try {
        if (!this.isEnabled) return;

        const now = Date.now();
        // Throttle scroll tracking to once per second
        if (!ticking && now - lastScrollTime > 1000) {
          ticking = true;
          lastScrollTime = now;
          requestAnimationFrame(() => {
            try {
              const scrollHeight =
                document.documentElement.scrollHeight - window.innerHeight;
              if (scrollHeight > 0) {
                const scrollDepth = Math.round(
                  (window.scrollY / scrollHeight) * 100,
                );

                if (
                  scrollDepth > this.lastScrollDepth &&
                  scrollDepth % 25 === 0 &&
                  scrollDepth <= 100
                ) {
                  this.trackEvent({
                    eventType: "scroll_depth",
                    page: window.location.pathname,
                    element: "page",
                    value: scrollDepth,
                  });
                  this.lastScrollDepth = scrollDepth;
                }
              }
            } catch (error) {
              console.debug("Scroll tracking error:", error);
            } finally {
              ticking = false;
            }
          });
        }
      } catch (error) {
        console.debug("Scroll handler error:", error);
        ticking = false;
      }
    };

    window.addEventListener("scroll", trackScroll, { passive: true });

    // Track time on page when leaving (use beacon for reliability)
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - this.startTime) / 1000);
      // Only track if user spent more than 5 seconds on page
      if (timeSpent > 5) {
        this.trackEvent(
          {
            eventType: "time_on_page",
            page: window.location.pathname,
            element: "page",
            value: timeSpent,
          },
          true,
        ); // Use beacon for page unload
      }
    };

    window.addEventListener("beforeunload", trackTimeOnPage, { passive: true });
    window.addEventListener("pagehide", trackTimeOnPage, { passive: true });

    // Track clicks on buttons and links with debouncing
    let lastClickTime = 0;
    document.addEventListener(
      "click",
      (event) => {
        try {
          if (!this.isEnabled) return;

          const now = Date.now();
          // Debounce rapid clicks (prevent tracking within 500ms)
          if (now - lastClickTime < 500) return;
          lastClickTime = now;

          const target = event.target as HTMLElement;
          if (!target) return;

          // Track button clicks
          if (target.tagName === "BUTTON" || target.closest("button")) {
            const button =
              target.tagName === "BUTTON" ? target : target.closest("button");
            const buttonText = button?.textContent?.trim() || "";
            const buttonId = button?.id || "";
            const elementId =
              buttonId ||
              buttonText.toLowerCase().replace(/\s+/g, "-").substring(0, 50);

            this.trackEvent({
              eventType: "button_click",
              page: window.location.pathname,
              element: elementId,
              value: buttonText.substring(0, 100), // Limit text length
            });
          }

          // Track link clicks
          if (target.tagName === "A" || target.closest("a")) {
            const link = target.tagName === "A" ? target : target.closest("a");
            const linkText = link?.textContent?.trim() || "";
            const linkHref = link?.getAttribute("href") || "";

            this.trackEvent({
              eventType: "link_click",
              page: window.location.pathname,
              element: linkText
                .toLowerCase()
                .replace(/\s+/g, "-")
                .substring(0, 50),
              value: linkHref.substring(0, 200), // Limit URL length
            });
          }
        } catch (error) {
          console.debug("Click tracking error:", error);
        }
      },
      { passive: true },
    );
  }

  // Public methods for specific tracking
  trackPageView() {
    try {
      this.trackEvent({
        eventType: "page_view",
        page: window.location.pathname,
        element: document.title.substring(0, 100), // Limit title length
      });
    } catch (error) {
      console.debug("Failed to track page view:", error);
    }
  }

  trackApplyClick(position: string) {
    try {
      if (position && typeof position === "string") {
        this.trackEvent({
          eventType: "apply_button_click",
          page: window.location.pathname,
          element: position.substring(0, 50),
          value: `Apply for ${position}`.substring(0, 100),
        });
      }
    } catch (error) {
      console.debug("Failed to track apply click:", error);
    }
  }

  trackWaitlistSignup(email: string) {
    try {
      this.trackEvent({
        eventType: "waitlist_signup_attempt",
        page: window.location.pathname,
        element: "waitlist-form",
        value: "signup_attempt",
      });
    } catch (error) {
      console.debug("Failed to track waitlist signup:", error);
    }
  }

  trackFormSubmit(formType: string, success: boolean) {
    try {
      if (formType && typeof formType === "string") {
        this.trackEvent({
          eventType: "form_submit",
          page: window.location.pathname,
          element: formType.substring(0, 50),
          value: success ? "success" : "error",
        });
      }
    } catch (error) {
      console.debug("Failed to track form submit:", error);
    }
  }

  trackContactFormOpen() {
    try {
      this.trackEvent({
        eventType: "contact_form_open",
        page: window.location.pathname,
        element: "contact-form",
      });
    } catch (error) {
      console.debug("Failed to track contact form open:", error);
    }
  }

  trackLearnMoreClick() {
    try {
      this.trackEvent({
        eventType: "learn_more_click",
        page: window.location.pathname,
        element: "learn-more-button",
      });
    } catch (error) {
      console.debug("Failed to track learn more click:", error);
    }
  }
}

// Create global analytics instance
export const analytics = new Analytics();

// Hook for React components to use analytics
export const useAnalytics = () => {
  return {
    trackApplyClick: analytics.trackApplyClick.bind(analytics),
    trackWaitlistSignup: analytics.trackWaitlistSignup.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackContactFormOpen: analytics.trackContactFormOpen.bind(analytics),
    trackLearnMoreClick: analytics.trackLearnMoreClick.bind(analytics),
  };
};
