import { expect } from "@playwright/test";

export class SearchTablePage {
  // Initializes the SearchTablePage with table, rows, and search box locators.
  constructor(page) {
    this.page = page;
    this.table = page.locator("table.-striped.-highlight.table.table-striped.table-bordered.table-hover");
    this.rows = this.table.locator("tbody tr");
    this.searchBox = page.getByRole('textbox', { name: 'Type to search' });
  }

  // Searches the table with a value and verifies that all visible rows contain the search term.
  async searchAndVerify(searchValue) {
    await this.page.goto("https://demoqa.com/webtables");
    await this.searchBox.fill(searchValue);
    await this.rows.first().waitFor();
    
    const visibleRows = await this.rows.allTextContents();
    console.log(`Search term: "${searchValue}"`);
    console.log("Visible rows:", visibleRows);
    const allMatch = visibleRows.every(row => row.includes(searchValue)); // Check if every row includes the search value
    expect(allMatch).toBeTruthy();
  }
}