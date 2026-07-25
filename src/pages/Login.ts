import { type Page } from "playwright";
import { BASE_URL } from "../config/constants.js";
import "dotenv/config";
export class LoginPage {
  constructor(private page: Page) {}

  async open(url: string = BASE_URL) {
    await this.page.goto(url);
  }
}
