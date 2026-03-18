import { expect } from "@playwright/test";

export class SortColumnPage {
  // Initializes the SortColumnPage with URL and table locators.
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";
    this.table = page.locator("table.-striped.-highlight.table.table-striped.table-bordered.table-hover");
    this.rows = this.table.locator("tbody tr");
    this.headers = this.table.locator("thead tr th");
  }

  // Navigates to the webtables page and waits for the table to be visible.
  async goto() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
    await this.table.waitFor({ state: "visible" });
  }

  // Retrieves the text content of the column header at the specified index.
  async getColumnHeader(columnIndex) {
    return (await this.headers.nth(columnIndex).textContent()).trim();
  }

  // Extracts all values from the specified column index across all rows.
  async getColumnValues(columnIndex) {
    const values = []; // Initialize array to store column values
    const count = await this.rows.count(); // Get total number of rows
    for (let i = 0; i < count; i++) { // Loop through each row
      const cellText = (await this.rows.nth(i).locator("td").nth(columnIndex).textContent()).trim(); // Get text content of cell at column index and trim
      values.push(cellText); // Add trimmed text to values array
    }
    return values;
  }

  // Navigates to the page, extracts column values, and returns them sorted numerically.
  async extractAndSortColumn(columnIndex) {
    
    await this.goto();

    const values = await this.getColumnValues(columnIndex);
    console.log(`Column "${await this.getColumnHeader(columnIndex)}" values:`, values);

    const sortedValues = [...values].sort((a,b)=> a-b); // Spread values into new array and sort numerically ascending
    console.log("Sorted values:", sortedValues);

    return sortedValues;
  }
}