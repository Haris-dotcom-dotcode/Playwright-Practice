
export class ModalsPage {
  // Initializes the ModalsPage with locators for modal buttons and close button.
  constructor(page) {
    this.page = page;
    this.smallModalBtn = page.getByRole("button", { name: "Small modal" });
    this.largeModalBtn = page.getByRole("button", { name: "Large modal" });
    this.closeBtn = page.getByText("Close");
  }

  // Navigates to the modal dialogs section by clicking the link.
  async navigate() {
    await this.page.getByRole("link", { name: "Modal Dialogs" }).click();
  }

  // Handles small and large modals by opening and closing them sequentially.
  async handleModals() {
    await safeClick(this.smallModalBtn); //util function to handle click with wait
    await this.closeBtn.click();

    await safeClick(this.largeModalBtn); //util function to handle click with wait
    await this.page.getByText("Lorem Ipsum is simply dummy").click(); // Click on the text inside the large modal
    await safeClick(this.closeBtn); //util function to handle click with wait
  }
}