import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <main class="home">
      <section class="card">
        <p class="eyebrow">impots_avantages</p>
        <h1>Hello world</h1>
        <p>Le frontend Angular est demarre.</p>
      </section>
    </main>
  `,
  styles: [
    `
      .home {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at top left, rgba(92, 145, 184, 0.18), transparent 32%),
          linear-gradient(180deg, #eef4f8 0%, #f8fbfd 100%);
      }

      .card {
        width: min(560px, 100%);
        padding: 40px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(22, 50, 74, 0.12);
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
        margin: 0 0 12px;
        font-size: clamp(2.5rem, 8vw, 4rem);
        line-height: 0.95;
        color: #16324a;
      }

      p {
        margin: 0;
        font-size: 1.05rem;
        color: #35546c;
      }
    `,
  ],
})
export class HomeComponent {}
