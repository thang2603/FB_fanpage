import { BrowserManager } from "./browser/Browser.js";
import { PAGE_URL, STORAGE_PATH } from "./config/constants.js";
import { LikePage } from "./pages/LikePage.js";
import { LoginPage } from "./pages/Login.js";
import "dotenv/config";

async function main() {
  const browser = new BrowserManager();

  await browser.launch(STORAGE_PATH);

  const loginPage = new LoginPage(browser.page);

  await loginPage.open(PAGE_URL);

  const likePage = new LikePage(browser.page);
  await likePage.scrollToBottom();

  // // Có thể tiếp tục gọi các Page khác

  // await browser.page.waitForTimeout(5000);
  // await browser.close();
}

main();
