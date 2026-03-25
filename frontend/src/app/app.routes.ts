import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'bundles/frais-kilometriques',
    loadChildren: () =>
      import('./bundles/frais-kilometriques/frais-kilometriques.routes').then(
        (module) => module.fraisKilometriquesRoutes,
      ),
  },
];
