/**
 * Smoke tests — verify critical pages load and key UI elements are present.
 * Requires a running server (npm run build && npm run start, or npm run dev).
 * Run with: PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test
 *
 * Assertions are kept resilient: pages that don't set a custom <title> (they
 * inherit the site default) are checked by a visible heading / key control
 * instead of a brittle title regex.
 */

import { test, expect } from "@playwright/test";

test("home page loads with title and nav", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Copper Bay Tech/i);
  await expect(page.locator("nav").first()).toBeVisible();
});

test("health-check audit tool loads with a URL input", async ({ page }) => {
  await page.goto("/tools/health-check");
  await expect(page.locator("h1").first()).toBeVisible();
  const urlInput = page.locator(
    "input[type=url], input[placeholder*=URL], input[placeholder*=url], input[type=text]",
  );
  await expect(urlInput.first()).toBeVisible();
});

test("blog index renders at least 5 posts", async ({ page }) => {
  await page.goto("/blog");
  await expect(page).toHaveTitle(/Resources|Blog/i);
  const links = page.locator("a[href*='/blog/']");
  expect(await links.count()).toBeGreaterThanOrEqual(5);
});

test("contact form / section is reachable from home", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("form");
  const contactSection = page.locator("#contact, [id*=contact]");
  const hasForm = (await form.count()) > 0;
  const hasContact = (await contactSection.count()) > 0;
  expect(hasForm || hasContact).toBeTruthy();
});

test("schedule page loads", async ({ page }) => {
  await page.goto("/schedule");
  await expect(page).toHaveTitle(/Schedule|Book|Consultation|Cal/i);
});

test("pricing page loads", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page).toHaveTitle(/Pric/i);
});

test("IT support service page loads with an H1", async ({ page }) => {
  await page.goto("/services/it-support");
  await expect(page).toHaveTitle(/IT Support/i);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("cybersecurity service page loads", async ({ page }) => {
  await page.goto("/services/cybersecurity");
  await expect(page).toHaveTitle(/Cybersecurity/i);
});

test("missed-call calculator renders with a numeric/range input", async ({ page }) => {
  await page.goto("/tools/missed-call-calculator");
  await expect(page.locator("h1").first()).toBeVisible();
  const inputs = page.locator("input[type=number], input[type=range]");
  await expect(inputs.first()).toBeVisible();
});

test("CRM login page renders a login form", async ({ page }) => {
  await page.goto("/crm/login");
  const emailInput = page.locator("input[type=email]");
  const passwordInput = page.locator("input[type=password]");
  await expect(emailInput.or(passwordInput).first()).toBeVisible({ timeout: 5000 });
});
