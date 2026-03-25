import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

type SiteOption = {
  id: number;
  nom: string;
};

type VehiculeOption = {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
};

type JourResponse = {
  id: number;
  date: string;
  type_jour: string;
  site_travail_id: number | null;
  vehicule_id: number | null;
  distance_km: number;
  montant_eur: number;
  commentaire: string;
};

@Component({
  selector: 'app-frais-kilometriques-calendrier',
  standalone: true,
  imports: [FormsModule, RouterLink, FullCalendarModule],
  template: `
    <main class="page">
      <section class="panel panel-calendar">
        <div class="panel-copy">
          <p class="eyebrow">Etape suivante</p>
          <h1>Calendrier</h1>
          <p class="lead">Clique, double-clique ou selectionne plusieurs jours pour declarer rapidement ton planning.</p>
          <p class="meta">Simulation #{{ simulationId() }}</p>
        </div>

        <div class="legend">
          <span class="legend-item"><i class="dot site"></i>Sur site</span>
          <span class="legend-item"><i class="dot teletravail"></i>Teletravail</span>
          <span class="legend-item"><i class="dot conges"></i>Conges</span>
        </div>

        <div class="summary-grid">
          <article class="summary-card">
            <p class="summary-label">Jours declares</p>
            <p class="summary-value">{{ jours().length }}</p>
          </article>
          <article class="summary-card">
            <p class="summary-label">Sur site</p>
            <p class="summary-value">{{ siteDaysCount() }}</p>
          </article>
          <article class="summary-card">
            <p class="summary-label">Teletravail</p>
            <p class="summary-value">{{ teletravailDaysCount() }}</p>
          </article>
          <article class="summary-card">
            <p class="summary-label">Conges</p>
            <p class="summary-value">{{ congesDaysCount() }}</p>
          </article>
          <article class="summary-card summary-card-accent">
            <p class="summary-label">Total km</p>
            <p class="summary-value">{{ totalKm() }}</p>
          </article>
        </div>

        <div class="import-box">
          <div>
            <p class="import-title">Import Excel</p>
            <p class="import-copy">Colonnes attendues dans l'ordre : date, nom du site, plaque d'immatriculation.</p>
            <a class="template-link" href="/modeles/import_frais_kilometriques_modele.xlsx" download>
              Telecharger le fichier modele
            </a>
          </div>
          <div class="import-actions">
            <input #fileInput type="file" accept=".xlsx" (change)="onFileSelected($event)" />
            <button type="button" [disabled]="importLoading() || !selectedFile()" (click)="importExcel()">
              {{ importLoading() ? 'Import...' : 'Importer le fichier' }}
            </button>
          </div>
          @if (importMessage()) {
            <p class="success">{{ importMessage() }}</p>
          }
          @if (importErrors().length) {
            <div class="import-errors">
              @for (item of importErrors(); track item.row) {
                <p class="error">Ligne {{ item.row }} : {{ item.detail }}</p>
              }
            </div>
          }
        </div>

        <full-calendar [options]="calendarOptions()" [deepChangeDetection]="true"></full-calendar>
      </section>

      <section class="panel panel-form">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Jour selectionne</p>
            <h2>{{ selectedRangeLabel() }}</h2>
            @if (selectedJour()) {
              <p class="detail-km">Kilometres enregistres : {{ selectedJour()!.distance_km }} km</p>
            }
          </div>
          @if (selectedJour()) {
            <button type="button" class="danger" (click)="deleteJour(selectedJour()!.id)">Supprimer ce jour</button>
          }
        </div>

        <form class="form" (ngSubmit)="saveJour()">
          <div class="row">
            <label>
              <span>Date de debut</span>
              <input [(ngModel)]="form.date" name="date" type="date" required />
            </label>

            <label>
              <span>Date de fin</span>
              <input [(ngModel)]="form.date_fin" name="date_fin" type="date" required />
            </label>
          </div>

          <label>
            <span>Type de jour</span>
            <select [(ngModel)]="form.type_jour" name="type_jour" (ngModelChange)="onTypeJourChange()">
              <option value="site">Sur site</option>
              <option value="teletravail">Teletravail</option>
              <option value="conges">Conges</option>
            </select>
          </label>

          @if (form.type_jour === 'site') {
            <div class="row">
              <label>
                <span>Vehicule</span>
                <select [(ngModel)]="form.vehicule_id" name="vehicule_id">
                  <option [ngValue]="null">Choisir un vehicule</option>
                  @for (vehicule of vehicules(); track vehicule.id) {
                    <option [ngValue]="vehicule.id">{{ vehicule.marque }} {{ vehicule.modele }} - {{ vehicule.immatriculation }}</option>
                  }
                </select>
              </label>

              <label>
                <span>Site de travail</span>
                <select [(ngModel)]="form.site_travail_id" name="site_travail_id">
                  <option [ngValue]="null">Choisir un site</option>
                  @for (site of sites(); track site.id) {
                    <option [ngValue]="site.id">{{ site.nom }}</option>
                  }
                </select>
              </label>
            </div>
          }

          <label>
            <span>Commentaire</span>
            <input [(ngModel)]="form.commentaire" name="commentaire" placeholder="Optionnel" />
          </label>

          @if (errorMessage()) {
            <p class="error">{{ errorMessage() }}</p>
          }

          @if (successMessage()) {
            <p class="success">{{ successMessage() }}</p>
          }

          <div class="actions">
            <a [routerLink]="['/bundles/frais-kilometriques', simulationId(), 'vehicule']">Retour au vehicule</a>
            <div class="cta-group">
              <a class="button-link secondary-link" [routerLink]="['/bundles/frais-kilometriques', simulationId(), 'resultat']">Voir le resultat</a>
              <button type="button" class="ghost" (click)="resetForm()">Nouvelle selection</button>
              <button type="submit" [disabled]="loading() || !form.date || !form.date_fin">
                {{ loading() ? 'Enregistrement...' : selectedJour() && !isRangeSelection() ? 'Mettre a jour le jour' : 'Enregistrer la selection' }}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  `,
  styles: [
    `
      .page { min-height: 100vh; padding: 32px; display: grid; gap: 24px; background: linear-gradient(180deg, #f2f6fb 0%, #fbfdfe 100%); }
      .panel { width: min(1080px, 100%); margin: 0 auto; padding: 32px; border-radius: 24px; background: rgba(255,255,255,.94); border: 1px solid rgba(22,50,74,.1); box-shadow: 0 22px 48px rgba(22,50,74,.08); }
      .eyebrow { margin: 0 0 10px; color: #537a96; text-transform: uppercase; letter-spacing: .12em; font-size: .78rem; }
      h1,h2 { margin: 0; color: #16324a; }
      h1 { font-size: clamp(2rem, 6vw, 3.4rem); }
      .lead,.meta,label span,a,.legend-item,.detail-km { color: #35546c; }
      .lead,.meta { margin-top: 14px; }
      .detail-km { margin: 10px 0 0; font-weight: 600; }
      .panel-calendar { display: grid; gap: 20px; }
      .summary-grid { display: grid; gap: 14px; grid-template-columns: repeat(5, minmax(0, 1fr)); }
      .summary-card { padding: 18px 20px; border-radius: 18px; background: #f7fafc; border: 1px solid rgba(22,50,74,.08); }
      .summary-card-accent { background: #16324a; }
      .summary-label { color: #537a96; font-size: .9rem; margin: 0 0 10px; }
      .summary-value { color: #16324a; font-size: 1.9rem; font-weight: 700; margin: 0; }
      .summary-card-accent .summary-label, .summary-card-accent .summary-value { color: #f5fbff; }
      .import-box { display: grid; gap: 12px; padding: 18px 20px; border-radius: 18px; background: #f7fafc; border: 1px solid rgba(22,50,74,.08); }
      .import-title { font-weight: 700; color: #16324a; }
      .import-copy { margin-top: 6px; color: #35546c; }
      .template-link { margin-top: 10px; display: inline-flex; color: #16324a; }
      .import-actions { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
      .import-errors { display: grid; gap: 6px; }
      .legend { display: flex; gap: 18px; flex-wrap: wrap; }
      .legend-item { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; }
      .dot { width: 12px; height: 12px; border-radius: 999px; display: inline-block; }
      .dot.site { background: #2d6cdf; }
      .dot.teletravail { background: #2d9b62; }
      .dot.conges { background: #8a6fb3; }
      .panel-form { display: grid; gap: 24px; }
      .panel-head { display: flex; justify-content: space-between; align-items: start; gap: 16px; }
      .form { display: grid; gap: 16px; }
      label { display: grid; gap: 8px; }
      label span { font-size: .95rem; font-weight: 600; }
      input,select { min-height: 48px; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(22,50,74,.16); background: #fff; color: #16324a; font: inherit; }
      .row { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0,1fr)); }
      .actions { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
      .cta-group { display: flex; gap: 12px; flex-wrap: wrap; justify-content: end; }
      a { text-decoration: none; font-weight: 600; }
      button { min-height: 46px; padding: 0 18px; border: 0; border-radius: 999px; background: #16324a; color: #f5fbff; font-weight: 600; cursor: pointer; }
      button.ghost { background: #e6eef3; color: #16324a; }
      .button-link { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 18px; border-radius: 999px; background: #1d5b45; color: #f5fbff; }
      .secondary-link { background: #1d5b45; }
      .danger { background: #a12f2f; }
      .error { margin: 0; color: #a12f2f; font-weight: 600; }
      .success { margin: 0; color: #1d5b45; font-weight: 600; }
      :host ::ng-deep .fc { --fc-border-color: rgba(22,50,74,.12); --fc-page-bg-color: #fff; --fc-neutral-bg-color: #f7fafc; --fc-today-bg-color: rgba(45,108,223,.08); --fc-button-bg-color: #16324a; --fc-button-border-color: #16324a; --fc-button-hover-bg-color: #224663; --fc-button-hover-border-color: #224663; --fc-button-active-bg-color: #224663; --fc-button-active-border-color: #224663; }
      :host ::ng-deep .fc .fc-toolbar-title { font-size: 1.15rem; color: #16324a; }
      :host ::ng-deep .fc .fc-daygrid-event { border-radius: 999px; padding: 2px 8px; border: 0; }
      @media (max-width: 900px) { .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media (max-width: 720px) { .page { padding: 18px; } .panel { padding: 24px; } .row, .summary-grid { grid-template-columns: 1fr; } .actions,.panel-head { flex-direction: column; align-items: stretch; } }
    `,
  ],
})
export class FraisKilometriquesCalendrierComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly simulationId = signal<number>(Number(this.route.snapshot.paramMap.get('simulationId') ?? '0'));
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly jours = signal<JourResponse[]>([]);
  protected readonly sites = signal<SiteOption[]>([]);
  protected readonly vehicules = signal<VehiculeOption[]>([]);
  protected readonly selectedJour = signal<JourResponse | null>(null);
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly importLoading = signal(false);
  protected readonly importMessage = signal('');
  protected readonly importErrors = signal<Array<{ row: number; detail: string }>>([]);
  protected readonly siteDaysCount = computed(
    () => this.jours().filter((jour) => jour.type_jour === 'site').length,
  );
  protected readonly teletravailDaysCount = computed(
    () => this.jours().filter((jour) => jour.type_jour === 'teletravail').length,
  );
  protected readonly congesDaysCount = computed(
    () => this.jours().filter((jour) => jour.type_jour === 'conges').length,
  );
  protected readonly totalKm = computed(() =>
    this.jours()
      .reduce((sum, jour) => sum + jour.distance_km, 0)
      .toFixed(2),
  );

  protected readonly form = {
    date: '',
    date_fin: '',
    type_jour: 'site',
    site_travail_id: null as number | null,
    vehicule_id: null as number | null,
    commentaire: '',
  };

  protected readonly selectedRangeLabel = computed(() => {
    if (!this.form.date) return 'Choisis une date ou une plage';
    if (!this.form.date_fin || this.form.date_fin === this.form.date) return this.form.date;
    return `${this.form.date} -> ${this.form.date_fin}`;
  });

  protected readonly isRangeSelection = computed(() => !!this.form.date && !!this.form.date_fin && this.form.date !== this.form.date_fin);

  protected readonly calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'fr',
    height: 'auto',
    firstDay: 1,
    selectable: true,
    selectMirror: true,
    dateClick: (arg) => this.onDateClick(arg),
    select: (arg) => this.onDateRangeSelect(arg),
    eventClick: (arg) => this.onEventClick(arg),
    dayCellDidMount: (arg) => {
      arg.el.addEventListener('dblclick', () => this.onDayDoubleClick(arg.date));
    },
    events: this.jours().map((jour) => ({
      id: String(jour.id),
      title: jour.type_jour === 'teletravail' ? 'Teletravail' : jour.type_jour === 'conges' ? 'Conges' : this.getSiteLabel(jour.site_travail_id),
      start: jour.date,
      allDay: true,
      backgroundColor: jour.type_jour === 'teletravail' ? '#2d9b62' : jour.type_jour === 'conges' ? '#8a6fb3' : '#2d6cdf',
      borderColor: jour.type_jour === 'teletravail' ? '#2d9b62' : jour.type_jour === 'conges' ? '#8a6fb3' : '#2d6cdf',
    })),
  }));

  constructor() {
    if (!this.simulationId()) {
      void this.router.navigateByUrl('/bundles/frais-kilometriques');
      return;
    }
    void this.bootstrap();
  }

  protected async bootstrap(): Promise<void> {
    await Promise.all([this.loadJours(), this.loadSites(), this.loadVehicules()]);
    if (!this.form.vehicule_id && this.vehicules().length) {
      this.form.vehicule_id = this.vehicules()[0].id;
    }
    if (!this.form.site_travail_id && this.sites().length) {
      this.form.site_travail_id = this.sites()[0].id;
    }
  }

  protected onDateClick(arg: DateClickArg): void {
    const jour = this.jours().find((item) => item.date === arg.dateStr) ?? null;
    this.populateForm(arg.dateStr, jour);
  }

  protected onDateRangeSelect(arg: { startStr: string; endStr: string }): void {
    const end = new Date(arg.endStr);
    end.setDate(end.getDate() - 1);
    const endDate = end.toISOString().slice(0, 10);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.selectedJour.set(null);
    this.form.date = arg.startStr.slice(0, 10);
    this.form.date_fin = endDate;
  }

  protected onDayDoubleClick(date: Date): void {
    const dateValue = date.toISOString().slice(0, 10);
    const jour = this.jours().find((item) => item.date === dateValue) ?? null;
    this.populateForm(dateValue, jour);
  }

  protected onEventClick(arg: EventClickArg): void {
    const jour = this.jours().find((item) => item.id === Number(arg.event.id)) ?? null;
    this.populateForm(arg.event.startStr.slice(0, 10), jour);
  }

  protected onTypeJourChange(): void {
    if (this.form.type_jour === 'teletravail') {
      this.form.site_travail_id = null;
    } else if (this.form.type_jour === 'conges') {
      this.form.site_travail_id = null;
      this.form.vehicule_id = null;
    } else if (!this.form.site_travail_id && this.sites().length) {
      this.form.site_travail_id = this.sites()[0].id;
    }

    if (this.form.type_jour !== 'conges' && !this.form.vehicule_id && this.vehicules().length) {
      this.form.vehicule_id = this.vehicules()[0].id;
    }
  }

  protected async saveJour(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      const dates = this.buildSelectedDates();
      const savedDays: JourResponse[] = [];

      for (const currentDate of dates) {
        const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/calendrier`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...this.form,
            date: currentDate,
          site_travail_id: this.form.type_jour === 'site' ? this.form.site_travail_id : null,
          vehicule_id: this.form.type_jour === 'conges' ? null : this.form.vehicule_id,
        }),
        });
        if (!response.ok) {
          const payload = (await response.json()) as { detail?: string };
          throw new Error(payload.detail ?? 'Impossible d enregistrer le jour.');
        }
        savedDays.push((await response.json()) as JourResponse);
      }

      this.jours.update((items) => {
        let updated = [...items];
        for (const jour of savedDays) {
          updated = updated.filter((item) => item.id !== jour.id && item.date !== jour.date);
          updated.push(jour);
        }
        return updated.sort((a, b) => a.date.localeCompare(b.date));
      });

      this.selectedJour.set(savedDays.length === 1 ? savedDays[0] : null);
      this.successMessage.set(savedDays.length > 1 ? `${savedDays.length} jours enregistres.` : 'Jour enregistre.');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.loading.set(false);
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
    this.importMessage.set('');
    this.importErrors.set([]);
  }

  protected async importExcel(): Promise<void> {
    const file = this.selectedFile();
    if (!file) {
      return;
    }

    this.importLoading.set(true);
    this.importMessage.set('');
    this.importErrors.set([]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/calendrier/import`, {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json()) as { detail?: string; imported?: number; updated?: number; errors?: Array<{ row: number; detail: string }> };
      if (!response.ok) {
        throw new Error(payload.detail ?? 'Impossible d importer le fichier.');
      }

      this.importMessage.set(`Import termine : ${payload.imported ?? 0} cree(s), ${payload.updated ?? 0} mis a jour.`);
      this.importErrors.set(payload.errors ?? []);
      await this.loadJours();
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    } finally {
      this.importLoading.set(false);
    }
  }

  protected async deleteJour(jourId: number): Promise<void> {
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/calendrier/${jourId}`, { method: 'DELETE' });
      if (!response.ok) {
        const payload = (await response.json()) as { detail?: string };
        throw new Error(payload.detail ?? 'Impossible de supprimer le jour.');
      }
      this.jours.update((items) => items.filter((jour) => jour.id !== jourId));
      await this.loadJours();
      this.resetForm();
      this.successMessage.set('Jour supprime.');
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Erreur inconnue.');
    }
  }

  protected resetForm(): void {
    this.selectedJour.set(null);
    this.form.date = '';
    this.form.date_fin = '';
    this.form.type_jour = 'site';
    this.form.commentaire = '';
    this.form.site_travail_id = this.sites().length ? this.sites()[0].id : null;
    this.form.vehicule_id = this.vehicules().length ? this.vehicules()[0].id : null;
  }

  protected getSiteLabel(siteId: number | null): string {
    if (!siteId) return 'Aucun';
    return this.sites().find((site) => site.id === siteId)?.nom ?? 'Site inconnu';
  }

  protected getVehiculeLabel(vehiculeId: number | null): string {
    if (!vehiculeId) return 'Aucun';
    const vehicule = this.vehicules().find((item) => item.id === vehiculeId);
    return vehicule ? `${vehicule.marque} ${vehicule.modele}` : 'Vehicule inconnu';
  }

  private populateForm(dateValue: string, jour: JourResponse | null): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.selectedJour.set(jour);
    this.form.date = dateValue;
    this.form.date_fin = dateValue;
    this.form.type_jour = jour?.type_jour ?? 'site';
    this.form.site_travail_id = jour?.site_travail_id ?? (this.sites().length ? this.sites()[0].id : null);
    this.form.vehicule_id = jour?.vehicule_id ?? (this.vehicules().length ? this.vehicules()[0].id : null);
    this.form.commentaire = jour?.commentaire ?? '';
    this.onTypeJourChange();
  }

  private buildSelectedDates(): string[] {
    const start = new Date(this.form.date);
    const end = new Date(this.form.date_fin || this.form.date);
    if (end < start) {
      throw new Error('La date de fin doit etre posterieure ou egale a la date de debut.');
    }

    const dates: string[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
  }

  private async loadJours(): Promise<void> {
    const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/calendrier`);
    if (!response.ok) return;
    const payload = (await response.json()) as { items: JourResponse[] };
    this.jours.set(payload.items);
  }

  private async loadSites(): Promise<void> {
    const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/sites`);
    if (!response.ok) return;
    const payload = (await response.json()) as { items: SiteOption[] };
    this.sites.set(payload.items);
  }

  private async loadVehicules(): Promise<void> {
    const response = await fetch(`/api/bundles/frais-kilometriques/simulations/${this.simulationId()}/vehicules`);
    if (!response.ok) return;
    const payload = (await response.json()) as { items: VehiculeOption[] };
    this.vehicules.set(payload.items);
  }
}
