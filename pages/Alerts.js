import { expect } from "@playwright/test";

export class AlertsPage {
  // Initializes the AlertsPage with locators for various alert buttons.
  constructor(page) {
    this.page = page;

    // Buttons for different alerts
    this.alertButton = page.locator("#alertButton");
    this.timerAlertButton = page.locator("#timerAlertButton");
    this.confirmButton = page.locator("#confirmButton");
    this.promptButton = page.locator("#promtButton");
  }

  // Navigates to the demoqa alerts page.
  async navigate() {
    await this.page.goto("https://demoqa.com/webtables");
    await this.page.getByText("Alerts, Frame & Windows").click();
    await this.page.getByRole("link", { name: "Alerts" }).click();
  }

  // Handles a simple alert by accepting it and logging the message.
  async handleSimpleAlert() {
    this.page.once("dialog", (dialog) => {
      console.log("Simple Alert message:", dialog.message());
      dialog.accept();
    });
    await this.alertButton.click();
  }

  // Handles a delayed alert by waiting and then accepting it with logging.
  async handleDelayedAlert() {
    this.page.once("dialog", (dialog) => {
      console.log("Delayed Alert message:", dialog.message());
      dialog.accept();
    });
    await this.timerAlertButton.click();
    await this.page.waitForTimeout(6000); 
  }

  // Handles a confirm alert by accepting or dismissing based on the accept parameter.
  async handleConfirmAlert(accept = true) {
    this.page.once("dialog", (dialog) => {
      console.log("Confirm Alert message:", dialog.message());
      if (accept) dialog.accept(); // If accept is true, accept the dialog
      else dialog.dismiss(); // Otherwise, dismiss it
    });
    await this.confirmButton.click();
  }

  // Handles a prompt alert by providing the specified input text.
  async handlePromptAlert(inputText = "Hello") {
    this.page.once("dialog", (dialog) => {
      console.log("Prompt Alert message:", dialog.message());
      dialog.accept(inputText); // Accept the prompt with the input text
    });
    await this.promptButton.click();
  }

  // Executes all alert handling methods in sequence for comprehensive testing.
  async handleAllAlertsWrapper() {
  console.log("Handling Simple Alert...");
  await this.handleSimpleAlert();

  console.log("Handling Delayed Alert...");
  await this.handleDelayedAlert();

  console.log("Handling Confirm Alert (Accept)...");
  await this.handleConfirmAlert(true);

  console.log("Handling Prompt Alert...");
  await this.handlePromptAlert("Test Input");

  console.log("All alerts handled ✅");
}
}