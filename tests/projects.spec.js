import { expect, test } from "@playwright/test";

test.describe("Project Pages", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to project page from home", async ({ page }) => {
    // Find the first project card
    const projectCard = page.locator(".project-card").first();
    const projectTitle = await projectCard.locator("h3").innerText();
    
    // Click the card
    await projectCard.click();
    
    // Verify URL contains projects
    await expect(page).toHaveURL(/\/projects\//);
    
    // Verify project title matches
    await expect(page.locator("h1")).toHaveText(projectTitle);
    
    // Verify breadcrumbs
    await expect(page.locator("nav[aria-label='Breadcrumb']")).toBeVisible();
    await expect(page.locator("nav[aria-label='Breadcrumb']")).toContainText("Projects");
    await expect(page.locator("nav[aria-label='Breadcrumb']")).toContainText(projectTitle);
  });

  test("should display project details correctly", async ({ page }) => {
    // Navigate directly to a specific project (e.g., Note Taker)
    await page.goto("/projects/note-taker-addons");
    
    // Verify title
    await expect(page.locator("h1")).toHaveText("Note Taker + Add-ons");
    
    // Verify description exists
    await expect(page.locator(".prose")).toBeVisible();
    
    // Verify features section
    await expect(page.locator("text=Kluczowe funkcje")).toBeVisible();
    
    // Verify technologies
    await expect(page.getByText("Make", { exact: true })).toBeVisible();
    await expect(page.getByText("Airtable", { exact: true })).toBeVisible();
    
    // Verify SEO meta tags (title)
    await expect(page).toHaveTitle(/Note Taker \+ Add-ons | Portfolio/);
  });

  test("should have working back navigation", async ({ page }) => {
    await page.goto("/projects/note-taker-addons");
    
    // Click back link
    await page.click("text=Powrót do projektów");
    
    // Verify returned to home/projects section
    await expect(page).toHaveURL(/#projects/);
  });
});
