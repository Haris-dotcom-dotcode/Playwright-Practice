
export class ModalsPage {
  constructor(page) {
    this.page = page;
    this.smallModalBtn = page.getByRole("button", { name: "Small modal" });
    this.largeModalBtn = page.getByRole("button", { name: "Large modal" });
    this.closeBtn = page.getByText("Close");
  }

  async navigate() {
    await this.page.getByRole("link", { name: "Modal Dialogs" }).click();
  }

  async handleModals() {
    await this.smallModalBtn.click();
    await this.closeBtn.click();

    await this.largeModalBtn.click();
    await this.page.getByText("Lorem Ipsum is simply dummy").click();
    await this.closeBtn.click();
  }
}