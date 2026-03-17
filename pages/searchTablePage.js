import { expect } from "@playwright/test";

export class SearchTablePage {
  constructor(page) {
    this.page = page;
    this.table = page.locator("table.-striped.-highlight.table.table-striped.table-bordered.table-hover");
    this.rows = this.table.locator("tbody tr");
    this.searchBox = page.getByRole('textbox', { name: 'Type to search' });
  }

  async searchAndVerify(searchValue) {
    await this.page.goto("https://demoqa.com/webtables");
    await this.searchBox.fill(searchValue);
    await this.rows.first().waitFor();
    
    const visibleRows = await this.rows.allTextContents();
    console.log(`Search term: "${searchValue}"`);
    console.log("Visible rows:", visibleRows);
    const allMatch = visibleRows.every(row => row.includes(searchValue));
    expect(allMatch).toBeTruthy();
  }
}