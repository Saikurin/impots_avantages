import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

type ResultatResponse = {
  simulation: {
    id: number;
    annee_fiscale: number;
  };
  filtre: {
    year: number | null;
    available_years: number[];
  };
  totaux: {
    jours_total: number;
    jours_site: number;
    jours_teletravail: number;
    jours_conges: number;
    total_km: number;
    montant_total_eur: number;
  };
  vehicules: Array<{
    vehicule: {
      id: number;
      marque: string;
      modele: string;
      immatriculation: string;
      type_vehicule: string;
      puissance_administrative: number;
    };
    jours_site: number;
    total_km: number;
    bareme_type: string | null;
    bareme_puissance: number | null;
    formule: string | null;
    montant_total_eur: number;
  }>;
  jours: Array<{
    id: number;
    date: string;
    type_jour: string;
    distance_km: number;
    commentaire: string;
  }>;
};

@Component({
  selector: 'app-frais-kilometriques-resultat',
  standalone: true,
  imports: [RouterLink, DecimalPipe, FormsModule],
  template: `
    <main class="page">
      <section class="panel hero">
        <p class="eyebrow">Resultat</p>
        <h1>Synthese de la simulation</h1>
        <p class="lead">Une premiere vue d'ensemble des jours declares et du kilometrage deja stocke.</p>
        <p class="meta">Simulation #{{ simulationId() }}</p>

        @if (resultat()?.filtre?.available_years?.length) {
          <div class="filter-box">
            <label>
              <span>Filtrer par annee</span>
              <select [(ngModel)]="selectedYear" name="selectedYear" (ngModelChange)="onYearChange($event)">
                <option [ngValue]="null">Toutes les annees</option>
                @for (year of resultat()!.filtre.available_years; track year) {
                  <option [ngValue]="year">{{ year }}</option>
                }
              </select>
            </label>
          </div>
        }
      </section>

      @if (errorMessage()) {
        <section class="panel"><p class="error">{{ errorMessage() }}</p></section>
      }

      @if (successMessage()) {
        <section class="panel"><p class="success">{{ successMessage() }}</p></section>
      }

      @if (resultat()) {
        <section class="panel stats">
          <article class="stat-card">
            <p class="label">Jours declares</p>
            <p class="value">{{ resultat()!.totaux.jours_total }}</p>
          </article>
          <article class="stat-card">
            <p class="label">Sur site</p>
            <p class="value">{{ resultat()!.totaux.jours_site }}</p>
          </article>
          <article class="stat-card">
            <p class="label">Teletravail</p>
            <p class="value">{{ resultat()!.totaux.jours_teletravail }}</p>
          </article>
          <article class="stat-card">
            <p class="label">Conges</p>
            <p class="value">{{ resultat()!.totaux.jours_conges }}</p>
          </article>
          <article class="stat-card stat-card-primary">
            <p class="label">Total km</p>
            <p class="value">{{ resultat()!.totaux.total_km | number:'1.0-2' }}</p>
          </article>
          <article class="stat-card stat-card-accent">
            <p class="label">Montant estime</p>
            <p class="value">{{ resultat()!.totaux.montant_total_eur | number:'1.0-2' }} EUR</p>
          </article>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Baremes appliques</h2>
            <button type="button" class="recalculate-button" (click)="recalculate()" [disabled]="recalculating()">
              {{ recalculating() ? 'Recalcul...' : 'Recalculer la simulation' }}
            </button>
          </div>

          @if (resultat()!.vehicules.length) {
            <div class="bareme-grid">
              @for (detail of resultat()!.vehicules; track detail.vehicule.id) {
                <article class="bareme-card">
                  <p class="label">Vehicule</p>
                  <p class="row-title">{{ detail.vehicule.marque }} {{ detail.vehicule.modele }}</p>
                  <p>{{ detail.vehicule.immatriculation }}</p>
                  <p>Type : {{ detail.bareme_type }}</p>
                  <p>Puissance : {{ detail.bareme_puissance }} CV</p>
                  <p>Jours sur site : {{ detail.jours_site }}</p>
                  <p>Total km : {{ detail.total_km | number:'1.0-2' }}</p>
                  <p>Formule : {{ detail.formule }}</p>
                  <p class="row-title">{{ detail.montant_total_eur | number:'1.0-2' }} EUR</p>
                </article>
              }
            </div>
          } @else {
            <p class="error">Aucun vehicule disponible pour appliquer le bareme.</p>
          }
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Detail des jours</h2>
            <a [routerLink]="['/bundles/frais-kilometriques', simulationId(), 'calendrier']">Retour au calendrier</a>
          </div>

          <div class="list" (scroll)="onListScroll($event)">
            @for (jour of visibleDays(); track jour.id) {
              <article class="row-card">
                <div>
                  <p class="row-title">{{ jour.date }}</p>
                  <p>{{ jour.type_jour }}</p>
                  @if (jour.commentaire) {
                    <p>{{ jour.commentaire }}</p>
                  }
                </div>
                <p class="km">{{ jour.distance_km | number:'1.0-2' }} km</p>
              </article>
            }

            @if (resultat()!.jours.length > visibleDays().length) {
              <div class="list-footer">
                <p>{{ visibleDays().length }} / {{ resultat()!.jours.length }} jours affiches</p>
              </div>
            }
          </div>
        </section>
      }
    </main>
  `,
  styles: [
    `
      .page { min-height: 100vh; padding: 32px; display: grid; gap: 24px; background: linear-gradient(180deg, #f1f6f9 0%, #fbfdfe 100%); }
      .panel { width: min(1080px, 100%); margin: 0 auto; padding: 32px; border-radius: 24px; background: rgba(255,255,255,.94); border: 1px solid rgba(22,50,74,.1); box-shadow: 0 22px 48px rgba(22,50,74,.08); }
      .eyebrow { margin: 0 0 10px; color: #537a96; text-transform: uppercase; letter-spacing: .12em; font-size: .78rem; }
      h1,h2,p { margin: 0; }
      h1,h2,.value,.row-title { color: #16324a; }
      .lead,.meta,.label,.row-card p,a,.error,.success,.filter-box span { color: #35546c; }
      .lead,.meta { margin-top: 14px; }
      .filter-box { margin-top: 22px; max-width: 260px; }
      .filter-box label { display: grid; gap: 8px; }
      .filter-box span { font-size: .95rem; font-weight: 600; }
      .filter-box select { min-height: 46px; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(22,50,74,.16); background: #fff; color: #16324a; font: inherit; }
      .stats { display: grid; gap: 16px; grid-template-columns: repeat(6, minmax(0, 1fr)); }
      .stat-card { padding: 20px; border-radius: 18px; background: #f7fafc; border: 1px solid rgba(22,50,74,.08); }
      .stat-card-primary { background: #16324a; }
      .stat-card-primary .label, .stat-card-primary .value { color: #f5fbff; }
      .stat-card-accent { background: #1d5b45; }
      .stat-card-accent .label, .stat-card-accent .value { color: #f5fbff; }
      .label { font-size: .9rem; margin-bottom: 10px; }
      .value { font-size: 2rem; font-weight: 700; }
      .panel-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 18px; }
      .recalculate-button { min-height: 46px; padding: 0 18px; border: 0; border-radius: 999px; background: #16324a; color: #f5fbff; font-weight: 600; cursor: pointer; }
      .bareme-grid { display: grid; gap: 14px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .bareme-card { padding: 18px 20px; border-radius: 18px; background: #f7fafc; border: 1px solid rgba(22,50,74,.08); }
      .list { display: grid; gap: 12px; max-height: 520px; overflow-y: auto; padding-right: 6px; }
      .list-footer { display: grid; place-items: center; min-height: 56px; color: #537a96; font-weight: 600; }
      .row-card { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 20px; border-radius: 18px; background: #f7fafc; border: 1px solid rgba(22,50,74,.08); }
      .row-title { font-weight: 700; margin-bottom: 6px; }
      .km { font-weight: 700; white-space: nowrap; }
      a { text-decoration: none; font-weight: 600; }
      .error { font-weight: 600; }
      .success { font-weight: 600; color: #1d5b45; }
      @media (max-width: 900px) { .stats, .bareme-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media (max-width: 720px) { .page { padding: 18px; } .panel { padding: 24px; } .stats, .bareme-grid { grid-template-columns: 1fr; } .panel-head,.row-card { flex-direction: column; align-items: stretch; } }
    `,
  ],
})
export class FraisKilometriquesResultatComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly simulationId = signal<number>(Number(this.route.snapshot.paramMap.get('simulationId') ?? '0'));
  protected readonly resultat = signal<ResultatResponse | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly recalculating = signal(false);
  protected selectedYear: number | null = null;
  protected readonly visibleDaysCount = signal(30);
  protected readonly visibleDays = computed(() => {
    const resultat = this.resultat();
    if (!resultat) {
      return [];
    }

    return resultat.jours.slice(0, this.visibleDaysCount());
  });

  constructor() {
    if (!this.simulationId()) {
      void this.router.navigateByUrl('/bundles/frais-kilometriques');
      return;
    }
    void this.loadResultat();
  }

  private async loadResultat(): Promise<void> {
    try {
      this.errorMessage.set('');
      const query = this.selectedYear ? `?year=${this.selectedYear}` : '';
      const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/resultat${query}`);
      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? 'Impossible de charger le resultat.');
      }
      const payload = (await response.json()) as ResultatResponse;
      this.resultat.set(payload);
      this.selectedYear = payload.filtre.year;
      this.visibleDaysCount.set(30);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    }
  }

  protected async onYearChange(year: number | null): Promise<void> {
    this.selectedYear = year;
    await this.loadResultat();
  }

  protected async recalculate(): Promise<void> {
    this.recalculating.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const response = await fetch(
        `/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/recalculer`,
        { method: 'POST' },
      );
      const payload = (await response.json()) as {
        detail?: string;
        recalculated_days?: number;
      };

      if (!response.ok) {
        throw new Error(payload.detail ?? 'Impossible de recalculer la simulation.');
      }

      this.successMessage.set(
        `${payload.detail ?? 'Simulation recalculee.'} ${payload.recalculated_days ?? 0} jour(s) mis a jour.`,
      );
      await this.loadResultat();
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.recalculating.set(false);
    }
  }

  protected onListScroll(event: Event): void {
    const element = event.target as HTMLElement;
    const nearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 80;

    if (!nearBottom) {
      return;
    }

    const resultat = this.resultat();
    if (!resultat || this.visibleDaysCount() >= resultat.jours.length) {
      return;
    }

    this.visibleDaysCount.update((count) => Math.min(count + 30, resultat.jours.length));
  }
}
