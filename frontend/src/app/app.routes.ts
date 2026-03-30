import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'bundles/frais-kilometriques',
    canMatch: [authGuard],
    loadChildren: (): Promise<Routes> =>
      import('./bundles/frais-kilometriques/frais-kilometriques.routes').then(
        (module) => module.fraisKilometriquesRoutes as Routes,
      ),
  },
];
