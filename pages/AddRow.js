import { expect } from '@playwright/test';
import { safeClick } from '../utils/actionUtils';
import { getText } from '../utils/textUtils';

export class AddEmployeePage {
  
  constructor(page) {
    this.page = page;
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

  // Navigates to the demoqa webtables page and waits for the add button to be visible.
  async navigate() {
    await this.page.goto('https://demoqa.com/webtables');
    await expect(this.addButton).toBeVisible();
  }

  // Clicks the add button to open the employee addition form.
  async openAddForm() {
    await safeClick(this.addButton); //util function to handle click with wait
    await expect(this.firstNameInput).toBeVisible();
  }

  // Fills the employee form with provided details and verifies the input values.
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

  // Submits the employee form and waits for the table to be visible.
  async submitForm() {
    await safeClick(this.submitButton); //util function to handle click with wait
    await expect(this.table).toBeVisible();
  }

  async verifyEmployeeAdded({ firstName, lastName, email, age, salary, department }) {
  const fullName = `${firstName} `;
  const row = this.table.locator('tbody tr').filter({ hasText: fullName });

  console.log('Waiting for row to appear in table...');
  await row.waitFor({ state: 'visible', timeout: 10000 });

  console.log('Row is visible, verifying cells...');

  const firstNameText = await getText(row.locator('td').nth(0));
  const lastNameText = await getText(row.locator('td').nth(1));
  const ageText = await getText(row.locator('td').nth(2));
  const emailText = await getText(row.locator('td').nth(3));
  const salaryText = await getText(row.locator('td').nth(4));
  const departmentText = await getText(row.locator('td').nth(5));

  expect(firstNameText).toBe(firstName);
  expect(lastNameText).toBe(lastName);
  expect(ageText).toBe(age.toString());
  expect(emailText).toBe(email);
  expect(salaryText).toBe(salary.toString());
  expect(departmentText).toBe(department);

  console.log('Employee added and verified successfully!');
}

  // ----- Wrapper Function for Test -----
  async addEmployeeAndVerify() {
  await this.navigate(); 

  const data = {
    firstName: process.env.FIRST_NAME,
    lastName: process.env.LAST_NAME,
    email: process.env.EMAIL,
    age: Number(process.env.AGE),
    salary: Number(process.env.SALARY),
    department: process.env.DEPARTMENT
  };

  console.log('Opening Add Employee form...');
  await this.openAddForm();

  console.log('Filling employee details...');
  await this.fillForm(data);

  console.log('Submitting form...');
  await this.submitForm();

  console.log('Verifying employee in table...');
  await this.verifyEmployeeAdded(data);

  console.log('Employee added and verified successfully!');
}
}