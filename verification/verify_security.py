from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # 1. Navigate to the app
    print("Navigating to app...")
    page.goto("http://localhost:9002")

    # 2. Wait for the security dialog to appear (Setup Mode)
    print("Waiting for Security Dialog...")
    page.wait_for_selector("text=Secure Your Inventory")

    # Take screenshot of setup dialog
    page.screenshot(path="verification/1_setup_dialog.png")
    print("Screenshot 1: Setup Dialog captured.")

    # 3. Enter password and confirm
    print("Entering password...")
    page.fill("input[placeholder='Create Password']", "testpassword123")
    page.fill("input[placeholder='Confirm Password']", "testpassword123")

    # 4. Submit
    print("Submitting...")
    page.click("button:has-text('Encrypt & Start')")

    # 5. Wait for dialog to close and content to appear
    page.wait_for_selector("text=Pathway Ledger")

    # Take screenshot of unlocked app
    page.screenshot(path="verification/2_unlocked_app.png")
    print("Screenshot 2: Unlocked App captured.")

    # 6. Reload page to verify persistence and lock
    print("Reloading page...")
    page.reload()

    # 7. Wait for Unlock Dialog
    print("Waiting for Unlock Dialog...")
    page.wait_for_selector("text=Unlock Pathway Ledger")

    # Take screenshot of unlock dialog
    page.screenshot(path="verification/3_unlock_dialog.png")
    print("Screenshot 3: Unlock Dialog captured.")

    # 8. Enter wrong password
    print("Testing wrong password...")
    page.fill("input[placeholder='Enter Password']", "wrongpassword")
    page.click("button:has-text('Unlock')")

    # Wait for error message
    page.wait_for_selector("text=Incorrect password")

    # Take screenshot of error state
    page.screenshot(path="verification/4_error_state.png")
    print("Screenshot 4: Error State captured.")

    # 9. Enter correct password
    print("Entering correct password...")
    page.fill("input[placeholder='Enter Password']", "testpassword123")
    page.click("button:has-text('Unlock')")

    # 10. Verify unlocked again
    page.wait_for_selector("text=Pathway Ledger")
    print("Successfully unlocked again.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
