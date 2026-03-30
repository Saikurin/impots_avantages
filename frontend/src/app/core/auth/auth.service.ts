import { signal } from '@angular/core';
import Keycloak from 'keycloak-js';

type AppConfig = {
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig;
  }
}

const appConfig = window.__APP_CONFIG__ ?? {
  keycloakUrl: 'http://localhost:8080',
  keycloakRealm: 'impots-avantages',
  keycloakClientId: 'impots-avantages-spa',
};

const keycloak = new Keycloak({
  url: appConfig.keycloakUrl,
  realm: appConfig.keycloakRealm,
  clientId: appConfig.keycloakClientId,
});

let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
const authenticated = signal(false);
const displayName = signal('Compte');

function syncAuthState(): void {
  authenticated.set(!!keycloak.authenticated);
  const preferredUsername = keycloak.tokenParsed?.['preferred_username'];
  const email = keycloak.tokenParsed?.['email'];
  const givenName = keycloak.tokenParsed?.['given_name'];
  displayName.set(String(givenName || preferredUsername || email || 'Compte'));
}

function scheduleRefresh(): void {
  if (!keycloak.tokenParsed?.exp || !keycloak.tokenParsed?.iat) {
    return;
  }

  const now = Date.now();
  const expiryMs = keycloak.tokenParsed.exp * 1000;
  const issuedMs = keycloak.tokenParsed.iat * 1000;
  const ttl = Math.max(expiryMs - issuedMs, 60_000);
  const jitter = 0.6 + Math.random() * 0.2;
  const refreshAt = now + Math.max((expiryMs - now) * jitter, 15_000);
  const delay = Math.max(refreshAt - now, 15_000);

  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  refreshTimeout = setTimeout(async () => {
    try {
      await keycloak.updateToken(30);
      scheduleRefresh();
    } catch {
      await keycloak.login();
    }
  }, Math.min(delay, ttl));
}

export const authService = {
  async init(): Promise<void> {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      redirectUri: window.location.origin,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    });

    if (authenticated) {
      syncAuthState();
      scheduleRefresh();
    } else {
      syncAuthState();
    }
  },

  isAuthenticated(): boolean {
    return authenticated();
  },

  authenticated,

  displayName,

  async login(): Promise<void> {
    await keycloak.login({ redirectUri: window.location.href });
  },

  async logout(): Promise<void> {
    authenticated.set(false);
    await keycloak.logout({ redirectUri: window.location.origin });
  },

  async getAccessToken(): Promise<string | null> {
    if (!keycloak.authenticated) {
      return null;
    }

    try {
      await keycloak.updateToken(30);
      syncAuthState();
      scheduleRefresh();
    } catch {
      authenticated.set(false);
      return null;
    }

    return keycloak.token ?? null;
  },
};
