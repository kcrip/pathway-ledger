const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to app...');
    // Increase timeout and wait for load state
    await page.goto('http://localhost:9002', { waitUntil: 'networkidle' });

    // Wait for the main heading
    await page.waitForSelector('text=Pathway Ledger', { timeout: 30000 });
    console.log('App loaded.');

    // Click "Enter 5th Step Mode" button
    console.log('Clicking Enter 5th Step Mode...');
    await page.click('button:has-text("Enter 5th Step Mode")');

    // Wait for the 5th Step Viewer specific element
    await page.waitForSelector('text=5th Step Interactive Session', { timeout: 30000 });
    console.log('5th Step Mode loaded.');

    // Find the textarea for notes and type into it
    console.log('Typing into notes...');
    const textarea = page.locator('textarea[placeholder*="Write down takeaways"]');
    await textarea.waitFor({ state: 'visible' });
    await textarea.fill('Test note for performance verification.');

    // Take a screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'verification.png', fullPage: true });

    console.log('Verification complete. Screenshot saved to verification.png');
  } catch (error) {
    console.error('Error during verification:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
