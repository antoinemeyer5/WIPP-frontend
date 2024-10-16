#!/bin/sh
if [ $# -ne 2 ]
then
  echo "Illegal number of parameters. Exiting..."
  echo "Command: ./entrypoint.sh \${backend_host} \${backend_port}"
  exit 1
fi

# Update WIPP backend URL in nginx conf
BACKEND_HOST=$1
BACKEND_PORT=$2

sed -i \
  -e 's/@backend_host@/'"${BACKEND_HOST}"'/' \
  -e 's/@backend_port@/'"${BACKEND_PORT}"'/' \
  /etc/nginx/conf.d/default.conf

sed -i \
    -e "s|@KEYCLOAK_URL_VALUE@|${KEYCLOAK_URL}|g" \
    /var/www/frontend/main.*.js

sed -i \
    -e "s|@IIP_URL_VALUE@|${IIP_URL}|g" \
    /var/www/frontend/main.*.js

# Update external tools URLs and options in frontend conf
sed -i \
  -e 's|TENSORBOARD_URL|'"${TENSORBOARD_URL}"'|' \
  -e 's|JUPYTERHUB_URL|'"${JUPYTERHUB_URL}"'|' \
  -e 's|VISIONUI_URL|'"${VISIONUI_URL}"'|' \
  -e 's|CATALOGUI_URL|'"${CATALOGUI_URL}"'|' \
  -e 's|ARGOUIBASE_URL|'"${ARGOUIBASE_URL}"'|' \
  -e 's|DISPLAY_LOCAL_IMPORT_OPTION|'"${DISPLAY_LOCAL_IMPORT_OPTION}"'|' \
  /var/www/frontend/assets/config/config.json

nginx -g 'daemon off;'
