export const fraisKilometriquesRoutes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'introduction' },
      { path: 'introduction', component: null },
      { path: 'domicile', component: null },
      { path: 'sites', component: null },
      { path: 'vehicule', component: null },
      { path: 'calendrier', component: null },
      { path: 'resultat', component: null },
    ],
  },
]
