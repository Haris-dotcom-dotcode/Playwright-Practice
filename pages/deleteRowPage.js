import { expect } from "@playwright/test";

export class DeleteRowPage {
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";
    this.table = page.locator(
      "table.-striped.-highlight.table.table-striped.table-bordered.table-hover"
    );
  }

  async navigate() {
    await this.page.goto(this.url);
    const firstRow = this.table.locator("tbody tr").first();
    if ((await firstRow.count()) > 0) await firstRow.waitFor();
  }

  async #deleteSingleRow(firstName) {
    const rows = this.table.locator("tbody tr");
    const row = rows.filter({ hasText: firstName }).first();
    const deleteButton = row.locator("span[title='Delete']");
    await deleteButton.click();

    
    await this.page.waitForTimeout(500);
    console.log(`Deleted row with First Name: ${firstName}`);
  }

  async deleteRows(firstNames) {
    await this.navigate();

    let currentRows = await this.table.locator("tbody tr").allTextContents();
    console.log("Rows before deletion:", currentRows);

    for (const name of firstNames) {
      await this.#deleteSingleRow(name);

      currentRows = await this.table.locator("tbody tr").allTextContents();

      console.log(`Rows after deleting "${name}":`, currentRows);
      expect(currentRows.some(text => text.includes(name))).toBeFalsy();
    }
  }
}