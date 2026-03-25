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
          <h1>Simule tes avantages fiscaux sans te perdre dans la declaration.</h1>
          <p class="copy">
            Le premier bundle MVP t'aide a suivre tes frais kilometriques, tes jours sur site,
            le teletravail, les conges et le bareme applique a ton vehicule.
          </p>

          <div class="hero-actions">
            <a class="primary-action" routerLink="/bundles/frais-kilometriques">Commencer le bundle frais kilometriques</a>
            <span class="api-badge">API active sur http://localhost:8000/</span>
          </div>
        </div>

        <aside class="hero-panel">
          <p class="panel-label">Bundle disponible</p>
          <h2>Frais kilometriques</h2>
          <ul>
            <li>Domicile, sites et vehicules</li>
            <li>Calendrier interactif avec import Excel</li>
            <li>Calcul des km et synthese fiscale</li>
          </ul>
          <a class="secondary-action" routerLink="/bundles/frais-kilometriques">Acceder au bundle</a>
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
        padding: 28px;
        background:
          radial-gradient(circle at top left, rgba(92, 145, 184, 0.18), transparent 28%),
          radial-gradient(circle at bottom right, rgba(78, 143, 118, 0.14), transparent 30%),
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
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(22, 50, 74, 0.1);
        box-shadow: 0 24px 60px rgba(22, 50, 74, 0.08);
      }

      .eyebrow {
        margin: 0 0 12px;
        color: #537a96;
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
        padding: 0 20px;
        border-radius: 999px;
        background: #16324a;
        color: #f5fbff;
        text-decoration: none;
        font-weight: 600;
      }

      .secondary-action {
        width: 100%;
        margin-top: 18px;
        background: #1d5b45;
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

      .hero-panel ul {
        margin: 18px 0 0;
        padding-left: 20px;
        color: #35546c;
        line-height: 1.8;
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

      @media (max-width: 920px) {
        .hero {
          grid-template-columns: 1fr;
        }

        .highlights {
          grid-template-columns: 1fr;
        }

        h1 {
          max-width: none;
        }
      }

      @media (max-width: 640px) {
        .home {
          padding: 18px;
        }

        .hero-copy,
        .hero-panel,
        .highlight-card {
          padding: 26px;
        }
      }
    `,
  ],
})
export class HomeComponent {}
