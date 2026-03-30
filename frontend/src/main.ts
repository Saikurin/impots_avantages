import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { authService } from './app/core/auth/auth.service';

registerLocaleData(localeFr);

bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes), { provide: LOCALE_ID, useValue: 'fr-FR' }],
})
  .then(() => authService.init())
  .catch((error) => console.error(error));
