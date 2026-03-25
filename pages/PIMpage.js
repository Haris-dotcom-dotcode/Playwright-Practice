// import { expect } from '@playwright/test';

// export class PIMPage {
//   constructor(page) {
//     this.page = page;

//     // ---------------- LOCATORS ----------------
//     this.table = page.locator('div.orangehrm-container:visible');
//     this.rows = this.table.locator('.oxd-table-body .oxd-table-row');
//     this.deleteButton = page.getByRole('button', { name: /delete selected/i });
//     this.confirmDeleteButton = page.getByRole('button', { name: /yes, delete/i });
//     this.toastMessage = page.locator('.oxd-toast');
//   }

//   // ---------------- NAVIGATION ----------------
//   async goToPIMPage() {
//     await this.page.getByRole('link', { name: /PIM/i }).click();
//     await expect(this.table).toBeVisible();
//   }

//   // ---------------- TABLE CAPTURE ----------------
//     // ---------------- TABLE CAPTURE ----------------
//   async captureAllRows() {
//     await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
//     const rowCount = await this.rows.count();
//     console.log('Total rows found:', rowCount);
//     const allRows = [];

//     for (let i = 0; i < rowCount; i++) {
//       const row = this.rows.nth(i);
//       const idCell = row.locator('.oxd-table-cell').nth(1);
//       await idCell.waitFor({ state: 'visible' });
//       const idText = (await idCell.innerText()).trim();
//       allRows.push({ row, id: idText });
//       console.log(`Captured row ${i + 1}: ID=${idText}`);
//     }

//     return allRows;
//   }

//   // ---------------- SELECT CHECKBOXES ----------------
//  async selectFirstNRows(n = 2) {
//   const rowCount = await this.rows.count();
//   const limit = Math.min(n, rowCount);

//   for (let i = 0; i < limit; i++) {
//     const row = this.rows.nth(i);

//     // Wait for the row to be fully visible
//     await row.waitFor({ state: 'visible', timeout: 10000 });

//     // Locate the clickable span inside the checkbox
//     const checkboxSpan = row.locator('.oxd-checkbox-wrapper .oxd-checkbox-input-inner');

//     // Wait for the span to be visible and enabled
//     await expect(checkboxSpan).toBeVisible({ timeout: 5000 });

//     // Scroll it into view
//     await checkboxSpan.scrollIntoViewIfNeeded();

//     // Click the checkbox
//     await checkboxSpan.click({ force: true }); // force ensures it clicks even if slightly overlapped

//     console.log(`Selected checkbox for row ${i + 1}`);
//   }

//   // Optional pause to observe in UI mode
//   await this.page.waitForTimeout(2000);
// }

//   // ---------------- SELECT PREFERRED ROW ----------------
 

//   // ---------------- DELETE ----------------
//   async deleteSelectedRow() {
//     await this.deleteButton.click();
//     await this.confirmDeleteButton.click();
//     await expect(this.toastMessage).toContainText('Success');
//   }

//   // ---------------- VERIFY ----------------
//   async verifyRowDeleted(id) {
//     await expect(this.table).not.toContainText(id);
//   }

//   // ---------------- WRAPPER FUNCTION ----------------
//   async deletePreferredEmployee() {
//     await this.goToPIMPage();

//     const allRows = await this.captureAllRows();
//     const id = await this.selectPreferredRow(allRows);
//     await this.deleteSelectedRow();
//     await this.verifyRowDeleted(id);
//   }
// }
import { expect } from '@playwright/test';

export class PIMPage {
  constructor(page) {
    this.page = page;
    this.table = page.locator('div.orangehrm-container');
    this.rows = this.table.locator('.oxd-table-body .oxd-table-row');
    this.deleteButton = page.getByRole('button', { name: /delete selected/i });
    this.confirmDeleteButton = page.getByRole('button', { name: /yes, delete/i });
    this.toastMessage = page.locator('.oxd-toast');
  }

  // ---------------- NAVIGATION ----------------
  async goToPIMPage() {
    await this.page.getByRole('link', { name: /PIM/i }).click();
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
  }

  // ---------------- TABLE CAPTURE ----------------
  async captureAllRows() {
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
    const rowCount = await this.rows.count();
    console.log('Total rows found:', rowCount);
    const allRows = [];

    for (let i = 0; i < rowCount; i++) {
      const row = this.rows.nth(i);
      const idCell = row.locator('.oxd-table-cell').nth(1);
      await idCell.waitFor({ state: 'visible' });
      const idText = (await idCell.innerText()).trim();
      allRows.push({ row, id: idText });
      console.log(`Captured row ${i + 1}: ID=${idText}`);
    }

    return allRows;
  }

  // ---------------- SELECT CHECKBOXES ----------------
  async selectFirstNRows(n = 6) {
    // Wait for table rows to be present
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });

    const rowCount = await this.rows.count();
    const limit = Math.min(n, rowCount);
    console.log(`Selecting ${limit} rows out of ${rowCount}`);

    for (let i = 0; i < limit; i++) {
      const row = this.rows.nth(i);
      await row.waitFor({ state: 'visible' });

      // ✅ Click the LABEL — this is the actual clickable element in OrangeHRM
      const checkboxLabel = row.locator('.oxd-checkbox-wrapper label');
      await checkboxLabel.scrollIntoViewIfNeeded();
      await checkboxLabel.click();

      // Verify it actually got checked via the hidden input
      const input = row.locator('input[type="checkbox"]');
      const isChecked = await input.isChecked();
      console.log(`Row ${i + 1} checked: ${isChecked}`);

      if (!isChecked) {
        // Fallback: force click the input directly
        console.warn(`Row ${i + 1} label click failed, trying force click on input...`);
        await input.click({ force: true });
      }
    }

    await this.page.waitForTimeout(1000);
  }

  // ---------------- DELETE SELECTED ----------------
  async deleteSelected() {
    await this.deleteButton.click();
    await expect(this.confirmDeleteButton).toBeVisible({ timeout: 5000 });
    await this.confirmDeleteButton.click();
    await expect(this.toastMessage).toBeVisible({ timeout: 10000 });
  }
}
