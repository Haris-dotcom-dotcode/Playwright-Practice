import { expect } from "@playwright/test";

export class AlertsPage {
  constructor(page) {
    this.page = page;

    // Buttons for different alerts
    this.alertButton = page.locator("#alertButton");
    this.timerAlertButton = page.locator("#timerAlertButton");
    this.confirmButton = page.locator("#confirmButton");
    this.promptButton = page.locator("#promtButton");
  }

  async navigate() {
    await this.page.goto("https://demoqa.com/webtables");
    await this.page.getByText("Alerts, Frame & Windows").click();
    await this.page.getByRole("link", { name: "Alerts" }).click();
  }

  // Simple Alert
  async handleSimpleAlert() {
    this.page.once("dialog", (dialog) => {
      console.log("Simple Alert message:", dialog.message());
      dialog.accept();
    });
    await this.alertButton.click();
  }

  // Delayed Alert (5 sec)
  async handleDelayedAlert() {
    this.page.once("dialog", (dialog) => {
      console.log("Delayed Alert message:", dialog.message());
      dialog.accept();
    });
    await this.timerAlertButton.click();
    await this.page.waitForTimeout(6000); 
  }

  // Confirm Alert
  async handleConfirmAlert(accept = true) {
    this.page.once("dialog", (dialog) => {
      console.log("Confirm Alert message:", dialog.message());
      if (accept) dialog.accept();
      else dialog.dismiss();
    });
    await this.confirmButton.click();
  }

  // Prompt Alert 
  async handlePromptAlert(inputText = "Hello") {
    this.page.once("dialog", (dialog) => {
      console.log("Prompt Alert message:", dialog.message());
      dialog.accept(inputText);
    });
    await this.promptButton.click();
  }

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