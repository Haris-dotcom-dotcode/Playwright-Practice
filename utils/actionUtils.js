export async function safeClick(locator) {
  await locator.waitFor({ state: "visible" });
  await locator.waitFor({ state: "attached" });
  await locator.click();
}
