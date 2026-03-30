import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.pimLink = page.getByRole('link', { name: 'PIM' });
  }

  async goto() {
    await this.page.goto("https://opensource-demo.orangehrmlive.com");
  }

  async login(user, pass) {
  await this.username.fill(user);
  await this.password.fill(pass);

  await safeClick(this.loginBtn); //util function to handle click with wait
}

  //wrapper fucntion
  async performLogin(user, pass) {
  await this.goto();
  await this.login(user, pass);

  await expect(this.pimLink).toBeVisible({ timeout: 30000 });

  console.log("the control has logged in");
}
}

