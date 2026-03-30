import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { apiFetch } from '../../core/api/api-fetch';

type DomicileResponse = {
  id: number;
  libelle: string;
  adresse_ligne_1: string;
  adresse_ligne_2: string;
  code_postal: string;
  ville: string;
  pays: string;
  created_at: string;
  updated_at: string;
};

@Component({
  selector: 'app-frais-kilometriques-domicile',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="panel">
        <p class="eyebrow">Etape suivante</p>
        <h1>Domicile</h1>
        <p class="lead">Renseigne l'adresse de reference du domicile pour le calcul des trajets.</p>

        <p class="meta">Simulation #{{ simulationId() }}</p>

        <form class="form" (ngSubmit)="save()">
          <label>
            <span>Libelle</span>
            <input [(ngModel)]="form.libelle" name="libelle" placeholder="Residence principale" />
          </label>

          <label>
            <span>Adresse ligne 1</span>
            <input
              [(ngModel)]="form.adresse_ligne_1"
              name="adresse_ligne_1"
              placeholder="10 rue de la Republique"
              required
            />
          </label>

          <label>
            <span>Adresse ligne 2</span>
            <input [(ngModel)]="form.adresse_ligne_2" name="adresse_ligne_2" placeholder="Batiment, etage" />
          </label>

          <div class="row">
            <label>
              <span>Code postal</span>
              <input [(ngModel)]="form.code_postal" name="code_postal" placeholder="75001" required />
            </label>

            <label>
              <span>Ville</span>
              <input [(ngModel)]="form.ville" name="ville" placeholder="Paris" required />
            </label>
          </div>

          <label>
            <span>Pays</span>
            <input [(ngModel)]="form.pays" name="pays" placeholder="France" />
          </label>

          @if (errorMessage()) {
            <p class="error">{{ errorMessage() }}</p>
          }

          @if (successMessage()) {
            <p class="success">{{ successMessage() }}</p>
          }

          <div class="actions">
            <a routerLink="/bundles/frais-kilometriques">Retour</a>
            <div class="cta-group">
              <button type="submit" [disabled]="loading()">
                {{ loading() ? 'Enregistrement...' : 'Enregistrer le domicile' }}
              </button>
              @if (hasDomicile()) {
                <button type="button" class="secondary" (click)="goToSites()">Continuer vers les sites</button>
              }
            </div>
          </div>
        </form>
      </section>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        padding: 32px;
        background:
          radial-gradient(circle at top right, rgba(76, 139, 108, 0.12), transparent 28%),
          linear-gradient(180deg, #eff6f5 0%, #fbfdfd 100%);
      }

      .panel {
        width: min(760px, 100%);
        margin: 0 auto;
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(22, 50, 74, 0.1);
        box-shadow: 0 22px 48px rgba(22, 50, 74, 0.08);
      }

      .eyebrow {
        margin: 0 0 10px;
        color: #4d7e78;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.78rem;
      }

      h1 {
        margin: 0;
        color: #16324a;
        font-size: clamp(2rem, 6vw, 3.4rem);
      }

      .lead,
      .meta,
      label span,
      a {
        color: #35546c;
      }

      .lead {
        margin: 14px 0 0;
      }

      .meta {
        margin: 14px 0 0;
        font-size: 0.95rem;
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

      input {
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

      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-top: 8px;
      }

      a {
        text-decoration: none;
        font-weight: 600;
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

      .cta-group {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: end;
      }

      .secondary {
        background: #1d5b45;
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

        .actions {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class FraisKilometriquesDomicileComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly simulationId = signal<number>(Number(this.route.snapshot.paramMap.get('simulationId') ?? '0'));
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly hasDomicile = signal(false);

  protected readonly form = {
    libelle: '',
    adresse_ligne_1: '',
    adresse_ligne_2: '',
    code_postal: '',
    ville: '',
    pays: 'France',
  };

  constructor() {
    if (!this.simulationId()) {
      void this.router.navigateByUrl('/bundles/frais-kilometriques');
      return;
    }

    void this.load();
  }

  protected async load(): Promise<void> {
    try {
      const response = await apiFetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/domicile`);
      if (!response.ok) {
        return;
      }

      const domicile = (await response.json()) as DomicileResponse;
      this.form.libelle = domicile.libelle;
      this.form.adresse_ligne_1 = domicile.adresse_ligne_1;
      this.form.adresse_ligne_2 = domicile.adresse_ligne_2;
      this.form.code_postal = domicile.code_postal;
      this.form.ville = domicile.ville;
      this.form.pays = domicile.pays;
      this.hasDomicile.set(true);
    } catch {
      return;
    }
  }

  protected async save(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const response = await apiFetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/domicile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.form),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? 'Impossible d enregistrer le domicile.');
      }

      this.hasDomicile.set(true);
      this.successMessage.set('Domicile enregistre. Prochaine etape : les lieux de travail.');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async goToSites(): Promise<void> {
    await this.router.navigate(['/bundles/frais-kilometriques', this.simulationId(), 'sites']);
  }
}
