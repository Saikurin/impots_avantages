import { Component } from '@angular/core';

@Component({
  selector: 'app-frais-kilometriques-shell',
  standalone: true,
  template: `
    <main class="bundle-shell">
      <section class="panel">
        <p class="eyebrow">Bundle initial</p>
        <h1>Frais kilometriques</h1>
        <p>La structure Angular du premier bundle est prete a accueillir le wizard.</p>
      </section>
    </main>
  `,
  styles: [
    `
      .bundle-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at top right, rgba(58, 121, 113, 0.12), transparent 30%),
          linear-gradient(180deg, #f4f8f9 0%, #fbfcfd 100%);
      }

      .panel {
        width: min(680px, 100%);
        padding: 40px;
        border-radius: 24px;
        background: #ffffff;
        border: 1px solid rgba(22, 50, 74, 0.1);
        box-shadow: 0 22px 48px rgba(22, 50, 74, 0.08);
      }

      .eyebrow {
        margin: 0 0 12px;
        color: #4d7e78;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.78rem;
      }

      h1 {
        margin: 0 0 12px;
        color: #16324a;
        font-size: clamp(2rem, 7vw, 3.25rem);
      }

      p {
        margin: 0;
        color: #35546c;
        font-size: 1.02rem;
      }
    `,
  ],
})
export class FraisKilometriquesShellComponent {}
