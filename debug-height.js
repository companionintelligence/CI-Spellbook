import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to page...');
    await page.goto('http://localhost:5503');
    await page.waitForLoadState('networkidle');
    
    console.log('Waiting for cards...');
    await page.waitForSelector('.group', { timeout: 5000 });
    
    const firstCard = page.locator('.group').first();
    const title = await firstCard.locator('.card-front h2').textContent();
    console.log(`\nTesting card: ${title}`);
    
    // Get initial state
    console.log('\n=== Before Expansion ===');
    let box = await firstCard.boundingBox();
    console.log('Card dimensions:', box);
    
    // Click to expand
    console.log('\nClicking card...');
    await firstCard.click();
    
    // Wait for animation stages
    await page.waitForSelector('.expanding-width', { timeout: 2000 });
    console.log('Stage 1: expanding-width');
    
    await page.waitForSelector('.expanding-height', { timeout: 2000 });
    console.log('Stage 2: expanding-height');
    box = await firstCard.boundingBox();
    console.log('  Card dimensions:', box);
    
    await page.waitForSelector('.flipped', { timeout: 2000 });
    console.log('Stage 3: flipped');
    
    await page.waitForSelector('.full-expanded', { timeout: 2000 });
    console.log('Stage 4: full-expanded');
    
    await page.waitForSelector('.content-visible', { timeout: 2000 });
    console.log('Stage 5: content-visible');
    
    console.log('\n=== After Full Expansion ===');
    box = await firstCard.boundingBox();
    console.log('Card dimensions:', box);
    
    // Measure content
    const cardBack = firstCard.locator('.card-back');
    const scrollData = await cardBack.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      offsetHeight: el.offsetHeight,
      isOverflowing: el.scrollHeight > el.clientHeight,
    }));
    
    console.log('\n=== Scroll Analysis ===');
    console.log('scrollHeight:', scrollData.scrollHeight, 'px');
    console.log('clientHeight:', scrollData.clientHeight, 'px');
    console.log('offsetHeight:', scrollData.offsetHeight, 'px');
    console.log('Is overflowing:', scrollData.isOverflowing);
    console.log('Hidden height:', scrollData.scrollHeight - scrollData.clientHeight, 'px');
    
    // Get CSS properties
    const customProps = await firstCard.evaluate((el) => ({
      '--card-content-height': el.style.getPropertyValue('--card-content-height'),
      computedHeight: window.getComputedStyle(el).height,
      computedMaxHeight: window.getComputedStyle(el).maxHeight,
    }));
    
    console.log('\n=== CSS Properties ===');
    console.log('--card-content-height:', customProps['--card-content-height']);
    console.log('computed height:', customProps.computedHeight);
    console.log('computed max-height:', customProps.computedMaxHeight);
    
    // Get back styles
    const backStyles = await cardBack.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        height: styles.height,
        maxHeight: styles.maxHeight,
        overflowY: styles.overflowY,
        padding: styles.padding,
      };
    });
    
    console.log('\n=== card-back Styles ===');
    console.log('height:', backStyles.height);
    console.log('max-height:', backStyles.maxHeight);
    console.log('overflow-y:', backStyles.overflowY);
    console.log('padding:', backStyles.padding);
    
    // Check inner content
    const innerContent = cardBack.locator('.markdown-body');
    const innerBox = await innerContent.boundingBox();
    console.log('\n=== markdown-body ===');
    console.log('Dimensions:', innerBox);
    
    // Diagnostic: Is content actually cut off?
    if (scrollData.isOverflowing) {
      console.log('\n⚠️  ISSUE CONFIRMED: Content is being cut off!');
      console.log(`   ${scrollData.scrollHeight - scrollData.clientHeight}px of content is hidden`);
    } else {
      console.log('\n✓ No overflow detected - content fits');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'debug-expanded-card.png', fullPage: true });
    console.log('\nScreenshot saved: debug-expanded-card.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
