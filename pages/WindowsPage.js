const { expect } = require('@playwright/test');

class WindowsPage {
  constructor(page) {
    this.page = page;

    // ---------------- LOCATORS ----------------
    this.openTabLink = page.getByRole('link', { name: 'Click Here' });
    this.mainPageHeading = page.getByRole('heading', { name: 'Opening a new window' });
  }

  // ---------------- METHODS ----------------

  async navigate() {
    await this.page.goto('https://the-internet.herokuapp.com/windows');
  }

  async openNewTab() {
    const [newPage] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.openTabLink.click(),
    ]);

    await newPage.waitForLoadState();
    return newPage;
  }

  async validateNewTab(newPage) {
    await expect(
      newPage.getByRole('heading', { name: 'New Window' })
    ).toBeVisible();
    console.log("New tab validated");
  }

  async returnToMainTab() {
    await this.page.bringToFront();

    await expect(this.mainPageHeading).toBeVisible();
  }

  // ---------------- WRAPPER ----------------
  async handleMultiTabFlow() {
    await this.navigate();
    const newTab = await this.openNewTab();
    await this.validateNewTab(newTab);
    // optional
    await newTab.close();
    await this.returnToMainTab();
  }
}

module.exports = WindowsPage;