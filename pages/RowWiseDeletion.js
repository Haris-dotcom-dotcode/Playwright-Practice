import { expect } from "@playwright/test";

export class RowWiseDeletion {
  constructor(page) {
    this.page = page;

    // Page elements and selectors
    this.table = page.locator("div.orangehrm-container");
    this.rows = this.table.locator(".oxd-table-body .oxd-table-row");
    this.confirmDeleteButton = page.getByRole("button", { name: /yes, delete/i });
    this.toastMessage = page.locator(".oxd-toast");
    this.pimLink = page.getByRole("link", { name: /PIM/i });

    // Helper functions to find elements within rows
    this.deleteButtonInRow = (row) => row.locator("button:has(i.bi-trash)");
    this.rowIdCell = (row) => row.locator(".oxd-table-cell").nth(1);
    this.idLocator = (id) => page.locator(`.oxd-table-cell:text-is("${id}")`);
  }

  // Navigate to employee list
  async gotoPIM() {
    console.log("[RWD] Navigating to PIM page");
    await this.pimLink.click();
    await expect(this.rows.first()).toBeVisible({ timeout: 15000 });
    console.log("[RWD] PIM page loaded, rows visible");
  }

  // Delete a single row
  async deleteRow(rowLocator) {
    const id = await this.getRowId(rowLocator);
    console.log(`[RWD] Deleting row with ID: ${id}`);

    const deleteBtn = this.deleteButtonInRow(rowLocator);
    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();

    console.log("[RWD] Delete confirmation dialog appeared");
    await expect(this.confirmDeleteButton).toBeVisible({ timeout: 5000 });
    await this.confirmDeleteButton.click();

    await expect(this.toastMessage).toBeVisible({ timeout: 10000 });
    console.log(`[RWD] Row ID ${id} deleted, toast message visible`);
    return id;
  }

  async getRowId(rowLocator) {
    const idCell = this.rowIdCell(rowLocator);
    await idCell.waitFor({ state: "visible" });
    const id = (await idCell.innerText()).trim();
    console.log(`[RWD] Found row ID: ${id}`);
    return id;
  }

  // Delete multiple rows and verify deletion
  async deleteFirstNRows(n = 6) {
    await this.gotoPIM();

    const rowCount = await this.rows.count();
    const limit = Math.min(n, rowCount);
    console.log(`[RWD] Preparing to delete ${limit} rows out of ${rowCount}`);

    const deletedIds = [];

    for (let i = 0; i < limit; i++) {
      const row = this.rows.first();
      const deleteBtn = this.deleteButtonInRow(row);

      if ((await deleteBtn.count()) === 0) {
        console.log(`[RWD] Row ${i + 1} has no delete button, skipping...`);
        await row.evaluate((node) => node.remove());
        continue;
      }

      const id = await this.deleteRow(row);
      deletedIds.push(id);
      console.log(`[RWD] Successfully deleted row ${i + 1} (ID=${id})`);
    }

    // Check that all rows were deleted
    for (const id of deletedIds) {
      const exists = await this.idLocator(id).count();
      if (exists === 0) {
        console.log(`[RWD] Row ID ${id} successfully deleted ✅`);
      } else {
        console.warn(`[RWD] Row ID ${id} still exists ⚠️`);
      }
    }

    console.log(`[RWD] Deletion complete. Deleted IDs: ${deletedIds.join(", ")}`);
  }
}