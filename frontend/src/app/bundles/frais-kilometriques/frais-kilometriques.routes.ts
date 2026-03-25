import { Routes } from '@angular/router';

import { FraisKilometriquesDomicileComponent } from './frais-kilometriques-domicile.component';
import { FraisKilometriquesCalendrierComponent } from './frais-kilometriques-calendrier.component';
import { FraisKilometriquesIntroComponent } from './frais-kilometriques-intro.component';
import { FraisKilometriquesResultatComponent } from './frais-kilometriques-resultat.component';
import { FraisKilometriquesSitesComponent } from './frais-kilometriques-sites.component';
import { FraisKilometriquesVehiculeComponent } from './frais-kilometriques-vehicule.component';

export const fraisKilometriquesRoutes: Routes = [
  {
    path: '',
    component: FraisKilometriquesIntroComponent,
  },
  {
    path: ':simulationId/domicile',
    component: FraisKilometriquesDomicileComponent,
  },
  {
    path: ':simulationId/sites',
    component: FraisKilometriquesSitesComponent,
  },
  {
    path: ':simulationId/vehicule',
    component: FraisKilometriquesVehiculeComponent,
  },
  {
    path: ':simulationId/calendrier',
    component: FraisKilometriquesCalendrierComponent,
  },
  {
    path: ':simulationId/resultat',
    component: FraisKilometriquesResultatComponent,
  },
];
