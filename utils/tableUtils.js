import { expect } from "@playwright/test";

export async function verifyTableRowsContain(rowsLocator, value) {
  const visibleRows = await rowsLocator.allTextContents();
  console.log(`Verifying table rows contain: "${value}"`);
  console.log("Visible rows:", visibleRows);

  const allMatch = visibleRows.every(row => row.includes(value));
  expect(allMatch).toBeTruthy();
}