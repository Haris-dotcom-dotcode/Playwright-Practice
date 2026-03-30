import { expect } from "@playwright/test";
import "dotenv/config";

export class EditRowPage {
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";
    this.table = page.locator(
      "table.-striped.-highlight.table.table-striped.table-bordered.table-hover"
    );
    this.rows = this.table.locator("tbody tr");
  }

  // Navigate and wait for table to load
  async navigate() {
    await this.page.goto(this.url);
    await this.rows.first().waitFor({ state: "visible" });
  }

  // Edit a row and verify updated values
  async editRowAndVerify() {
    await this.navigate();

    const firstName = process.env.FIRST_NAME_EDIT; // Default to John if not set

    const newData = {
      salary: process.env.SALARY_EDIT.toString(),
      department: process.env.DEPARTMENT_EDIT,
    };

    // Locate the row by first name
    const row = this.rows.filter({ hasText: firstName }).first();
    await expect(row).toBeVisible();

    // Click edit button
    const editButton = row.locator("span[title='Edit']");
    await editButton.waitFor({ state: "visible" });
    await editButton.click();

    // Wait for modal
    const modal = this.page.locator(".modal-content");
    await modal.waitFor({ state: "visible" });

    // Fill form fields
    for (const [field, value] of Object.entries(newData)) {
      const input = modal.locator(`input#${field}`);
      await input.fill(value);
    }

    // Submit form
    const submitButton = modal.locator("button#submit");
    await submitButton.waitFor({ state: "visible" });
    await submitButton.click();

    // Wait for table to update
    await this.rows.first().waitFor({ state: "visible" });

    // Verify updated values
    const updatedRow = this.rows.filter({ hasText: firstName }).first();
    await updatedRow.waitFor({ state: "visible" });

    const salaryText = (await updatedRow.locator("td").nth(4).textContent()).trim();
    const deptText = (await updatedRow.locator("td").nth(5).textContent()).trim();

    expect(salaryText).toBe(process.env.SALARY_EDIT);
    expect(deptText).toBe(process.env.DEPARTMENT_EDIT);

    console.log(`Row updated and verified ✅`);
  }
}