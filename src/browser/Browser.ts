import {
  chromium,
  type Browser,
  type BrowserContext,
  type Page,
} from "playwright";

export class BrowserManager {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;

  async launch(storageState?: string): Promise<void> {
    this.browser = await chromium.launch({ headless: false, slowMo: 100 });

    if (!storageState) {
      this.context = await this.browser.newContext();
    } else {
      this.context = await this.browser.newContext({
        storageState: storageState,
      });
    }
    this.page = await this.context.newPage();
  }

  async close() {
    await this.browser.close();
  }

  async saveStorage(path: string) {
    await this.context.storageState({
      path,
    });
  }
}
