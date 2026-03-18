import { expect } from "@playwright/test";

export class VerifyCellPage {
  // Initializes the VerifyCellPage with URL and table locators.
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";
    this.table = page.locator("table.-striped.-highlight.table.table-striped.table-bordered.table-hover");
    this.rows = this.table.locator("tbody tr");
  }

  async navigate() {
    await this.page.goto(this.url);
    await this.rows.first().waitFor();
  }

  async getRowByText(text) {
    return this.rows.filter({ hasText: text }).first();
  }

  async getCellValuesFromRow(row) {
    const cells = row.locator("td"); // Locate all td elements in the row
    const values = []; // Initialize array for cell values
    const count = await cells.count(); // Get number of cells
    for (let i = 0; i < count; i++) { // Loop through each cell
      values.push((await cells.nth(i).textContent()).trim()); // Get text content, trim, and push to array
    }
    return values;
  }

  async verifyCellValue(rowText, expectedValue) {
    const row = await this.getRowByText(rowText);
    const cells = await this.getCellValuesFromRow(row);// capturing data using function and reciving data in array
    const match = cells.includes(expectedValue); // Check if array includes the expected value
    expect(match).toBeTruthy();
  }

  async printTable() {
    const tableText = await this.table.allTextContents(); // Get all text content from the table
    console.log("Table Text:", tableText);//displaying data in console
    const rowTexts = await this.rows.allTextContents(); // Get all text content from rows
    console.log("Row Texts:", rowTexts);//displaying data in console
  }

  // --- Wrapper function ---
  async runFullVerification() {
    await this.navigate();
    await this.printTable();
    await this.verifyCellValue("Cierra", "10000");
    await this.verifyCellValue("Alden", "Compliance");
  }
}