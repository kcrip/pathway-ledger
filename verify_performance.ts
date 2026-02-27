import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the app
    console.log('Navigating to app...');
    await page.goto('http://localhost:9002');

    // Wait for the main content to load
    await page.waitForSelector('text=Pathway Ledger');
    console.log('App loaded.');

    // Click "Enter 5th Step Mode"
    console.log('Entering 5th Step Mode...');
    await page.click('text=Enter 5th Step Mode');

    // Wait for the 5th Step Viewer to appear
    await page.waitForSelector('text=5th Step Interactive Session');
    console.log('5th Step Mode loaded.');

    // Type into the notes field to trigger updates
    console.log('Typing into notes...');
    await page.fill('textarea[placeholder*="Write down takeaways"]', 'Test note for performance verification.');

    // Take a screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'verification.png' });

    console.log('Verification complete.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
