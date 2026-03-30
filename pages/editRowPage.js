import { expect } from "@playwright/test";

export class EditRowPage {
  // Initializes the EditRowPage with table and row locators for the demoqa webtables.
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";
    this.table = page.locator(
      "table.-striped.-highlight.table.table-striped.table-bordered.table-hover"
    );
    this.rows = this.table.locator("tbody tr");
  }

  // Navigates to the webtables page and waits for the table rows to load.
  async navigate() {
    await this.page.goto(this.url);
    await this.rows.first().waitFor();
  }

  // Edits a table row by first name with new data, filling the modal form and submitting.
  async editRow(firstName, newData) {
    
    const row = this.rows.filter({ hasText: firstName }).first();
    const editButton = row.locator("span[title='Edit']");
    await editButton.click();

    
    const modal = this.page.locator(".modal-content");
    await modal.waitFor({ state: "visible" });

    
    for (const [field, value] of Object.entries(newData)) { // Iterate over key-value pairs in newData object
      const input = this.page.locator(`input#${field}`);
      await input.fill(value);
    }

    
    const submitButton = this.page.locator("button#submit");
    await submitButton.click();
    await this.rows.first().waitFor();
    console.log(`Edited row with First Name: ${firstName}`);
  }
}