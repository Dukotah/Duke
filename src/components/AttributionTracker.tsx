"use client";

import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/attribution";

// Records first-touch attribution (UTM + referrer + landing page) once per
// session. Renders nothing; mounted site-wide from the root layout.
export default function AttributionTracker() {
  useEffect(() => {
    captureFirstTouch();
  }, []);
  return null;
}
