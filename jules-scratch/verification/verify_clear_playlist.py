import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Get the absolute path to the HTML file
        html_file_path = os.path.abspath("sonoria/100801.html")

        # Go to the local HTML file
        await page.goto(f"file://{html_file_path}")

        # 1. Upload a file to populate the playlist
        async with page.expect_file_chooser() as fc_info:
            await page.locator("#upload-button").click()
        file_chooser = await fc_info.value
        await file_chooser.set_files("sonoria/100801.html") # Using the html file itself as a dummy file for the test

        # Wait for the track title to be updated
        await page.wait_for_selector("#track-title:not(:empty)")

        # Take a screenshot before clearing the playlist
        await page.screenshot(path="jules-scratch/verification/before_clear.png")

        # 2. Click the 'more' button and then the 'clear' button
        await page.locator("#more-button").click()
        await page.locator("#clear-option").click()

        # 3. Take a screenshot after clearing the playlist
        await page.screenshot(path="jules-scratch/verification/after_clear.png")

        await browser.close()

asyncio.run(main())