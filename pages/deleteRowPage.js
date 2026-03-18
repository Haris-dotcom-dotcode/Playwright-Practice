import { expect } from "@playwright/test";

export class DeleteRowPage {
  // Initializes the DeleteRowPage with table locator and demoqa URL.
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";
    this.table = page.locator(
      "table.-striped.-highlight.table.table-striped.table-bordered.table-hover"
    );
  }

  // Navigates to the webtables page and waits for the first table row if present.
  async navigate() {
    await this.page.goto(this.url);
    const firstRow = this.table.locator("tbody tr").first();
    if ((await firstRow.count()) > 0) await firstRow.waitFor();
  }

  // Private method to delete a single table row by matching the first name.
  async #deleteSingleRow(firstName) {
    const rows = this.table.locator("tbody tr");
    const row = rows.filter({ hasText: firstName }).first();
    const deleteButton = row.locator("span[title='Delete']");
    await deleteButton.click();

    
    await this.page.waitForTimeout(500);
    console.log(`Deleted row with First Name: ${firstName}`);
  }

  // Deletes multiple table rows by first names and verifies each deletion.
  async deleteRows(firstNames) {
    await this.navigate();

    let currentRows = await this.table.locator("tbody tr").allTextContents();
    console.log("Rows before deletion:", currentRows);

    for (const name of firstNames) { // Loop through each first name to delete
      await this.#deleteSingleRow(name);

      currentRows = await this.table.locator("tbody tr").allTextContents();

      console.log(`Rows after deleting "${name}":`, currentRows);
      expect(currentRows.some(text => text.includes(name))).toBeFalsy(); // Assert no row contains the deleted name
    }
  }
}