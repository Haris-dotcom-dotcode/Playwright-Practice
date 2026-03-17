import { expect } from "@playwright/test";

export class ExtractTablePage {
  constructor(page) {
    this.page = page;
    this.table = page.locator("table.-striped.-highlight.table.table-striped.table-bordered.table-hover");
    this.rows = this.table.locator("tbody tr");
  }

  async extractTable() {
    await this.page.goto("https://demoqa.com/webtables");
    const headers = (await this.table.locator("thead tr th").allTextContents()).map(h => h.trim());
    const tableData = [];
    for (let i = 0; i < await this.rows.count(); i++) {
      const cells = await this.rows.nth(i).locator("td").allTextContents();
      tableData.push(Object.fromEntries(headers.map((h, idx) => [h, cells[idx].trim()])));
    }
    console.log("Table Data:", tableData);
    expect(tableData[0]["First Name"]).toBe("Cierra");
  }
}