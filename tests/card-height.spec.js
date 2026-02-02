import { test, expect } from '@playwright/test';

test.describe('Card Height Investigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('measure expanded card height vs content height', async ({ page }) => {
    // Wait for cards to load
    await page.waitForSelector('.group', { timeout: 5000 });
    
    // Get first card
    const firstCard = page.locator('.group').first();
    await expect(firstCard).toBeVisible();

    console.log('\n=== Initial Card State ===');
    const initialBox = await firstCard.boundingBox();
    console.log('Initial card dimensions:', initialBox);

    // Click to expand
    await firstCard.click();
    
    // Wait for each animation stage
    console.log('\n=== Animation Stages ===');
    
    // Stage 1: expanding-width
    await page.waitForSelector('.expanding-width', { timeout: 2000 });
    let box = await firstCard.boundingBox();
    console.log('After expanding-width:', box);

    // Stage 2: expanding-height
    await page.waitForSelector('.expanding-height', { timeout: 2000 });
    box = await firstCard.boundingBox();
    console.log('After expanding-height:', box);

    // Stage 3: flipped
    await page.waitForSelector('.flipped', { timeout: 2000 });
    box = await firstCard.boundingBox();
    console.log('After flipped:', box);

    // Stage 4: full-expanded
    await page.waitForSelector('.full-expanded', { timeout: 2000 });
    box = await firstCard.boundingBox();
    console.log('After full-expanded:', box);

    // Stage 5: content-visible
    await page.waitForSelector('.content-visible', { timeout: 2000 });
    box = await firstCard.boundingBox();
    console.log('After content-visible (final):', box);

    console.log('\n=== Content Measurements ===');
    
    // Measure the card-back element
    const cardBack = firstCard.locator('.card-back');
    const cardBackBox = await cardBack.boundingBox();
    console.log('card-back dimensions:', cardBackBox);

    // Measure the inner container (#containerId)
    const innerContainer = cardBack.locator('[id]').first();
    const innerBox = await innerContainer.boundingBox();
    console.log('Inner container dimensions:', innerBox);

    // Measure the markdown-body
    const markdownBody = cardBack.locator('.markdown-body');
    const markdownBox = await markdownBody.boundingBox();
    console.log('markdown-body dimensions:', markdownBox);

    // Get scroll dimensions
    const scrollData = await cardBack.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      scrollTop: el.scrollTop,
      clientHeight: el.clientHeight,
      offsetHeight: el.offsetHeight,
      isOverflowing: el.scrollHeight > el.clientHeight,
    }));
    console.log('Scroll data:', scrollData);

    // Get computed styles
    const cardStyles = await firstCard.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        height: styles.height,
        maxHeight: styles.maxHeight,
        minHeight: styles.minHeight,
        position: styles.position,
        top: styles.top,
        left: styles.left,
        transform: styles.transform,
      };
    });
    console.log('Card computed styles:', cardStyles);

    const backStyles = await cardBack.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        height: styles.height,
        maxHeight: styles.maxHeight,
        overflow: styles.overflow,
        overflowY: styles.overflowY,
        padding: styles.padding,
      };
    });
    console.log('card-back computed styles:', backStyles);

    // Get CSS custom properties
    const customProps = await firstCard.evaluate((el) => ({
      '--card-original-height': el.style.getPropertyValue('--card-original-height'),
      '--card-original-width': el.style.getPropertyValue('--card-original-width'),
      '--card-content-height': el.style.getPropertyValue('--card-content-height'),
      '--card-original-top': el.style.getPropertyValue('--card-original-top'),
      '--card-original-left': el.style.getPropertyValue('--card-original-left'),
    }));
    console.log('CSS custom properties:', customProps);

    // Check if content is cut off
    const isCutOff = scrollData.scrollHeight > scrollData.clientHeight;
    console.log('\n=== Analysis ===');
    console.log('Content is cut off:', isCutOff);
    console.log('Hidden content height:', scrollData.scrollHeight - scrollData.clientHeight, 'px');

    // Take screenshot for visual inspection
    await page.screenshot({ path: 'tests/screenshots/expanded-card.png', fullPage: true });
    
    // Try scrolling to see if content is there
    await cardBack.evaluate((el) => el.scrollTop = el.scrollHeight);
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/screenshots/expanded-card-scrolled.png', fullPage: true });

    console.log('\nScreenshots saved to tests/screenshots/');
  });

  test('compare multiple cards content heights', async ({ page }) => {
    await page.waitForSelector('.group', { timeout: 5000 });
    
    const cards = await page.locator('.group').all();
    console.log(`\n=== Found ${cards.length} cards ===\n`);

    for (let i = 0; i < Math.min(cards.length, 3); i++) {
      const card = cards[i];
      const title = await card.locator('.card-front h2').textContent();
      
      console.log(`\nTesting card ${i + 1}: ${title}`);
      
      // Click to expand
      await card.click();
      
      // Wait for full expansion
      await page.waitForSelector('.content-visible', { timeout: 5000 });
      
      const cardBack = card.locator('.card-back');
      const scrollData = await cardBack.evaluate((el) => ({
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        isOverflowing: el.scrollHeight > el.clientHeight,
        hiddenHeight: el.scrollHeight - el.clientHeight,
      }));
      
      console.log(`  Scroll height: ${scrollData.scrollHeight}px`);
      console.log(`  Client height: ${scrollData.clientHeight}px`);
      console.log(`  Is overflowing: ${scrollData.isOverflowing}`);
      console.log(`  Hidden height: ${scrollData.hiddenHeight}px`);
      
      // Close the card
      const closeBtn = card.locator('.fullscreen-close-btn');
      await closeBtn.click();
      await page.waitForTimeout(3000); // Wait for close animation
    }
  });

  test('check viewport and container dimensions', async ({ page }) => {
    const viewport = page.viewportSize();
    console.log('\n=== Viewport ===');
    console.log('Viewport dimensions:', viewport);

    const container = page.locator('#cards-container');
    const containerBox = await container.boundingBox();
    console.log('\n=== Container ===');
    console.log('Container dimensions:', containerBox);

    const containerStyles = await container.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        position: styles.position,
        paddingTop: styles.paddingTop,
        minHeight: styles.minHeight,
      };
    });
    console.log('Container computed styles:', containerStyles);
  });
});
