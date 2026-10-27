const { test, expect } = require('@playwright/test');

test('exibe painel ambiental demonstrativo e quatro registros', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Acompanhamento ambiental/ })).toBeVisible();
  await expect(page.locator('#result-count')).toContainText('4 de 4');
  await expect(page.getByText('Análise de processo demonstrativo')).toBeVisible();
  await expect(page.getByText(/dados.*fictícios/i).first()).toBeVisible();
});

test('filtra processos por status', async ({ page }) => {
  await page.goto('/');
  await page.locator('#status-filter').selectOption('Pendente');
  await expect(page.getByText('Verificação de relatório de monitoramento')).toBeVisible();
  await expect(page.getByText('Análise de processo demonstrativo')).toHaveCount(0);
  await expect(page.locator('#result-count')).toContainText('1 de 4');
});

test('busca registros por tema', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Buscar por processo, tema ou responsável...').fill('hídricos');
  await expect(page.getByText('Acompanhamento de qualidade da água')).toBeVisible();
  await expect(page.locator('#result-count')).toContainText('1 de 4');
});

test('adiciona novo registro fictício', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Novo registro/ }).click();
  await page.getByLabel('Processo ou atividade').fill('Registro de teste automatizado');
  await page.getByLabel('Tema ambiental').selectOption('Flora e fauna');
  await page.getByLabel('Responsável fictício').fill('Equipe Fictícia QA');
  await page.getByRole('button', { name: 'Adicionar registro' }).click();
  await expect(page.getByText('Registro de teste automatizado')).toBeVisible();
  await expect(page.locator('#result-count')).toContainText('5 de 5');
});

test('atualiza status de um processo', async ({ page }) => {
  await page.goto('/');
  const row = page.locator('tr[data-record-id="101"]');
  await row.getByRole('button', { name: 'Atualizar status' }).click();
  await expect(row.getByText('Em andamento')).toBeVisible();
});
