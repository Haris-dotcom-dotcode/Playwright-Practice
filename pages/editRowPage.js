import { expect } from "@playwright/test";

export class EditRowPage {
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";
    this.table = page.locator(
      "table.-striped.-highlight.table.table-striped.table-bordered.table-hover"
    );
    this.rows = this.table.locator("tbody tr");
  }

  async navigate() {
    await this.page.goto(this.url);
    await this.rows.first().waitFor();
  }

  async editRow(firstName, newData) {
    
    const row = this.rows.filter({ hasText: firstName }).first();
    const editButton = row.locator("span[title='Edit']");
    await editButton.click();
    await this.page.waitForTimeout(5000);

    
    const modal = this.page.locator(".modal-content");
    await modal.waitFor({ state: "visible" });

    
    for (const [field, value] of Object.entries(newData)) {
      const input = this.page.locator(`input#${field}`);
      await input.fill(value);
    }

    
    const submitButton = this.page.locator("button#submit");
    await this.page.waitForTimeout(5000);
    await submitButton.click();
    await this.page.waitForTimeout(5000);
    await this.rows.first().waitFor();
    console.log(`Edited row with First Name: ${firstName}`);
    await this.page.waitForTimeout(5000);
  }
}