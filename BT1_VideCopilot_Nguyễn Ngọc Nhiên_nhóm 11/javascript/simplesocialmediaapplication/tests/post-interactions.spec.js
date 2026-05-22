// @ts-check
import { test, expect } from '@playwright/test';

test.describe('포스트 상호작용 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    await page.fill('#userName', 'playwright_tester');
  });

  test('새 포스트 작성하기', async ({ page }) => {

    const testContent = '이것은 Playwright를 사용한 테스트 포스트입니다. ' + Date.now();
    const testImage = 'https://images.unsplash.com/photo-1512850183-6d7990f42385';
    
    await page.fill('#content', testContent);
    await page.fill('#imageUrl', testImage);
    
    await page.click('button:has-text("게시하기")');
    
    await page.waitForSelector(`.bg-white.rounded-lg.shadow-md.overflow-hidden p.text-gray-800:has-text("${testContent}")`);
    
    const postWithImage = page.locator(`.bg-white.rounded-lg.shadow-md.overflow-hidden img[src="${testImage}"]`);
    await expect(postWithImage).toBeVisible();
    
    await expect(page.locator(`.bg-white.rounded-lg.shadow-md.overflow-hidden >> text=playwright_tester`).first()).toBeVisible();
  });

  test('포스트에 좋아요 누르기', async ({ page }) => {

    const firstPost = page.locator('.bg-white.rounded-lg.shadow-md.overflow-hidden').first();
    

    const likeButton = firstPost.locator('button.flex.items-center.space-x-1').first();
    const initialLikeCount = await likeButton.textContent();
    // const initialCount = parseInt(initialLikeCount.trim()) || 0;
    
    await likeButton.click();
    
    await page.waitForTimeout(500); 
    
    await expect(likeButton).toHaveClass(/bg-blue-600/);
  });

  test('포스트 상세 페이지 열기 및 댓글 작성', async ({ page }) => {

    await page.click('.bg-white.rounded-lg.shadow-md.overflow-hidden');
    
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).toBeVisible();
    
    await expect(page.locator('h3:has-text("댓글")')).toBeVisible();
    
    const testComment = '이것은 테스트 댓글입니다. ' + Date.now();
    await page.fill('textarea[placeholder="댓글을 작성하세요..."]', testComment);
    
    await page.click('button:has-text("댓글 달기")');
    
    await page.waitForSelector(`.bg-gray-50:has-text("${testComment}")`);
    
    await expect(page.locator('.bg-gray-50 .font-medium:has-text("playwright_tester")')).toBeVisible();
    
    await page.click('button:has-text("닫기")');
    
    await expect(page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).not.toBeVisible();
  });

  test('포스트 삭제하기', async ({ page }) => {

    const testContent = '삭제될 테스트 포스트입니다. ' + Date.now();
    await page.fill('#content', testContent);
    await page.click('button:has-text("게시하기")');
    
    await page.waitForSelector(`.bg-white.rounded-lg.shadow-md.overflow-hidden p.text-gray-800:has-text("${testContent}")`);
    
    const initialPostCount = await page.locator('.bg-white.rounded-lg.shadow-md.overflow-hidden').count();
    
    await page.click('.bg-white.rounded-lg.shadow-md.overflow-hidden button:has-text("삭제")', { force: true });
    
    page.on('dialog', dialog => dialog.accept());
    
    await expect(page.locator('.bg-white.rounded-lg.shadow-md.overflow-hidden')).toHaveCount(initialPostCount - 1);
    
    await expect(page.locator(`.bg-white.rounded-lg.shadow-md.overflow-hidden p.text-gray-800:has-text("${testContent}")`)).not.toBeVisible();
  });
});