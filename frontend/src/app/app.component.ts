import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { authService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" routerLink="/">
            <span class="brand-mark">F</span>
            <div>
              <p class="brand-name">Fisceo</p>
              <p class="brand-tag">simulateur d'avantages fiscaux</p>
            </div>
          </a>

          <nav class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              <span class="nav-kicker">Vue generale</span>
              <span class="nav-label">Accueil</span>
            </a>
            <a routerLink="/bundles/frais-kilometriques" routerLinkActive="active">
              <span class="nav-kicker">Bundle actif</span>
              <span class="nav-label">Deplacements & repas</span>
            </a>
          </nav>

          <div class="auth-zone">
            @if (auth.authenticated()) {
              <div class="user-chip">
                <span class="user-label">{{ auth.displayName() }}</span>
                <button type="button" (click)="logout()">Deconnexion</button>
              </div>
            } @else {
              <button type="button" class="login-button" (click)="login()">Connexion</button>
            }
          </div>
        </div>
      </header>

      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
      }

      .topbar {
        position: sticky;
        top: 0;
        z-index: 30;
        backdrop-filter: blur(18px);
        background: linear-gradient(180deg, rgba(12, 31, 46, 0.94) 0%, rgba(19, 42, 61, 0.88) 100%);
        border-bottom: 1px solid rgba(201, 220, 232, 0.14);
        box-shadow: 0 14px 34px rgba(8, 20, 31, 0.24);
      }

      .topbar-inner {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
        min-height: 76px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 18px;
        align-items: center;
        padding: 10px 0;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 14px;
        text-decoration: none;
      }

      .brand-mark {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(135deg, #16324a 0%, #2b5878 100%);
        color: #f7fbff;
        font-weight: 800;
      }

      .brand-name,
      .brand-tag {
        margin: 0;
      }

      .brand-name {
        color: #f3f8fb;
        font-weight: 800;
        letter-spacing: 0.01em;
      }

      .brand-tag {
        color: #9dc0d6;
        font-size: 0.86rem;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 10px;
        justify-self: center;
        flex-wrap: wrap;
        justify-content: center;
      }

      .nav-links a,
      .login-button,
      .user-chip button {
        min-height: 54px;
        padding: 0 18px;
        border-radius: 18px;
        border: 1px solid rgba(211, 228, 239, 0.14);
        background: rgba(255, 255, 255, 0.08);
        color: #dfeef7;
        text-decoration: none;
        font-weight: 600;
        font: inherit;
        cursor: pointer;
        transition:
          background 160ms ease,
          border-color 160ms ease,
          transform 160ms ease,
          color 160ms ease;
      }

      .nav-links a {
        display: grid;
        gap: 2px;
        align-content: center;
        min-width: 180px;
      }

      .nav-kicker {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #9dc0d6;
      }

      .nav-label {
        font-size: 0.98rem;
      }

      .nav-links a:hover,
      .login-button:hover,
      .user-chip button:hover {
        transform: translateY(-1px);
        background: rgba(255, 255, 255, 0.14);
        border-color: rgba(211, 228, 239, 0.24);
      }

      .nav-links a.active {
        background: #d9ece8;
        color: #12384d;
        border-color: #d9ece8;
      }

      .nav-links a.active .nav-kicker {
        color: #4c7283;
      }

      .auth-zone {
        justify-self: end;
        display: flex;
        justify-content: end;
      }

      .user-chip {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 8px 8px 8px 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(211, 228, 239, 0.14);
      }

      .user-label {
        color: #e5f1f8;
        font-size: 0.95rem;
        font-weight: 600;
      }

      .login-button,
      .user-chip button {
        background: linear-gradient(135deg, #4b8f96 0%, #2f6f75 100%);
        color: #f5fbff;
        border-color: rgba(255, 255, 255, 0.08);
      }

      @media (max-width: 920px) {
        .topbar-inner {
          grid-template-columns: 1fr;
          gap: 14px;
          padding: 14px 0;
        }

        .nav-links,
        .auth-zone {
          justify-self: stretch;
        }

        .nav-links {
          justify-content: start;
        }

        .user-chip {
          justify-content: space-between;
          width: 100%;
        }

        .login-button {
          width: 100%;
        }
      }

      @media (max-width: 640px) {
        .topbar-inner {
          width: min(1180px, calc(100% - 24px));
        }

        .brand {
          gap: 12px;
        }

        .brand-mark {
          width: 38px;
          height: 38px;
          border-radius: 12px;
        }

        .brand-name {
          font-size: 1rem;
        }

        .brand-tag {
          font-size: 0.8rem;
        }

        .nav-links {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .nav-links a,
        .login-button,
        .user-chip button {
          justify-content: center;
          text-align: center;
        }
      }
    `,
  ],
})
export class AppComponent {
  protected readonly auth = authService;

  protected async login(): Promise<void> {
    await this.auth.login();
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
  }
}
