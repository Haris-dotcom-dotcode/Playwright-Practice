import { expect } from "@playwright/test";

export class ExtractTablePage {
  // Initializes the ExtractTablePage with table and row locators.
  constructor(page) {
    this.page = page;
    this.table = page.locator("table.-striped.-highlight.table.table-striped.table-bordered.table-hover");
    this.rows = this.table.locator("tbody tr");
  }

  // Extracts the table data as an array of objects with headers as keys and asserts the first row.
  async extractTable() {
    await this.page.goto("https://demoqa.com/webtables");
    const headers = (await this.table.locator("thead tr th").allTextContents()).map(h => h.trim()); // Get all header texts and trim whitespace using map
    const tableData = [];
    for (let i = 0; i < await this.rows.count(); i++) { // Loop through each row
      const cells = await this.rows.nth(i).locator("td").allTextContents(); // Get all cell texts for the current row
      tableData.push(Object.fromEntries(headers.map((h, idx) => [h, cells[idx].trim()]))); // Create object with headers as keys and trimmed cell values using fromEntries and map
    }
    console.log("Table Data:", tableData);
    expect(tableData[0]["First Name"]).toBe("Cierra");
  }
}