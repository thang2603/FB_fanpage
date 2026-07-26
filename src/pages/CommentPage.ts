import { type Page } from "playwright";

const COMMENTS = [
  "Giá tốt quá",
  "Check ib",
  "Có ưu đãi k ạ",
  "Cảm ơn shop!",
  "Địa chỉ ở đâu ạ",
  "Giá 21 kg bao nhiêu",
];

function commentText(): string {
  const index = Math.floor(Math.random() * COMMENTS.length);
  return COMMENTS[index] as string;
}

export class CommentPage {
  constructor(private page: Page) {}

  async postComment() {
    const maxScrollAttempts = 2;
    let checkCount = 0;
    let totalCommented = 0;

    const selector =
      'div[role="button"][aria-label^="Bình luận về bài viết của Việt An Express"]:not([data-autocommented])';

    await this.page.evaluate(() => window.scrollBy(0, 600));
    await this.page.waitForTimeout(2000);

    for (let i = 0; i < maxScrollAttempts; i++) {
      const commentButtons = this.page.locator(selector);
      const count = await commentButtons.count();

      if (count === 0) {
        console.log("Không tìm thấy nút 'Bình luận' nào chưa xử lý.");
        checkCount++;
      }

      if (checkCount >= 5) {
        console.log(
          "Đã kiểm tra 5 lần liên tiếp mà không thấy nút comment nào, dừng lại.",
        );
        return totalCommented;
      }

      while (true) {
        const button = this.page.locator(selector).first();
        const exists = (await button.count()) > 0;
        if (!exists) break;

        const isVisible = await button.isVisible().catch(() => false);
        if (!isVisible) {
          // Đánh dấu để bỏ qua, tránh kẹt vòng lặp vô hạn
          await button
            .evaluate((el) => el.setAttribute("data-autocommented", "hidden"))
            .catch(() => {});
          continue;
        }

        await button.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        try {
          await button.click();

          // Chỉ lấy dialog modal thật sự (aria-modal="true"), tránh dialog phụ khác
          const dialog = this.page
            .locator('div[role="dialog"][aria-modal="true"]')
            .first();
          await dialog.waitFor({ state: "visible", timeout: 5000 });

          const input = dialog.getByRole("textbox").first();
          const text = commentText();

          await input.click();
          await input.fill(text);
          await this.page.waitForTimeout(1000);
          await input.press("Enter");

          await this.page.waitForTimeout(1500);
          await this.page.keyboard.press("Escape").catch(() => {});
          await this.page.waitForTimeout(500);

          await button.evaluate((el) =>
            el.setAttribute("data-autocommented", "done"),
          );

          totalCommented++;
          checkCount = 0;
          console.log(
            `Đã comment thành công (tổng: ${totalCommented}): "${text}"`,
          );
        } catch (err) {
          console.log("Lỗi khi comment vào bài viết, bỏ qua bài này:", err);
          await button
            .evaluate((el) => el.setAttribute("data-autocommented", "error"))
            .catch(() => {});
        }

        await this.page.waitForTimeout(1500); // Tránh spam comment liên tục
      }

      // Scroll xuống để tải thêm bài
      await this.page.evaluate(() => window.scrollBy(0, 600));
      await this.page.waitForTimeout(2000);
    }

    return totalCommented;
  }
}
