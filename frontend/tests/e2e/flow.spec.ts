import { test, expect } from '@playwright/test';

test('Full Flow (Student)', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

    await page.goto('http://localhost:5173/register', { timeout: 20000 });

    const id = Math.floor(1000 + Math.random() * 9000).toString();
    console.log('Using test ID:', id);

    await page.locator('input[name="name"]').fill('E2E Student');
    await page.locator('input[name="email"]').fill(`e.student${id}@vitstudent.ac.in`);
    await page.locator('input[name="password"]').fill('password123');

    await page.getByLabel('Day').selectOption('01');
    await page.getByLabel('Month').selectOption('01');
    await page.getByLabel('Year').selectOption('2000');

    await page.locator('input[name="register_number"]').fill(`22BCE${id}`);

    await page.getByRole('button', { name: /^Register$/ }).click();

    await expect(page).toHaveURL(/login/, { timeout: 20000 });
    console.log('Successfully navigated to Login');

    await page.waitForTimeout(1000);

    await page.locator('input[name="identity"]').fill(`22BCE${id}`);
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });
    console.log('Successfully reached Dashboard');

    // Go to Wallet
    await page.click('text=Wallet');
    await expect(page).toHaveURL(/wallet/);

    // Check initial balance
    await expect(page.getByRole('heading', { name: /₹0\.00/ })).toBeVisible({ timeout: 15000 });

    // Add Funds
    await page.getByPlaceholder('0.00').fill('500');
    await page.getByRole('button', { name: 'Add to Wallet' }).click();

    // Verify Balance update in the heading specifically
    await expect(page.getByRole('heading', { name: /₹500\.00/ })).toBeVisible({ timeout: 15000 });
    console.log('Wallet test passed');
});
