import { BrowserManager } from "../browser/Browser.js";
import { LoginPage } from "../pages/Login.js";

async function main() {
  const browser = new BrowserManager();

  await browser.launch();

  const login = new LoginPage(browser.page);

  await login.open();

  // Chờ bạn xác nhận đã đăng nhập thành công
  await browser.page.waitForTimeout(60000);

  await browser.saveStorage("src/storage/facebook.json");

  console.log("Storage saved!");
  await browser.close();
}

main();
