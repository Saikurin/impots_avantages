import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="home">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">impots_avantages</p>
          <h1>Reprends la main sur ta déclaration et repère ce que tu peux vraiment déduire.</h1>
          <p class="copy">
            Fisceo transforme tes trajets, tes repas et tes jours travaillés en une simulation claire,
            sérieuse et directement exploitable pour tes frais réels.
          </p>

          <div class="hero-actions">
            <a class="primary-action" routerLink="/bundles/frais-kilometriques">Commencer le bundle Deplacements & repas</a>
            <span class="api-badge">Domicile, sites, véhicule, cantine et synthèse déductible</span>
          </div>
        </div>

        <aside class="hero-panel">
          <div class="illustration-card illustration-card-primary">
            <p class="panel-label">Parcours guide</p>
            <h2>Un seul espace pour piloter tes déplacements et tes repas.</h2>
            <p>
              Renseigne ta situation, visualise ton calendrier, importe ton historique et laisse
              Fisceo consolider automatiquement les montants déductibles.
            </p>
          </div>

          <div class="illustration-grid">
            <article class="illustration-card">
              <p class="illustration-value">1</p>
              <p class="illustration-text">bundle métier déjà prêt à l'emploi</p>
            </article>
            <article class="illustration-card">
              <p class="illustration-value">3</p>
              <p class="illustration-text">types de journées gérés : site, télétravail, congés</p>
            </article>
            <article class="illustration-card">
              <p class="illustration-value">2</p>
              <p class="illustration-text">sources de déduction : kilomètres et repas</p>
            </article>
          </div>
        </aside>
      </section>

      <section class="highlights">
        <article class="highlight-card">
          <p class="highlight-label">Saisie guidee</p>
          <h3>Un parcours par etapes</h3>
          <p>Reprends ton brouillon la ou tu t'es arrete et avance sans ressaisie inutile.</p>
        </article>

        <article class="highlight-card">
          <p class="highlight-label">Calcul fiable</p>
          <h3>Distance et bareme traces</h3>
          <p>Les trajets sont stockes par jour et le montant est calcule selon le bon bareme vehicule.</p>
        </article>

        <article class="highlight-card">
          <p class="highlight-label">Import rapide</p>
          <h3>Recupere ton historique Excel</h3>
          <p>Importe un fichier avec date, site et immatriculation pour reconstruire ton calendrier.</p>
        </article>
      </section>
    </main>
  `,
  styles: [
    `
      .home {
        min-height: 100vh;
        display: grid;
        gap: 24px;
        padding: 32px 28px 40px;
        background:
          radial-gradient(circle at top left, rgba(56, 115, 151, 0.22), transparent 26%),
          radial-gradient(circle at 85% 15%, rgba(74, 145, 118, 0.12), transparent 24%),
          linear-gradient(180deg, #edf4f8 0%, #f8fbfd 100%);
      }

      .hero,
      .highlights {
        width: min(1180px, 100%);
        margin: 0 auto;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.9fr);
        gap: 24px;
        align-items: stretch;
      }

      .hero-copy,
      .hero-panel,
      .highlight-card {
        padding: 36px;
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(22, 50, 74, 0.08);
        box-shadow: 0 28px 80px rgba(22, 50, 74, 0.08);
      }

      .hero-copy {
        display: grid;
        align-content: center;
        background:
          radial-gradient(circle at top right, rgba(34, 99, 138, 0.08), transparent 28%),
          rgba(255, 255, 255, 0.94);
      }

      .eyebrow {
        margin: 0 0 12px;
        color: #4a768d;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.8rem;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.8rem, 6vw, 5.2rem);
        line-height: 0.92;
        color: #16324a;
        max-width: 11ch;
      }

      .copy {
        margin: 20px 0 0;
        font-size: 1.08rem;
        line-height: 1.65;
        color: #35546c;
        max-width: 60ch;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 30px;
        align-items: center;
      }

      .primary-action,
      .secondary-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        padding: 0 22px;
        border-radius: 999px;
        background: linear-gradient(135deg, #16324a 0%, #2a587a 100%);
        color: #f5fbff;
        text-decoration: none;
        font-weight: 600;
        box-shadow: 0 14px 28px rgba(22, 50, 74, 0.16);
        transition: transform 160ms ease, box-shadow 160ms ease;
      }

      .primary-action:hover,
      .secondary-action:hover {
        transform: translateY(-1px);
        box-shadow: 0 18px 36px rgba(22, 50, 74, 0.18);
      }

      .secondary-action {
        margin-top: 18px;
        background: linear-gradient(135deg, #2f7864 0%, #1d5b45 100%);
        width: fit-content;
        max-width: 100%;
        align-self: start;
      }

      .api-badge,
      .panel-label,
      .highlight-label {
        color: #537a96;
        font-size: 0.95rem;
      }

      .hero-panel h2,
      .highlight-card h3 {
        margin: 10px 0 0;
        color: #16324a;
      }

      .hero-panel {
        display: grid;
        gap: 16px;
      }

      .illustration-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .illustration-card {
        position: relative;
        overflow: hidden;
        padding: 22px;
        border-radius: 22px;
        background: rgba(247, 250, 252, 0.96);
        border: 1px solid rgba(22, 50, 74, 0.08);
      }

      .illustration-card-primary {
        background:
          radial-gradient(circle at top right, rgba(47, 120, 100, 0.12), transparent 30%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 249, 251, 0.96) 100%);
      }

      .illustration-card-primary p:last-child,
      .illustration-text {
        margin: 12px 0 0;
        color: #35546c;
        line-height: 1.55;
      }

      .illustration-value {
        margin: 0;
        font-size: 2rem;
        font-weight: 800;
        color: #16324a;
      }

      .highlights {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .highlight-card p {
        margin: 14px 0 0;
        color: #35546c;
        line-height: 1.6;
      }

      .highlight-card {
        position: relative;
      }

      .highlight-card::before {
        content: '';
        display: block;
        width: 42px;
        height: 4px;
        border-radius: 999px;
        background: linear-gradient(90deg, #2a587a 0%, #4b8f96 100%);
        margin-bottom: 18px;
      }

      @media (max-width: 920px) {
        .home {
          padding-top: 22px;
        }

        .hero {
          grid-template-columns: 1fr;
        }

        .highlights {
          grid-template-columns: 1fr;
        }

        .illustration-grid {
          grid-template-columns: 1fr;
        }

        h1 {
          max-width: none;
          font-size: clamp(2.4rem, 7vw, 4rem);
        }

        .hero-actions {
          gap: 12px;
        }

        .primary-action,
        .secondary-action {
          width: fit-content;
          max-width: 100%;
        }
      }

      @media (max-width: 640px) {
        .home {
          padding: 16px 16px 28px;
        }

        .hero-copy,
        .hero-panel,
        .highlight-card {
          padding: 22px;
          border-radius: 22px;
        }

        h1 {
          font-size: 2.2rem;
          line-height: 1;
        }

        .copy,
        .highlight-card p,
        .hero-panel ul {
          font-size: 0.98rem;
        }

        .hero-actions {
          display: grid;
          gap: 10px;
        }

        .primary-action,
        .secondary-action {
          width: 100%;
        }

        .api-badge {
          font-size: 0.88rem;
        }
      }
    `,
  ],
})
export class HomeComponent {}
