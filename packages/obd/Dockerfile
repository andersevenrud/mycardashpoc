# Based on https://github.com/zaneclaes/node-pi-obd-monitor
FROM alpine:3.16.0

RUN apk add --no-cache \
  python3 \
  py3-pip \
  py3-pyserial \
  git

RUN rm -rf /var/cache/apk/*

RUN pip3 install --upgrade \
  setuptools \
  wheel \
  prometheus_client \
  pyserial

RUN git clone https://github.com/brendan-w/python-OBD.git && \
    cd python-OBD && \
    pip3 install -e ./

COPY obd-monitor.py /usr/bin/obd-monitor.py
RUN chmod +x /usr/bin/obd-monitor.py
CMD /usr/bin/obd-monitor.py

EXPOSE 8000
