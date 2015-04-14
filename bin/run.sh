#!/bin/bash
#
# This "run" script is responsible for running the latest Docker container
# associated with the application, swapping it out for an existing container
# as necessary.
#
# It assumes the following:
# - A Docker container named "sdc-portal" already exists on the
#   local server.
# - Nginx is running, configured to connect to an upstream named
#   "sdc-portal".
#
set -evuo pipefail
IFS=$'\n\t'

OLD_ID=`docker ps | (grep sdc-portal || true) | awk '{ print $1 }'`
NEW_ID=`docker run -d -P --restart=on-failure --name=$(sdc-portal-`uuidgen`) --hostname=$(hostname) sdc-portal`
ADDR=`docker port $NEW_ID 8080`

# TODO(schoon) - Don't name the container until this is successful. As this
# stands, we'll automatically remove the container on the next `run`, rather
# than retaining it for analysis.
wget -q --retry-connrefused --tries=10 --wait=1 --spider $ADDR/up
curl $ADDR/up

cat > /etc/nginx/conf.d/sdc-portal-upstream.conf <<EOF
upstream sdc-portal {
  server  $ADDR  fail_timeout=10s;
}
EOF

service nginx reload

docker kill $OLD_ID
