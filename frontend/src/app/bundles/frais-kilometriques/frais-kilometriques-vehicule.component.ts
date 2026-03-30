import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { apiFetch } from '../../core/api/api-fetch';

type VehiculeResponse = {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  type_vehicule: string;
  puissance_administrative: number;
  date_achat: string | null;
  date_vente: string | null;
  actif: boolean;
  created_at: string;
  updated_at: string;
};

@Component({
  selector: 'app-frais-kilometriques-vehicule',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="panel">
        <p class="eyebrow">Etape suivante</p>
        <h1>Vehicule</h1>
        <p class="lead">
          Renseigne le vehicule principal utilise pour les trajets professionnels.
        </p>
        <p class="meta">Simulation #{{ simulationId() }}</p>

        <form class="form" (ngSubmit)="addVehicule()">
          <div class="row">
            <label>
              <span>Marque</span>
              <input [(ngModel)]="form.marque" name="marque" placeholder="Peugeot" required />
            </label>

            <label>
              <span>Modele</span>
              <input [(ngModel)]="form.modele" name="modele" placeholder="208" required />
            </label>
          </div>

          <div class="row">
            <label>
              <span>Immatriculation</span>
              <input [(ngModel)]="form.immatriculation" name="immatriculation" placeholder="AB-123-CD" required />
            </label>

            <label>
              <span>Chevaux fiscaux</span>
              <input
                [(ngModel)]="form.puissance_administrative"
                name="puissance_administrative"
                type="number"
                min="1"
                required
              />
            </label>
          </div>

          <div class="row">
            <label>
              <span>Type de vehicule</span>
              <select [(ngModel)]="form.type_vehicule" name="type_vehicule">
                <option value="voiture">Voiture</option>
                <option value="motocyclette">Motocyclette</option>
                <option value="cyclomoteur">Cyclomoteur</option>
                <option value="electrique">Electrique</option>
              </select>
            </label>

            <label>
              <span>Date d'achat</span>
              <input [(ngModel)]="form.date_achat" name="date_achat" type="date" />
            </label>
          </div>

          <label>
            <span>Date de vente</span>
            <input [(ngModel)]="form.date_vente" name="date_vente" type="date" />
          </label>

          @if (errorMessage()) {
            <p class="error">{{ errorMessage() }}</p>
          }

          @if (successMessage()) {
            <p class="success">{{ successMessage() }}</p>
          }

          <div class="actions">
            <a [routerLink]="['/bundles/frais-kilometriques', simulationId(), 'sites']">Retour aux sites</a>
            <div class="cta-group">
              <button type="submit" [disabled]="loading()">
                {{ loading() ? 'Enregistrement...' : 'Enregistrer le vehicule' }}
              </button>
              @if (vehicules().length) {
                <a class="button-link" [routerLink]="['/bundles/frais-kilometriques', simulationId(), 'calendrier']">Continuer vers le calendrier</a>
              }
            </div>
          </div>
        </form>
      </section>

      <section class="panel list-panel">
        <div class="panel-head">
          <h2>Vehicules enregistres</h2>
          <span>{{ vehicules().length }} vehicule(s)</span>
        </div>

        @if (!vehicules().length) {
          <p class="empty">Aucun vehicule enregistre pour le moment.</p>
        }

        @if (vehicules().length) {
          <div class="list">
            @for (vehicule of vehicules(); track vehicule.id) {
              <article class="card">
                <div class="card-head">
                  <p class="card-title">{{ vehicule.marque }} {{ vehicule.modele }}</p>
                  <button type="button" class="danger" (click)="deleteVehicule(vehicule.id)">Supprimer</button>
                </div>
                <p>Immatriculation : {{ vehicule.immatriculation }}</p>
                <p>Type : {{ vehicule.type_vehicule }}</p>
                <p>Chevaux fiscaux : {{ vehicule.puissance_administrative }}</p>
                @if (vehicule.date_achat) {
                  <p>Date d'achat : {{ vehicule.date_achat }}</p>
                }
                @if (vehicule.date_vente) {
                  <p>Date de vente : {{ vehicule.date_vente }}</p>
                }
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
          radial-gradient(circle at top right, rgba(115, 142, 81, 0.12), transparent 28%),
          linear-gradient(180deg, #f3f7f0 0%, #fcfdfb 100%);
      }

      .panel {
        width: min(860px, 100%);
        margin: 0 auto;
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(22, 50, 74, 0.1);
        box-shadow: 0 22px 48px rgba(22, 50, 74, 0.08);
      }

      .eyebrow {
        margin: 0 0 10px;
        color: #6f8756;
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
        font-size: clamp(2rem, 6vw, 3.4rem);
      }

      .lead,
      .meta,
      label span,
      a,
      .empty,
      .panel-head span,
      .card p {
        color: #35546c;
      }

      .lead,
      .meta {
        margin-top: 14px;
      }

      .form {
        display: grid;
        gap: 16px;
        margin-top: 28px;
      }

      label {
        display: grid;
        gap: 8px;
      }

      label span {
        font-size: 0.95rem;
        font-weight: 600;
      }

      input,
      select {
        min-height: 48px;
        padding: 0 14px;
        border-radius: 14px;
        border: 1px solid rgba(22, 50, 74, 0.16);
        background: #fff;
        color: #16324a;
        font: inherit;
      }

      .row {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .actions,
      .panel-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      a {
        text-decoration: none;
        font-weight: 600;
      }

      .cta-group {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: end;
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

      .button-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        padding: 0 18px;
        border-radius: 999px;
        background: #1d5b45;
        color: #f5fbff;
      }

      .error {
        margin: 0;
        color: #a12f2f;
        font-weight: 600;
      }

      .success {
        margin: 0;
        color: #1d5b45;
        font-weight: 600;
      }

      .list-panel {
        padding-top: 28px;
      }

      .list {
        display: grid;
        gap: 14px;
        margin-top: 18px;
      }

      .card {
        padding: 18px 20px;
        border-radius: 18px;
        background: #f7fafc;
        border: 1px solid rgba(22, 50, 74, 0.08);
      }

      .card-head {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 12px;
      }

      .card-title {
        margin: 0 0 8px;
        font-weight: 700;
        color: #16324a;
      }

      .card p {
        margin: 0 0 6px;
      }

      .danger {
        background: #a12f2f;
      }

      @media (max-width: 720px) {
        .page {
          padding: 18px;
        }

        .panel {
          padding: 24px;
        }

        .row {
          grid-template-columns: 1fr;
        }

        .actions,
        .panel-head,
        .card-head {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class FraisKilometriquesVehiculeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly simulationId = signal<number>(Number(this.route.snapshot.paramMap.get('simulationId') ?? '0'));
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly vehicules = signal<VehiculeResponse[]>([]);

  protected readonly form = {
    marque: '',
    modele: '',
    immatriculation: '',
    type_vehicule: 'voiture',
    puissance_administrative: 1,
    date_achat: '',
    date_vente: '',
  };

  constructor() {
    if (!this.simulationId()) {
      void this.router.navigateByUrl('/bundles/frais-kilometriques');
      return;
    }

    void this.loadVehicules();
  }

  protected async addVehicule(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const response = await apiFetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/vehicules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...this.form,
          date_achat: this.form.date_achat || null,
          date_vente: this.form.date_vente || null,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? 'Impossible d enregistrer le vehicule.');
      }

      const vehicule = (await response.json()) as VehiculeResponse;
      this.vehicules.update((items) => [...items, vehicule]);
      this.successMessage.set('Vehicule enregistre. Prochaine etape : le calendrier.');
      this.form.marque = '';
      this.form.modele = '';
      this.form.immatriculation = '';
      this.form.type_vehicule = 'voiture';
      this.form.puissance_administrative = 1;
      this.form.date_achat = '';
      this.form.date_vente = '';
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async loadVehicules(): Promise<void> {
    try {
      const response = await apiFetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/vehicules`);
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { items: VehiculeResponse[] };
      this.vehicules.set(payload.items);
    } catch {
      return;
    }
  }

  protected async deleteVehicule(vehiculeId: number): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const response = await apiFetch(
        `/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/vehicules/${vehiculeId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? 'Impossible de supprimer le vehicule.');
      }

      this.vehicules.update((items) => items.filter((vehicule) => vehicule.id !== vehiculeId));
      this.successMessage.set('Vehicule supprime.');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    }
  }
}
