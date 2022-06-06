FROM alpine:3.16

RUN apk add --no-cache mpd=0.23.7-r1
RUN rm -rf /var/cache/apk/*
COPY mpd.conf /etc/mpd.conf

USER mpd
VOLUME ["/var/lib/mpd"]
EXPOSE 6600/tcp
EXPOSE 8000/tcp
CMD ["mpd", "--stdout", "--no-daemon"]
