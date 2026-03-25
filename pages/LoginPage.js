import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });

    // ✅ Better locator
    this.pimLink = page.getByRole('link', { name: 'PIM' });
  }

  async goto() {
    await this.page.goto("https://opensource-demo.orangehrmlive.com");
  }

  async login(user, pass) {
  await this.username.fill(user);
  await this.password.fill(pass);

  await this.loginBtn.click(); // ✅ just click, no navigation wait
}

  async performLogin(user, pass) {
  await this.goto();
  await this.login(user, pass);

  // wait up to 30 sec for PIM link to appear
  await expect(this.pimLink).toBeVisible({ timeout: 30000 });

  console.log("the control has logged in");
}
}