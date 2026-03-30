import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { apiFetch } from '../../core/api/api-fetch';

type SimulationResponse = {
  id: number;
  annee_fiscale: number;
  date_debut_periode: string;
  date_fin_periode: string;
  statut: string;
  has_domicile: boolean;
  sites_count: number;
  vehicules_count: number;
  jours_count: number;
  created_at: string;
  updated_at: string;
};

@Component({
  selector: 'app-frais-kilometriques-intro',
  standalone: true,
  imports: [DatePipe],
  template: `
    <main class="page">
      <section class="hero">
        <p class="eyebrow">Premier slice fonctionnel</p>
        <h1>Deplacements & repas</h1>
        <p class="lead">
          Cette premiere etape cree une simulation en brouillon pour suivre tes trajets, tes jours sur site et tes frais de repas.
        </p>

        <div class="actions">
          <button type="button" (click)="createSimulation()" [disabled]="loading()">
            {{ loading() ? 'Creation en cours...' : 'Creer une simulation' }}
          </button>
          <button type="button" class="ghost" (click)="loadSimulations()" [disabled]="loading()">
            Recharger les brouillons
          </button>
          <button
            type="button"
            class="danger"
            (click)="deleteSelectedSimulations()"
            [disabled]="loading() || !selectedSimulationIds().length"
          >
            Supprimer la selection
          </button>
        </div>

        @if (errorMessage()) {
          <p class="error">{{ errorMessage() }}</p>
        }

        @if (createdSimulation()) {
          <article class="notice success">
            <p class="notice-title">Simulation creee</p>
            <p>
              Brouillon #{{ createdSimulation()!.id }} cree pour l'annee fiscale
              {{ createdSimulation()!.annee_fiscale }}.
            </p>
            <button type="button" class="next" (click)="goToDomicile()">Continuer vers le domicile</button>
          </article>
        }
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">API</p>
            <h2>Simulations existantes</h2>
          </div>
          <span>{{ simulations().length }} element(s)</span>
        </div>

        @if (!simulations().length) {
          <p class="empty">Aucune simulation pour le moment.</p>
        }

        @if (simulations().length) {
          <div class="list">
            @for (simulation of simulations(); track simulation.id) {
              <article class="card">
                <label class="selection-row">
                  <input
                    type="checkbox"
                    [checked]="selectedSimulationIds().includes(simulation.id)"
                    (change)="toggleSimulationSelection(simulation.id, $event)"
                  />
                  <span>Selectionner ce brouillon</span>
                </label>
                <p class="card-title">Simulation #{{ simulation.id }}</p>
                <p>Annee fiscale : {{ simulation.annee_fiscale }}</p>
                <p>Statut : {{ simulation.statut }}</p>
                <p>Periode : {{ simulation.date_debut_periode }} -> {{ simulation.date_fin_periode }}</p>
                <p>Domicile : {{ simulation.has_domicile ? 'renseigne' : 'a renseigner' }}</p>
                <p>Sites de travail : {{ simulation.sites_count }}</p>
                <p>Vehicules : {{ simulation.vehicules_count }}</p>
                <p>Jours declares : {{ simulation.jours_count }}</p>
                <p>Creee le : {{ simulation.created_at | date:'medium' }}</p>
                <div class="card-actions">
                  <button type="button" class="ghost" (click)="resumeSimulation(simulation)">
                    {{ getResumeLabel(simulation) }}
                  </button>
                  <button type="button" class="danger" (click)="deleteSimulation(simulation.id)">
                    Supprimer
                  </button>
                </div>
              </article>
            }
          </div>
        }
      </section>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        padding: 32px;
        display: grid;
        gap: 24px;
        background:
          radial-gradient(circle at top left, rgba(88, 129, 163, 0.14), transparent 28%),
          linear-gradient(180deg, #edf4f8 0%, #fbfdfe 100%);
      }

      .hero,
      .panel {
        width: min(920px, 100%);
        margin: 0 auto;
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(22, 50, 74, 0.1);
        box-shadow: 0 22px 48px rgba(22, 50, 74, 0.08);
      }

      .eyebrow {
        margin: 0 0 10px;
        color: #537a96;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.78rem;
      }

      h1,
      h2 {
        margin: 0;
        color: #16324a;
      }

      h1 {
        font-size: clamp(2.25rem, 6vw, 4rem);
      }

      h2 {
        font-size: 1.6rem;
      }

      .lead,
      .panel span,
      .card p,
      .empty {
        color: #35546c;
      }

      .lead {
        margin: 16px 0 0;
        max-width: 58ch;
        font-size: 1.05rem;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      button {
        min-height: 46px;
        padding: 0 18px;
        border: 0;
        border-radius: 999px;
        background: #16324a;
        color: #f5fbff;
        font-weight: 600;
        cursor: pointer;
      }

      button.ghost {
        background: #e6eef3;
        color: #16324a;
      }

      button.danger {
        background: #a12f2f;
      }

      button:disabled {
        opacity: 0.7;
        cursor: wait;
      }

      .error {
        margin: 18px 0 0;
        color: #a12f2f;
        font-weight: 600;
      }

      .notice {
        margin-top: 20px;
        padding: 18px 20px;
        border-radius: 18px;
      }

      .success {
        background: #edf7f2;
        border: 1px solid #bfddce;
      }

      .notice-title {
        margin: 0 0 6px;
        font-weight: 700;
        color: #1d5b45;
      }

      .next {
        margin-top: 14px;
        background: #1d5b45;
      }

      .panel-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: end;
        margin-bottom: 20px;
      }

      .list {
        display: grid;
        gap: 14px;
      }

      .card {
        padding: 18px 20px;
        border-radius: 18px;
        background: #f7fafc;
        border: 1px solid rgba(22, 50, 74, 0.08);
      }

      .selection-row {
        display: flex;
        gap: 10px;
        align-items: center;
        margin-bottom: 12px;
        color: #537a96;
        font-size: 0.92rem;
      }

      .card-title {
        margin: 0 0 10px;
        font-weight: 700;
        color: #16324a;
      }

      .card p {
        margin: 0 0 6px;
      }

      .card-actions {
        margin-top: 14px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      @media (max-width: 720px) {
        .page {
          padding: 18px;
        }

        .hero,
        .panel {
          padding: 24px;
        }

        .panel-head {
          align-items: start;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class FraisKilometriquesIntroComponent {
  private readonly router = inject(Router);

  protected readonly createdSimulation = signal<SimulationResponse | null>(null);
  protected readonly simulations = signal<SimulationResponse[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly selectedSimulationIds = signal<number[]>([]);

  constructor() {
    void this.loadSimulations();
  }

  protected async createSimulation(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const response = await apiFetch('/api/bundles/frais-kilometriques/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Impossible de creer la simulation.');
      }

      const simulation = (await response.json()) as SimulationResponse;
      this.createdSimulation.set(simulation);
      this.simulations.update((items) => [simulation, ...items]);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async loadSimulations(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const response = await apiFetch('/api/bundles/frais-kilometriques/simulations');
      if (!response.ok) {
        throw new Error('Impossible de charger les simulations.');
      }

      const payload = (await response.json()) as { items: SimulationResponse[] };
      this.simulations.set(payload.items);
      this.selectedSimulationIds.set([]);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async goToDomicile(): Promise<void> {
    const simulation = this.createdSimulation();
    if (!simulation) {
      return;
    }

    await this.resumeSimulation(simulation);
  }

  protected toggleSimulationSelection(simulationId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedSimulationIds.update((items) => [...items, simulationId]);
      return;
    }

    this.selectedSimulationIds.update((items) => items.filter((id) => id !== simulationId));
  }

  protected async deleteSimulation(simulationId: number): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const response = await apiFetch(`/api/bundles/frais-kilometriques/simulations/${simulationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Impossible de supprimer le brouillon.');
      }

      this.simulations.update((items) => items.filter((simulation) => simulation.id !== simulationId));
      this.selectedSimulationIds.update((items) => items.filter((id) => id !== simulationId));
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async deleteSelectedSimulations(): Promise<void> {
    const ids = this.selectedSimulationIds();
    if (!ids.length) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const response = await apiFetch('/api/bundles/frais-kilometriques/simulations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ simulation_ids: ids }),
      });

      if (!response.ok) {
        throw new Error('Impossible de supprimer la selection.');
      }

      this.simulations.update((items) => items.filter((simulation) => !ids.includes(simulation.id)));
      this.selectedSimulationIds.set([]);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.loading.set(false);
    }
  }

  protected getResumeLabel(simulation: SimulationResponse): string {
    if (!simulation.has_domicile) {
      return 'Reprendre au domicile';
    }

    if (simulation.sites_count === 0) {
      return 'Reprendre aux sites';
    }

    if (simulation.vehicules_count === 0) {
      return 'Reprendre au vehicule';
    }

    if (simulation.jours_count === 0) {
      return 'Reprendre au calendrier';
    }

    return 'Reprendre le brouillon';
  }

  protected async resumeSimulation(simulation: SimulationResponse): Promise<void> {
    let nextPath: (string | number)[];

    if (!simulation.has_domicile) {
      nextPath = ['/bundles/frais-kilometriques', simulation.id, 'domicile'];
    } else if (simulation.sites_count === 0) {
      nextPath = ['/bundles/frais-kilometriques', simulation.id, 'sites'];
    } else if (simulation.vehicules_count === 0) {
      nextPath = ['/bundles/frais-kilometriques', simulation.id, 'vehicule'];
    } else {
      nextPath = ['/bundles/frais-kilometriques', simulation.id, 'calendrier'];
    }

    await this.router.navigate(nextPath);
  }
}
