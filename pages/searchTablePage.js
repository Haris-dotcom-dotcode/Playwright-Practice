import { verifyTableRowsContain } from "../utils/tableUtils";

export class SearchTablePage {
  constructor(page) {
    this.page = page;
    this.table = page.locator("table.-striped.-highlight.table.table-striped.table-bordered.table-hover");
    this.rows = this.table.locator("tbody tr");
    this.searchBox = page.getByRole('textbox', { name: 'Type to search' });
  }

  async navigate() {
    await this.page.goto("https://demoqa.com/webtables");
  }

  // Wrapper method still called in the test
  async searchAndVerify(searchValue) {
    await this.navigate();
    await this.searchBox.fill(searchValue);
    await this.rows.first().waitFor();

    // 🔥 Call the reusable util method
    await verifyTableRowsContain(this.rows, searchValue);
  }
}