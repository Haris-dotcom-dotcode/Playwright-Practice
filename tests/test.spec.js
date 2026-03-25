// Import Playwright test utilities and page object classes for table and UI interactions.
import { test, expect } from "@playwright/test";
import { only } from "node:test";
import { VerifyCellPage } from "../pages/verifyCellPage";
import { DeleteRowPage } from "../pages/deleteRowPage";
import { SortColumnPage } from "../pages/sortColumnPage";
import { SearchTablePage } from "../pages/searchTablePage";
import { ExtractTablePage } from "../pages/extractTableAsObject";
import { EditRowPage } from "../pages/editRowPage";
import { AlertsPage } from "../pages/Alerts";
import { ModalsPage } from "../pages/Modals";
import { TablePage } from "../pages/tableTraversing";
import { AddEmployeePage } from "../pages/AddRow";
import { LoginPage } from "../pages/LoginPage";
import FileUploadPage from "../pages/Fileupload";
import WindowsPage from "../pages/WindowsPage";
import { PIMPage } from "../pages/PIMpage";

// Test suite for table-related functionalities.
test.describe("Tables", () => {
  // Verifies specific cell values in the table using the VerifyCellPage.
  test("verify cell values in the table", async ({ page }) => {
    const verifyCell = new VerifyCellPage(page);
    await verifyCell.runFullVerification();
  });

  // Deletes rows by first names and verifies the deletions.
  test("delete a row by first name using function", async ({ page }) => {
    const deletePage = new DeleteRowPage(page);
    await deletePage.deleteRows(["Cierra", "Alden"]);
  });

  // Extracts and sorts a specific column numerically.
  test("extract and sort a column", async ({ page }) => {
    const sortColumn = new SortColumnPage(page);
    await sortColumn.extractAndSortColumn(4);
  });

  // Filters the table by various search terms and verifies the results.
  test("filter table by any column and verify results", async ({ page }) => {
    const searchTable = new SearchTablePage(page);
    await searchTable.searchAndVerify("Cierra");
    await searchTable.searchAndVerify("Vega");
    await searchTable.searchAndVerify("39");
    await searchTable.searchAndVerify("10000");
    await searchTable.searchAndVerify("Insurance");
    await searchTable.searchAndVerify("cierra@example.com");
  });

  // Extracts the entire table data as an array of objects.
  test("extract entire table as objects", async ({ page }) => {
    const extractTable = new ExtractTablePage(page);
    await extractTable.extractTable();
  });

  // Edits a row by first name with new data.
  test("edit a row", async ({ page }) => {
    const editPage = new EditRowPage(page);

    await editPage.navigate();

    await editPage.editRow("Cierra", {
      salary: "15000",
      department: "IT",
    });
  });

  // Handles all types of alerts and modals using page objects.
  test("handle all alerts and modals via POM", async ({ page }) => {
    const alertsPage = new AlertsPage(page);
    await alertsPage.navigate();
    await alertsPage.handleAllAlertsWrapper();

    const modalsPage = new ModalsPage(page);
    await modalsPage.navigate();
    await modalsPage.handleModals();
  });

  // Validates the salary for a specific first name in the table.
  test("Validate salary by first name", async ({ page }) => {
    const tablePage = new TablePage(page);

    await tablePage.navigate();

    // Validate salary with simple logs
    await tablePage.validateSalaryByFirstName("Cierra", 10000);
  });

  test("upload file", async ({ page }) => {
    const upload = new FileUploadPage(page);

    await upload.uploadFileWrapper(upload.filePath);
  });

  test("Multiple tab handling ", async ({ page }) => {
    const windowsPage = new WindowsPage(page);
    await windowsPage.handleMultiTabFlow();
  });

  test.only("delete preferred employee", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.performLogin("Admin", "admin123");
    const pimPage = new PIMPage(page);
    await pimPage.goToPIMPage();
    await pimPage.captureAllRows();
    await pimPage.selectFirstNRows();
    await pimPage.deleteSelected();
  });
});
