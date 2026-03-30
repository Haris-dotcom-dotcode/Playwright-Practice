// File: pages/FileUploadPage.js
const { expect } = require('@playwright/test');

class FileUploadPage {
  constructor(page) {
    this.page = page;

    // ---------------- LOCATORS ----------------
    this.chooseFileButton = page.getByRole('button', { name: 'Choose File' });
    this.uploadButton = page.getByRole('button', { name: 'Upload' });
    this.uploadedFileText = page.locator('#uploaded-files');


        // ---------------- CONFIG ----------------
    this.filePath = 'C:/Users/LENOVO/Downloads/Muhammad_Haris_Shoaib_QA_Resume.pdf';
    this.fileName = this.filePath.split('/').pop(); // Extract just the file name

  }
  

  // ---------------- INTERNAL METHODS ----------------
  async navigate() {
    await this.page.goto('https://the-internet.herokuapp.com/');
    await this.page.getByRole('link', { name: 'File Upload' }).click();
    await expect(this.chooseFileButton).toBeVisible({ timeout: 3000 });
  }

  async setFile(filePath) {
    await this.chooseFileButton.setInputFiles(filePath);
  }

  async submit() {
    await this.uploadButton.click();
  }

  async verifyUpload(fileName) {
    await expect(this.uploadedFileText).toContainText(fileName, { timeout: 5000 });
  }

  // ---------------- WRAPPER FUNCTION ----------------
  async uploadFileWrapper(filePath) {
    await this.navigate();
    await this.setFile(filePath);
    await this.submit();
    await this.verifyUpload(filePath.split('/').pop()); // just the file name
  }
}

module.exports = FileUploadPage;