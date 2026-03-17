import { expect } from '@playwright/test';

export class TablePage {
  constructor(page) {
    this.page = page;
    this.url = "https://demoqa.com/webtables";

    // Table locator from last session
    this.table = page.locator('table.-striped.-highlight.table.table-striped.table-bordered.table-hover');
    this.rows = this.table.locator('tbody tr');  
    this.headers = this.table.locator('thead th'); 
  }
  
  async navigate() {
    await this.page.goto(this.url);
    await this.rows.first().waitFor();
  }
  
  async getColumnIndex(columnName) {
    const count = await this.headers.count();
    console.log('Total columns:', count);

    for (let i = 0; i < count; i++) {
      const text = await this.headers.nth(i).innerText();
      console.log('Checking column:', text);
      if (text.trim() === columnName) {
        console.log('Found column', columnName, 'at index', i);
        return i;
      }
    }

    console.log('Column not found:', columnName);
    return -1;
  }

  async getRowIndexByFirstName(firstName) {
    const count = await this.rows.count();
    console.log('Total rows:', count);

    for (let i = 0; i < count; i++) {
      const text = await this.rows.nth(i).innerText();
      console.log('Checking row', i, ':', text);
      if (text.includes(firstName)) {
        console.log('Found first name', firstName, 'at row', i);
        return i;
      }
    }

    console.log('First name not found:', firstName);
    return -1;
  }

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

    for (let i = 0; i < rowCount; i++) {
      const cell = this.rows.nth(i).locator('td').nth(salaryColIndex);
      const salaryText = await cell.innerText();
      console.log('Row', i, 'Salary:', salaryText);
      await this.page.waitForTimeout(1000);

      if (i === rowIndex) {
        console.log('Expected salary for', firstName, ':', expectedSalary);
        await expect(cell).toHaveText(expectedSalary.toString());
        console.log('Salary validation successful ✅');
        await this.page.waitForTimeout(5000);
        return;
      }
    }

    console.log('Salary validation failed for', firstName);
    await this.page.waitForTimeout(3000);
  }
}