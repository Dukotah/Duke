// Seed data.
//
// This is a single-operator tool, so it ships EMPTY — you add your own real
// leads through the "Add Lead" button (or POST /api/crm/leads). The roster is
// just you; rep attribution stays in the model so the dashboard/leaderboard
// keep working if you add teammates later.

import type { Lead, Rep } from "./types";

export const SEED_REPS: Rep[] = [{ id: "me", name: "Me", avatarColor: "#F97316" }];

export function buildSeedLeads(): Lead[] {
  return [];
}
