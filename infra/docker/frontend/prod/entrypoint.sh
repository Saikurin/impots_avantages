#!/bin/sh
set -eu

: "${API_PROXY_PASS:=http://backend:8000}"
: "${KEYCLOAK_FRONTEND_URL:=http://localhost:8080}"
: "${KEYCLOAK_REALM:=impots-avantages}"
: "${OIDC_CLIENT_ID:=impots-avantages-spa}"

envsubst '${API_PROXY_PASS}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

cat > /usr/share/nginx/html/app-config.js <<EOF
window.__APP_CONFIG__ = {
  keycloakUrl: '${KEYCLOAK_FRONTEND_URL}',
  keycloakRealm: '${KEYCLOAK_REALM}',
  keycloakClientId: '${OIDC_CLIENT_ID}'
};
EOF

exec nginx -g 'daemon off;'
