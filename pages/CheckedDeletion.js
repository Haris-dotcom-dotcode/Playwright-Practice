import { expect } from "@playwright/test";
import { safeClick } from "../utils/actionUtils";

export class CheckedDeletion {
  constructor(page) {
    this.page = page;

    this.table = page.locator("div.orangehrm-container");
    this.rows = this.table.locator(".oxd-table-body .oxd-table-row");
    this.deleteButton = page.getByRole("button", { name: /delete selected/i });
    this.confirmDeleteButton = page.getByRole("button", {name: /yes, delete/i,});
    this.toastMessage = page.locator(".oxd-toast");
    this.pimLink = page.getByRole("link", { name: /PIM/i });
    this.checkboxLabel = (row) => row.locator(".oxd-checkbox-wrapper label");
    this.checkboxInput = (row) => row.locator('input[type="checkbox"]');
    this.rowIdCell = (row) => row.locator(".oxd-table-cell").nth(1);
    this.idLocator = (id) => page.locator(`.oxd-table-cell:text-is("${id}")`);
  }

  // Navigate to PIM page
  async gotoPIM() {
    console.log(" [CD] Navigating to PIM page");
    await this.pimLink.click();
    await expect(this.rows.first()).toBeVisible();
    console.log(" [CD] PIM page loaded, rows visible");
  }

  // Select checkbox for a row
  async selectRowCheckbox(rowLocator) {
    const id = await this.getRowId(rowLocator);
    console.log(`Checking row with ID: ${id}`);
    const checkboxLabel = this.checkboxLabel(rowLocator);
    await checkboxLabel.scrollIntoViewIfNeeded();
    await checkboxLabel.click();

    const input = this.checkboxInput(rowLocator);
    if (!(await input.isChecked())) {
      await input.click({ force: true });
    }
  }

  // Get row ID from row locator
  async getRowId(rowLocator) {
    const idCell = this.rowIdCell(rowLocator);
    await idCell.waitFor({ state: "visible" });
    return (await idCell.innerText()).trim();
  }

  // Click delete button and confirm
  async clickDeleteButton() {
    console.log(" [CD] Clicking delete button for selected rows");
    await safeClick(this.deleteButton);//util function to handle click with wait
    console.log(" [CD] Confirm delete dialog appeared");
    await expect(this.confirmDeleteButton).toBeVisible();
    console.log(" [CD] Clicking confirm delete button");
    await this.confirmDeleteButton.click();
    console.log(" [CD] Waiting for success toast message");
    await expect(this.toastMessage).toBeVisible();
    console.log(" [CD] Deletion verified with toast message");
  }

  // Delete first N checked rows
  async deleteFirstNCheckedRows(n = 6) {
    console.log(` [CD] Starting checked deletion of up to ${n} rows`);
    await this.gotoPIM();

    const rowCount = await this.rows.count();
    const limit = Math.min(n, rowCount);
    console.log(` [CD] Found ${rowCount} rows, will check and delete ${limit} rows`);

    // Capture IDs of rows to delete
    const idsToDelete = [];
    for (let i = 0; i < limit; i++) {
      const row = this.rows.nth(i);
      const id = await this.getRowId(row);
      idsToDelete.push(id);
      await this.selectRowCheckbox(row);
    }
    console.log(" [CD] All rows checked, proceeding to delete");

    await this.clickDeleteButton();
    console.log(" [CD] Delete action performed, verifying deletion...");

    // Verify each row ID is gone
    for (const id of idsToDelete) {
      const idExists = await this.idLocator(id).count();
      if (idExists === 0) {
        console.log(`[CD] Row ID ${id} successfully deleted `);
      } else {
        console.warn(`[CD] Row ID ${id} still exists after deletion!`);
      }
    }

    console.log(" [CD] Checked deletion verification completed");
  }
}
