FROM nginx:latest

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY ./dist-* .
# Copy the nginx configuration file
COPY default.conf.template /etc/nginx/templates/default.conf.template
