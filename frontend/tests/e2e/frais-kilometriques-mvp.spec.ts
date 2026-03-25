import { expect, test } from '@playwright/test';

test('create simulation and save domicile', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Hello world' })).toBeVisible();
  await page.getByRole('link', { name: 'Ouvrir le bundle initial' }).click();

  await expect(page.getByRole('heading', { name: 'Frais kilometriques' })).toBeVisible();
  await page.getByRole('button', { name: 'Creer une simulation' }).click();

  await expect(page.getByText('Simulation creee')).toBeVisible();
  await page.getByRole('button', { name: 'Continuer vers le domicile' }).click();

  await expect(page.getByRole('heading', { name: 'Domicile' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Libelle' }).fill('Residence principale');
  await page.getByRole('textbox', { name: 'Adresse ligne 1' }).fill('10 rue de la Republique');
  await page.getByRole('textbox', { name: 'Code postal' }).fill('75001');
  await page.getByRole('textbox', { name: 'Ville' }).fill('Paris');
  await page.getByRole('button', { name: 'Enregistrer le domicile' }).click();

  await expect(page.getByText('Domicile enregistre.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continuer vers les sites' })).toBeVisible();
});
