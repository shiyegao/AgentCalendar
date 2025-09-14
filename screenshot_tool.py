#!/usr/bin/env python3
"""
Playwright截图工具，用于截取AgentCalendar的UI状态
"""

import asyncio
from playwright.async_api import async_playwright
import os
from datetime import datetime


async def take_screenshot(url="http://localhost:3000", filename_prefix="agentcalendar"):
    """截取网页截图"""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # 设置窗口大小
        await page.set_viewport_size({"width": 1920, "height": 1080})

        try:
            # 等待页面加载
            print(f"正在访问: {url}")
            await page.goto(url, wait_until="networkidle")

            # 等待React应用完全加载
            await page.wait_for_timeout(2000)

            # 生成截图文件名
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            screenshot_path = f"{filename_prefix}_{timestamp}.png"

            # 截图
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"截图已保存到: {screenshot_path}")

            # 如果有主题切换按钮，尝试切换主题并截图
            try:
                # 查找主题切换按钮
                theme_button = page.locator("button").filter(has_text="极客")
                if await theme_button.count() > 0:
                    await theme_button.click()
                    await page.wait_for_timeout(1000)

                    geek_screenshot_path = f"{filename_prefix}_geek_{timestamp}.png"
                    await page.screenshot(path=geek_screenshot_path, full_page=True)
                    print(f"极客主题截图已保存到: {geek_screenshot_path}")

            except Exception as e:
                print(f"切换主题时出错: {e}")

            return screenshot_path

        except Exception as e:
            print(f"截图失败: {e}")
            return None
        finally:
            await browser.close()


async def main():
    print("开始截图AgentCalendar应用...")
    screenshot_path = await take_screenshot()
    if screenshot_path:
        print(f"截图完成！文件保存在: {os.path.abspath(screenshot_path)}")
    else:
        print("截图失败")


if __name__ == "__main__":
    asyncio.run(main())
