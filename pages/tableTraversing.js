import { expect } from '@playwright/test';

export class TablePage {
  // Initializes the TablePage with URL and table element locators.
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";

    // Table locator from last session
    this.table = page.locator('table.-striped.-highlight.table.table-striped.table-bordered.table-hover');
    this.rows = this.table.locator('tbody tr');  
    this.headers = this.table.locator('thead th'); 
  }
  
  // Navigates to the webtables page and waits for the table rows to load.
  async navigate() {
    await this.page.goto(this.url);
    await this.rows.first().waitFor();
  }
  
  // Finds and returns the index of the column with the specified name.
  async getColumnIndex(columnName) {
    const count = await this.headers.count();
    console.log('Total columns:', count);

    for (let i = 0; i < count; i++) { // Loop through each header
      const text = await this.headers.nth(i).innerText(); // Get inner text of header
      console.log('Checking column:', text);
      if (text.trim() === columnName) { // Check if trimmed text matches column name
        console.log('Found column', columnName, 'at index', i);
        return i;
      }
    }

    console.log('Column not found:', columnName);
    return -1;
  }

  // Finds and returns the row index containing the specified first name.
  async getRowIndexByFirstName(firstName) {
    const count = await this.rows.count();
    console.log('Total rows:', count);

    for (let i = 0; i < count; i++) { // Loop through each row
      const text = await this.rows.nth(i).innerText(); // Get inner text of row
      console.log('Checking row', i, ':', text);
      if (text.includes(firstName)) { // Check if text includes first name
        console.log('Found first name', firstName, 'at row', i);
        return i;
      }
    }

    console.log('First name not found:', firstName);
    return -1;
  }

  // Validates the salary for the specified first name by locating the row and column.
  async validateSalaryByFirstName(firstName, expectedSalary) {
    console.log('Start validating salary for', firstName);
    await this.page.waitForTimeout(2000);

    const rowIndex = await this.getRowIndexByFirstName(firstName);
    await this.page.waitForTimeout(2000);
    if (rowIndex === -1) return;

    const salaryColIndex = await this.getColumnIndex('Salary');
    await this.page.waitForTimeout(2000);
    if (salaryColIndex === -1) return;

    console.log('Traversing salary column...');
    await this.page.waitForTimeout(5000);
    const rowCount = await this.rows.count();

    for (let i = 0; i < rowCount; i++) { // Loop through each row to find the matching salary
      const cell = this.rows.nth(i).locator('td').nth(salaryColIndex); // Locate the salary cell in current row
      const salaryText = await cell.innerText(); // Get inner text of salary cell
      console.log('Row', i, 'Salary:', salaryText);
      await this.page.waitForTimeout(1000);

      if (i === rowIndex) { // If this is the target row
        console.log('Expected salary for', firstName, ':', expectedSalary);
        await expect(cell).toHaveText(expectedSalary.toString()); // Assert the salary matches expected
        console.log('Salary validation successful ✅');
        await this.page.waitForTimeout(5000);
        return;
      }
    }

    console.log('Salary validation failed for', firstName);
    await this.page.waitForTimeout(3000);
  }
}