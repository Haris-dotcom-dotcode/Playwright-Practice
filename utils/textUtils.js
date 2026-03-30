export async function getText(locator) {
  return (await locator.textContent())?.trim();
}