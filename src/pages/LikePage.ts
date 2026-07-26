import { type Page } from "playwright";
import { PAGE_URL } from "../config/constants.js";
export class LikePage {
  constructor(private page: Page) {}
  async run() {
    await this.page.goto(PAGE_URL);
    await this.scrollToBottom();
  }
  async scrollToBottom() {
    const maxScrollAttempts = 20;
    let checkCount = 0;
    let totalLiked = 0;
    await this.page.evaluate(() => window.scrollBy(0, 600));
    await this.page.waitForTimeout(2000);

    for (let i = 0; i < maxScrollAttempts; i++) {
      const likeButtons = this.page.locator(
        'div[role="button"][aria-label^="Bày tỏ cảm xúc Thích về bài viết của Việt An Express"]',
      );
      const likeButtonCount = await likeButtons.count();
      if (likeButtonCount === 0) {
        console.log("Không tìm thấy nút 'Thích' nào (chưa like).");
        checkCount++;
      }
      if (checkCount >= 5) {
        console.log(
          "Đã kiểm tra 5 lần liên tiếp mà không thấy nút like nào, dừng lại.",
        );
        return totalLiked;
      }

      while (true) {
        const button = this.page
          .locator(
            'div[role="button"][aria-label^="Bày tỏ cảm xúc Thích về bài viết của Việt An Express"]',
          )
          .first();
        const exists = (await button.count()) > 0;
        if (!exists) break;
        const isVisible = await button.isVisible().catch(() => false);
        if (!isVisible) {
          // Không click được thì thoát vòng while để tránh lặp vô hạn,
          // sẽ scroll xuống rồi thử lại ở vòng for tiếp theo
          break;
        }

        await button.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);

        await button.click();
        await this.page.waitForTimeout(800);

        const ariaLabelAfter = await button
          .getAttribute("aria-label")
          .catch(() => null);
        const success = ariaLabelAfter?.startsWith("Gỡ Thích");
        if (success) {
          totalLiked++;
          checkCount = 0;
          console.log(`Đã like thành công (tổng: ${totalLiked})`);
        } else {
          console.log(
            "Click không thành công hoặc trạng thái chưa kịp cập nhật:",
            ariaLabelAfter,
          );
          // Tránh lặp vô hạn nếu click liên tục thất bại trên cùng 1 nút
          break;
        }

        await this.page.waitForTimeout(1000); // Tránh spam click
      }
      await this.page.evaluate(() => window.scrollBy(0, 600));
      await this.page.waitForTimeout(2000);
    }
    // Scroll xuống để tải thêm bài
    return totalLiked;
  }
}
