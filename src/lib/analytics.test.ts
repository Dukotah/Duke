import { afterEach, describe, expect, it, vi } from "vitest";

// Mock the Vercel SDK so tests assert our event taxonomy without a network call.
const trackMock = vi.fn();
vi.mock("@vercel/analytics", () => ({ track: (...args: unknown[]) => trackMock(...args) }));

import {
  trackCalendlyClick,
  trackEstimatorComplete,
  trackLeadFormSubmit,
  trackPhoneClick,
  trackQuizComplete,
} from "./analytics";

afterEach(() => trackMock.mockReset());

describe("trackLeadFormSubmit", () => {
  it("emits lead_form_submit with normalized properties", () => {
    trackLeadFormSubmit({ formLocation: "contact_section", service: "it-support", hasPhone: true });
    expect(trackMock).toHaveBeenCalledWith("lead_form_submit", {
      form_location: "contact_section",
      service: "it-support",
      has_phone: true,
    });
  });

  it("falls back to 'unspecified' for a missing/blank service", () => {
    trackLeadFormSubmit({ formLocation: "footer", service: "   ", hasPhone: false });
    expect(trackMock).toHaveBeenCalledWith("lead_form_submit", {
      form_location: "footer",
      service: "unspecified",
      has_phone: false,
    });
  });
});

describe("CTA click events", () => {
  it("emits calendly_booking_click with location", () => {
    trackCalendlyClick("hero");
    expect(trackMock).toHaveBeenCalledWith("calendly_booking_click", { location: "hero" });
  });

  it("emits phone_click with location", () => {
    trackPhoneClick("mobile_sticky_bar");
    expect(trackMock).toHaveBeenCalledWith("phone_click", { location: "mobile_sticky_bar" });
  });
});

describe("engagement events", () => {
  it("emits security_quiz_complete with score and tier", () => {
    trackQuizComplete({ score: 14, riskTier: "High Risk" });
    expect(trackMock).toHaveBeenCalledWith("security_quiz_complete", {
      score: 14,
      risk_tier: "High Risk",
    });
  });

  it("emits pricing_estimator_complete with service and range", () => {
    trackEstimatorComplete({ service: "website", range: "$1,500–$4,000" });
    expect(trackMock).toHaveBeenCalledWith("pricing_estimator_complete", {
      service: "website",
      estimated_range: "$1,500–$4,000",
    });
  });
});

describe("resilience", () => {
  it("never throws if the underlying SDK throws", () => {
    trackMock.mockImplementationOnce(() => {
      throw new Error("sdk boom");
    });
    expect(() => trackPhoneClick("header")).not.toThrow();
  });
});
