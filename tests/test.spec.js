// Import Playwright test utilities and page object classes for table and UI interactions.
import "dotenv/config";
import { test, expect, chromium } from "@playwright/test";
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
import { FileUploadPage } from "../pages/Fileupload";
import { WindowsPage } from "../pages/WindowsPage";
import { CheckedDeletion } from "../pages/CheckedDeletion";
import { RowWiseDeletion } from "../pages/RowWiseDeletion";
import { MultiWindowFixturePage } from "../pages/MultiWindowFixturePage";

// Test suite for table-related functionalities.
test.describe("Tables", () => {
  // ADD
  test("Add employee", async ({ page }) => {
    const addEmployee = new AddEmployeePage(page);
    await addEmployee.addEmployeeAndVerify();
  });
  // EDIT
  test("edit a row", async ({ page }) => {
    const editPage = new EditRowPage(page);
    await editPage.editRowAndVerify();
  });
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

  test.only("filter table by any column and verify results", async ({ page }) => {
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

  test("delete checked rows", async ({ page }) => {
    console.log("[Test] checked deletion test started");
    const loginPage = new LoginPage(page);
    const checkedDeletion = new CheckedDeletion(page);

    await loginPage.performLogin(process.env.USER_NAME, process.env.PASSWORD);
    console.log("[Test] logged in successfully");

    await checkedDeletion.deleteFirstNCheckedRows();
    console.log("[Test] checked deletion test completed");
  });

  test("row-wise deletion", async ({ page }) => {
    console.log("[Test] row-wise deletion test started");
    const loginPage = new LoginPage(page);
    const deletionPage = new RowWiseDeletion(page);

    await loginPage.performLogin(process.env.USER_NAME, process.env.PASSWORD);
    console.log("[Test] logged in successfully");

    await deletionPage.deleteFirstNRows(3);
    console.log("[Test] row-wise deletion test completed");
  });

  test("multi-window handling", async ({ page }) => {
    const multiWindowFixturePage = new MultiWindowFixturePage(page);
    await multiWindowFixturePage.handleMultiWindow();
  });
});
