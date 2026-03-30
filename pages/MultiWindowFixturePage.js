import { expect } from '@playwright/test';

export class MultiWindowFixturePage{
  constructor(page) {
    this.page = page;

    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.orangehrmLink = page.getByRole('link', { name: 'OrangeHRM, Inc' });
  }

  /*
  underscore methods are private by convention, not enforced by JS language but they exist in TS 
  */

  async navigateTo(url) {
    await this.page.goto(url);

    // Assert BEFORE action
    
    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
    await expect(this.orangehrmLink).toBeVisible({ timeout: 15000 });
    console.log('[MultiWindowFixturePage] Login page loaded, link visible');
  }

  async waitForNewWindow(triggerFn) {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
       triggerFn(),
    ]);

    await newPage.waitForLoadState('domcontentloaded');

    await expect(newPage).toHaveTitle(/orangehrm/i, { timeout: 15000 });
    console.log('[MultiWindowFixturePage] New window opened on OrangeHRM site:', newPage.url());

    return newPage;
  }

  async closeWindowAndReturnToMain(newPage) {
    await newPage.close();
    await this.page.bringToFront();

    await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
    await expect(this.orangehrmLink).toBeVisible({ timeout: 15000 });
    console.log('[MultiWindowFixturePage] Back on login page, main window intact');
  }

  // ─── Public wrapper function ────

  async handleMultiWindow() {
    const URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
    await this.navigateTo(URL);
    const newPage = await this.waitForNewWindow(
      () => safeClick(this.orangehrmLink)
    );
    await this.closeWindowAndReturnToMain(newPage);
  }
}