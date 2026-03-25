import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

type SiteResponse = {
  id: number;
  nom: string;
  adresse_ligne_1: string;
  adresse_ligne_2: string;
  code_postal: string;
  ville: string;
  pays: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
};

@Component({
  selector: 'app-frais-kilometriques-sites',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <main class="page">
      <section class="panel">
        <p class="eyebrow">Etape suivante</p>
        <h1>Lieux de travail</h1>
        <p class="lead">Ajoute un ou plusieurs sites de travail pour poursuivre le wizard.</p>
        <p class="meta">Simulation #{{ simulationId() }}</p>

        <form class="form" (ngSubmit)="addSite()">
          <label>
            <span>Nom du site</span>
            <input [(ngModel)]="form.nom" name="nom" placeholder="Siege" required />
          </label>

          <label>
            <span>Adresse ligne 1</span>
            <input [(ngModel)]="form.adresse_ligne_1" name="adresse_ligne_1" placeholder="1 avenue de France" required />
          </label>

          <label>
            <span>Adresse ligne 2</span>
            <input [(ngModel)]="form.adresse_ligne_2" name="adresse_ligne_2" placeholder="Batiment, etage" />
          </label>

          <div class="row">
            <label>
              <span>Code postal</span>
              <input [(ngModel)]="form.code_postal" name="code_postal" placeholder="75013" required />
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
            <a [routerLink]="['/bundles/frais-kilometriques', simulationId(), 'domicile']">Retour au domicile</a>
            <div class="cta-group">
              <button type="submit" [disabled]="loading()">
                {{ loading() ? 'Ajout...' : 'Ajouter un site' }}
              </button>
              @if (sites().length) {
                <a class="button-link" [routerLink]="['/bundles/frais-kilometriques', simulationId(), 'vehicule']">
                  Continuer vers le vehicule
                </a>
              }
            </div>
          </div>
        </form>
      </section>

      <section class="panel list-panel">
        <div class="panel-head">
          <h2>Sites enregistres</h2>
          <span>{{ sites().length }} site(s)</span>
        </div>

        @if (!sites().length) {
          <p class="empty">Aucun site enregistre pour le moment.</p>
        }

        @if (sites().length) {
          <div class="list">
            @for (site of sites(); track site.id) {
              <article class="card">
                <div class="card-head">
                  <p class="card-title">{{ site.nom }}</p>
                  <button type="button" class="danger" (click)="deleteSite(site.id)">Supprimer</button>
                </div>
                <p>{{ site.adresse_ligne_1 }}</p>
                @if (site.adresse_ligne_2) {
                  <p>{{ site.adresse_ligne_2 }}</p>
                }
                <p>{{ site.code_postal }} {{ site.ville }}</p>
                <p>{{ site.pays }}</p>
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
          radial-gradient(circle at top left, rgba(84, 114, 166, 0.12), transparent 28%),
          linear-gradient(180deg, #eff4f8 0%, #fbfdfe 100%);
      }

      .panel {
        width: min(820px, 100%);
        margin: 0 auto;
        padding: 32px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.94);
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
        .panel-head {
          flex-direction: column;
          align-items: stretch;
        }
      }
    `,
  ],
})
export class FraisKilometriquesSitesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly simulationId = signal<number>(Number(this.route.snapshot.paramMap.get('simulationId') ?? '0'));
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly sites = signal<SiteResponse[]>([]);

  protected readonly form = {
    nom: '',
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

    void this.loadSites();
  }

  protected async addSite(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/sites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.form),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? 'Impossible d ajouter le site.');
      }

      const site = (await response.json()) as SiteResponse;
      this.sites.update((items) => [...items, site]);
      this.successMessage.set('Site enregistre. Prochaine etape : le vehicule.');
      this.form.nom = '';
      this.form.adresse_ligne_1 = '';
      this.form.adresse_ligne_2 = '';
      this.form.code_postal = '';
      this.form.ville = '';
      this.form.pays = 'France';
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.loading.set(false);
    }
  }

  protected async loadSites(): Promise<void> {
    try {
      const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/sites`);
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { items: SiteResponse[] };
      this.sites.set(payload.items);
    } catch {
      return;
    }
  }

  protected async deleteSite(siteId: number): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const response = await fetch(
        `/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/sites/${siteId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? 'Impossible de supprimer le site.');
      }

      this.sites.update((items) => items.filter((site) => site.id !== siteId));
      this.successMessage.set('Site supprime.');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    }
  }
}
