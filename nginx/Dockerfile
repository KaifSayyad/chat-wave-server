FROM nginx:latest

WORKDIR /etc/nginx/templates

COPY ./dist-* /usr/share/nginx/html/
# Copy the nginx configuration file
COPY /default.conf.template /etc/nginx/templates/default.conf.template
