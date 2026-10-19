import { expect, test } from '@playwright/test';

test('example paths, comparison, custom edits, reset and no inference traffic', async ({ page }) => {
  const errors: string[] = [];
  const remote: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/\/jobs|runpod|huggingface/.test(request.url())) remote.push(request.url()); });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Sieve & Sage.' })).toBeVisible();
  await page.getByRole('button', { name: 'Run example', exact: true }).click();
  await expect(page.locator('.answer-box h3')).toHaveText('1986');
  await page.getByRole('button', { name: 'Insufficient evidence', exact: true }).click();
  await expect(page.locator('.answer-box h3')).toHaveText('Evidence before answers.');
  await page.getByRole('button', { name: 'Run example', exact: true }).click();
  await expect(page.locator('.answer-box h3')).toHaveText('Abstain');
  await expect(page.locator('.telemetry')).toContainText('1 (simulated)');
  await page.getByRole('button', { name: 'Distracting evidence', exact: true }).click();
  await page.getByRole('button', { name: 'Run example', exact: true }).click();
  await expect(page.getByText('Skipped · no Sage call on this path')).toBeVisible();
  await expect(page.locator('.comparison')).toHaveCount(0);
  await page.getByRole('button', { name: 'Compare paths', exact: true }).click();
  await expect(page.locator('.comparison')).toContainText('0 Sage calls');
  await expect(page.locator('.comparison')).toContainText('1 Sage call');
  await page.getByLabel('Document 1 text', { exact: true }).fill('A changed document.');
  await expect(page.getByRole('button', { name: 'Run example', exact: true })).toBeDisabled();
  await expect(page.locator('.answer-box h3')).toHaveText('Evidence before answers.');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('button', { name: 'Add document', exact: true }).click();
  await expect(page.getByLabel('Document 3 text', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove document 3', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Run example', exact: true })).toBeEnabled();
  expect(remote).toEqual([]);
  expect(errors).toEqual([]);
});

test('dataset controls, citation, paper link and responsive layout', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Read the paper' })).toHaveAttribute('href', 'https://arxiv.org/abs/2609.35794');
  await page.getByLabel('DATASET', { exact: true }).selectOption('BioASQ');
  await expect(page.locator('.bar-row.ours strong')).toHaveText('0.428');
  await page.getByRole('button', { name: 'Macro-F1', exact: true }).click();
  await expect(page.locator('.bar-row.ours strong')).toHaveText('0.552');
  await page.getByRole('button', { name: 'Latency (ms)', exact: true }).click();
  await expect(page.locator('.bar-row.ours strong')).toHaveText('312.2');
  await page.getByText('View exact values for BioASQ').click();
  await expect(page.getByRole('table')).toContainText('312.165');
  await page.getByRole('button', { name: 'Copy citation', exact: true }).click();
  await expect(page.locator('.copy-status')).not.toBeEmpty();
  await expect(page.locator('.citation-box pre')).toContainText('2609.35794');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (await page.getByRole('button', { name: 'Toggle navigation' }).isVisible()) {
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Overview', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Toggle navigation' })).toHaveAttribute('aria-expanded', 'false');
  }
});
