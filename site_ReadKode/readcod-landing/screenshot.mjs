import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Wait for animations to settle
  await page.waitForTimeout(2000);

  console.log('Taking screenshot...');

  // Full page screenshot
  await page.screenshot({
    path: 'screenshot-desktop.png',
    fullPage: true
  });

  // Screenshot of Why section specifically
  await page.evaluate(() => {
    const section = document.getElementById('why');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: 'screenshot-why-section.png',
    fullPage: false
  });

  console.log('Screenshot saved as screenshot-desktop.png');
  await browser.close();
})();
