import { BrowserManager } from "../browser/Browser.js";
import { PAGE_URL } from "../config/constants.js";
import { LoginPage } from "../pages/Login.js";

async function main() {
  const browser = new BrowserManager();

  // await browser.launchPersistentContext();
  await browser.launch();
  const login = new LoginPage(browser.page);

  await login.open(PAGE_URL);

  // Chờ bạn xác nhận đã đăng nhập thành công
  await browser.page.waitForTimeout(200000);

  console.log("Saved session!");
  await browser.saveStorage("src/storage/facebook.json");

  console.log("Storage saved!");
  // await browser.close();
}

main();
