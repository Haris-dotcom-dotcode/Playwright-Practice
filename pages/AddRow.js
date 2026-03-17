import { expect } from '@playwright/test';

export class AddEmployeePage {
  constructor(page) {
    this.page = page;

    // Form locators
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.emailInput = page.getByRole('textbox', { name: 'name@example.com' });
    this.ageInput = page.getByRole('textbox', { name: 'Age' });
    this.salaryInput = page.getByRole('textbox', { name: 'Salary' });
    this.departmentInput = page.getByRole('textbox', { name: 'Department' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });

    // Table locators
    this.table = page.locator('table.-striped.-highlight.table.table-striped.table-bordered.table-hover');
  }

  async navigate() {
    await this.page.goto('https://demoqa.com/webtables');
    await expect(this.addButton).toBeVisible();
  }

  async openAddForm() {
    await this.addButton.click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillForm({ firstName, lastName, email, age, salary, department }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.ageInput.fill(age.toString());
    await this.salaryInput.fill(salary.toString());
    await this.departmentInput.fill(department);

    // Expect inputs have correct values
    await expect(this.firstNameInput).toHaveValue(firstName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.ageInput).toHaveValue(age.toString());
    await expect(this.salaryInput).toHaveValue(salary.toString());
    await expect(this.departmentInput).toHaveValue(department);
  }

  async submitForm() {
    await this.submitButton.click();
    await expect(this.table).toBeVisible();
  }

  async verifyEmployeeAdded({ firstName, lastName, email, age, salary, department }) {
  const fullName = `${firstName} `;
  const row = this.table.locator('tbody tr').filter({ hasText: fullName });

  console.log('Waiting for row to appear in table...');
  await row.waitFor({ state: 'visible', timeout: 10000 }); // Wait up to 10s

  console.log('Row is visible, verifying cells...');
  await expect(row.locator('td').nth(0)).toHaveText(firstName);
  await expect(row.locator('td').nth(1)).toHaveText(lastName);
  await expect(row.locator('td').nth(2)).toHaveText(age.toString());
  await expect(row.locator('td').nth(3)).toHaveText(email);
  await expect(row.locator('td').nth(4)).toHaveText(salary.toString());
  await expect(row.locator('td').nth(5)).toHaveText(department);

  console.log('Employee added and verified ✅');
}

  // ----- Wrapper Function for Test -----
  async addEmployeeAndVerify(data) {
    console.log('Opening Add Employee form...');
    await this.openAddForm();

    console.log('Filling employee details...');
    await this.fillForm(data);

    console.log('Submitting form...');
    await this.submitForm();

    console.log('Verifying employee in table...');
    await this.verifyEmployeeAdded(data);

    console.log('Employee added and verified ✅');
  }
}