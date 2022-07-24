FROM alpine:3.16

RUN apk add --no-cache mpd
RUN rm -rf /var/cache/apk/*

USER mpd
VOLUME ["/var/lib/mpd"]
EXPOSE 6600/tcp
EXPOSE 8000/tcp
CMD ["mpd", "--stdout", "--no-daemon"]
