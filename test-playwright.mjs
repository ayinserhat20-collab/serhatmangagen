import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // Step 1: Fill out personal info
  await page.fill('input[name="customer.fullName"]', 'Test User');
  await page.fill('input[name="customer.phone"]', '05555555555');
  await page.fill('input[name="customer.email"]', 'test@example.com');
  await page.fill('textarea[name="customer.address"]', 'Some long test address that satisfies minimum length');
  
  // Click Next
  await page.click('button:has-text("Devam Et")');
  await page.waitForTimeout(500);
  
  const step2Visible = await page.isVisible('h2:has-text("Hikaye Bilgileri")');
  console.log("Step 1 -> 2 Success:", step2Visible);

  await browser.close();
})();
