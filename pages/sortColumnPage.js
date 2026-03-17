import { expect } from "@playwright/test";

export class SortColumnPage {
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";
    this.table = page.locator("table.-striped.-highlight.table.table-striped.table-bordered.table-hover");
    this.rows = this.table.locator("tbody tr");
    this.headers = this.table.locator("thead tr th");
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: "domcontentloaded" });
    await this.table.waitFor({ state: "visible" });
  }

  async getColumnHeader(columnIndex) {
    return (await this.headers.nth(columnIndex).textContent()).trim();
  }

  async getColumnValues(columnIndex) {
    const values = [];
    const count = await this.rows.count();
    for (let i = 0; i < count; i++) {
      const cellText = (await this.rows.nth(i).locator("td").nth(columnIndex).textContent()).trim();
      values.push(cellText);
    }
    return values;
  }

  async extractAndSortColumn(columnIndex) {
    
    await this.goto();

    const values = await this.getColumnValues(columnIndex);
    console.log(`Column "${await this.getColumnHeader(columnIndex)}" values:`, values);

    const sortedValues = [...values].sort((a,b)=> a-b); 
    console.log("Sorted values:", sortedValues);

    return sortedValues;
  }
}