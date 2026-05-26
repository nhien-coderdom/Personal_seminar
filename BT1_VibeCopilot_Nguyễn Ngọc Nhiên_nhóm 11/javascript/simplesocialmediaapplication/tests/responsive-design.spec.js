// @ts-check
import { test, expect } from '@playwright/test';

test.describe('반응형 디자인 테스트', () => {
  test('데스크탑 뷰에서 사이드바 표시 확인', async ({ page }) => {

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    
    await expect(page.locator('.hidden.lg\\:block.lg\\:w-1\\/4').first()).toBeVisible();
    
    await expect(page.locator('.hidden.lg\\:block.lg\\:w-1\\/4').nth(1)).toBeVisible();
    
    await expect(page.locator('text=최고 품질의 아웃도어 장비')).toBeVisible();
    
    await expect(page.locator('h2:has-text("신제품 소식")')).toBeVisible();
  });
  
  test('모바일 뷰에서 사이드바 숨김 확인', async ({ page }) => {

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await expect(page.locator('.hidden.lg\\:block.lg\\:w-1\\/4').first()).not.toBeVisible();
    await expect(page.locator('.hidden.lg\\:block.lg\\:w-1\\/4').nth(1)).not.toBeVisible();
    
    await expect(page.locator('h1:has-text("Contoso 아웃도어 소셜")')).toBeVisible();
    await expect(page.locator('h2:has-text("새 포스트 작성")')).toBeVisible();
    await expect(page.locator('h2:has-text("최근 포스트")')).toBeVisible();
  });

  test('태블릿 크기에서 UI 요소 확인', async ({ page }) => {

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('.hidden.lg\\:block.lg\\:w-1\\/4')).not.toBeVisible();
    
    const mainContent = page.locator('.flex-1');
    
    await expect(page.locator('h2:has-text("새 포스트 작성")')).toBeVisible();
    await expect(page.locator('.bg-white.rounded-lg.shadow-md.overflow-hidden')).toBeVisible();
  });
  
  test('포스트 상세 모달이 모바일에서 제대로 표시되는지 확인', async ({ page }) => {

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.click('.bg-white.rounded-lg.shadow-md.overflow-hidden');
    
    const modal = page.locator('.bg-white.rounded-lg.shadow-xl');
    await expect(modal).toBeVisible();
    
    await expect(page.locator('.text-2xl.font-bold')).toBeVisible(); 
    await expect(page.locator('h3:has-text("댓글")')).toBeVisible(); 
    
    const boundingBox = await modal.boundingBox();
    // expect(boundingBox.width).toBeLessThanOrEqual(375);
  });
});