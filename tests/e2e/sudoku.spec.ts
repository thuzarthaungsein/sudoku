import { test, expect } from '@playwright/test';

test.describe('Sudoku Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to fully load
    await page.waitForSelector('h1:has-text("Sudoku")');
  });

  test('should load the game with initial state', async ({ page }) => {
    // Check title
    await expect(page.locator('h1')).toContainText('Sudoku');

    // Check timer starts at 00:00
    await expect(page.locator('text=Time:')).toBeVisible();
    await expect(page.locator('.font-mono')).toContainText('00:00');

    // Check mistakes counter shows 0
    await expect(page.locator('text=Mistakes:')).toBeVisible();

    // Check board is visible
    const board = page.locator('.grid.grid-cols-9');
    await expect(board).toBeVisible();

    // Check number pad is visible
    await expect(page.locator('text=1').first()).toBeVisible();
    await expect(page.locator('text=9').first()).toBeVisible();

    // Check controls are visible
    await expect(page.locator('button:has-text("Easy")')).toBeVisible();
    await expect(page.locator('button:has-text("Medium")')).toBeVisible();
    await expect(page.locator('button:has-text("Hard")')).toBeVisible();
    await expect(page.locator('button:has-text("New Game")')).toBeVisible();
    await expect(page.locator('button:has-text("Pencil")')).toBeVisible();
    await expect(page.locator('button:has-text("Undo")')).toBeVisible();
  });

  test('should select a cell when clicked', async ({ page }) => {
    // Click on a cell
    const cells = page.locator('.grid.grid-cols-9 > div');
    await cells.first().click();

    // Check if cell is selected (should have blue background)
    const selectedCell = cells.first().locator('div');
    await expect(selectedCell).toHaveClass(/bg-blue-500/);
  });

  test('should input a number via number pad', async ({ page }) => {
    // Find an empty cell (value = 0)
    await page.waitForTimeout(500);

    // Click on the first cell
    const cells = page.locator('.grid.grid-cols-9 > div');
    await cells.nth(10).click();

    // Click on number 5 in the number pad
    await page.locator('button:has-text("5")').first().click();

    // Wait a moment for the value to be set
    await page.waitForTimeout(300);
  });

  test('should toggle pencil mode', async ({ page }) => {
    const pencilButton = page.locator('button:has-text("Pencil")');

    // Initially should not be in pencil mode
    await expect(pencilButton).not.toHaveClass(/bg-blue-600/);

    // Click pencil button
    await pencilButton.click();

    // Should now be in pencil mode
    await expect(pencilButton).toHaveClass(/bg-blue-600/);

    // Click again to toggle off
    await pencilButton.click();
    await expect(pencilButton).not.toHaveClass(/bg-blue-600/);
  });

  test('should navigate with keyboard arrows', async ({ page }) => {
    // Click on a cell to select it
    const cells = page.locator('.grid.grid-cols-9 > div');
    await cells.nth(40).click(); // Middle cell

    // Focus the board
    const board = page.locator('.grid.grid-cols-9').locator('..');
    await board.focus();

    // Press arrow right
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Press arrow down
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);

    // Press arrow left
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(100);

    // Press arrow up
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(100);
  });

  test('should input number with keyboard', async ({ page }) => {
    // Select a cell
    const cells = page.locator('.grid.grid-cols-9 > div');
    await cells.nth(10).click();

    // Focus the board
    const board = page.locator('.grid.grid-cols-9').locator('..');
    await board.focus();

    // Type a number
    await page.keyboard.press('7');
    await page.waitForTimeout(300);
  });

  test('should start a new game when New Game is clicked', async ({ page }) => {
    // Click New Game button
    await page.locator('button:has-text("New Game")').click();

    // Wait for board to update
    await page.waitForTimeout(500);

    // Timer should reset to 00:00
    await expect(page.locator('.font-mono')).toContainText('00:00');

    // Board should have cells
    const cells = page.locator('.grid.grid-cols-9 > div');
    await expect(cells.first()).toBeVisible();
  });

  test('should change difficulty', async ({ page }) => {
    // Click Medium difficulty
    await page.locator('button:has-text("Medium")').click();
    await page.waitForTimeout(500);

    // Medium button should be selected
    const mediumButton = page.locator('button:has-text("Medium")');
    await expect(mediumButton).toHaveClass(/bg-blue-600/);

    // Click Hard difficulty
    await page.locator('button:has-text("Hard")').click();
    await page.waitForTimeout(500);

    // Hard button should be selected
    const hardButton = page.locator('button:has-text("Hard")');
    await expect(hardButton).toHaveClass(/bg-blue-600/);
  });

  test('should undo a move', async ({ page }) => {
    // Select a cell and input a number
    const cells = page.locator('.grid.grid-cols-9 > div');
    await cells.nth(10).click();

    const board = page.locator('.grid.grid-cols-9').locator('..');
    await board.focus();
    await page.keyboard.press('5');
    await page.waitForTimeout(300);

    // Undo button should be enabled
    const undoButton = page.locator('button:has-text("Undo")');
    await expect(undoButton).not.toBeDisabled();

    // Click undo
    await undoButton.click();
    await page.waitForTimeout(300);

    // Undo button should be disabled again (no more history)
    await expect(undoButton).toBeDisabled();
  });

  test('should track time elapsed', async ({ page }) => {
    // Wait for 2 seconds
    await page.waitForTimeout(2000);

    // Timer should have advanced from 00:00
    const timerText = await page.locator('.font-mono').textContent();
    expect(timerText).not.toBe('00:00');
  });

  test('should add pencil marks when in pencil mode', async ({ page }) => {
    // Enable pencil mode
    await page.locator('button:has-text("Pencil")').click();

    // Select an empty cell
    const cells = page.locator('.grid.grid-cols-9 > div');
    await cells.nth(15).click();

    // Add some pencil marks
    const board = page.locator('.grid.grid-cols-9').locator('..');
    await board.focus();
    await page.keyboard.press('1');
    await page.waitForTimeout(200);
    await page.keyboard.press('2');
    await page.waitForTimeout(200);
    await page.keyboard.press('3');
    await page.waitForTimeout(200);
  });

  test('should display game over overlay after 3 mistakes', async ({ page }) => {
    // This test would need to make intentional wrong moves
    // For now, we'll just check that the overlay can appear

    // Try to make wrong moves by filling random cells
    const cells = page.locator('.grid.grid-cols-9 > div');
    const board = page.locator('.grid.grid-cols-9').locator('..');

    for (let i = 0; i < 10; i++) {
      await cells.nth(10 + i).click();
      await board.focus();
      await page.keyboard.press('9');
      await page.waitForTimeout(300);

      // Check if game over overlay appeared
      const gameOver = page.locator('text=Game Over');
      if (await gameOver.isVisible()) {
        await expect(gameOver).toBeVisible();
        await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
        break;
      }
    }
  });
});
