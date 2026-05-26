// @ts-check
import { test, expect } from '@playwright/test';

test.describe('홈페이지 테스트', () => {
  test('기본 레이아웃과 컴포넌트가 렌더링되는지 확인', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1:has-text("Contoso 아웃도어 소셜")')).toBeVisible();
    
    await expect(page.locator('h2:has-text("새 포스트 작성")')).toBeVisible();
    
    await expect(page.locator('h2:has-text("최근 포스트")')).toBeVisible();
    
    await expect(page.locator('.bg-white.rounded-lg.shadow-md.overflow-hidden')).toHaveCount(4);
    
    await expect(page.locator('text=Contoso 아웃도어')).toBeVisible();
  });

  test('사용자 이름 입력이 작동하는지 확인', async ({ page }) => {
    await page.goto('/');
    
    const testUserName = 'playwright_test_user';
    
    await page.fill('#userName', testUserName);
    
    await page.click('#content');
    
    await expect(page.locator('#userName')).toHaveValue(testUserName);
  });

  test('포스트 목록 아이템들이 올바르게 표시되는지 확인', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('.bg-white.rounded-lg.shadow-md.overflow-hidden');

    const firstPostContent = await page.locator('.bg-white.rounded-lg.shadow-md.overflow-hidden p.text-gray-800').first().textContent();
    
    expect(firstPostContent).toContain('새로운 트레일 러닝화');
    
    await expect(page.locator('svg[viewBox="0 0 24 24"][stroke="currentColor"]').first()).toBeVisible();
  });
});