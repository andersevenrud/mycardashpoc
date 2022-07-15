#!/usr/bin/env python3
# Based on: https://github.com/zaneclaes/node-pi-obd-monitor
import obd
import logging
import time
import threading
from bottle import route, run
from prometheus_client import start_http_server, Gauge

api_http_port = 8080
http_port = 8000
poll_interval = 1.0
connection = None
metrics = {}


p = threading.Thread(target=run, kwargs=dict(
    host='0.0.0.0', port=api_http_port))

lock = threading.Lock()


class CommandMetric():
    def __init__(self, command, metric_prefix='obd_'):
        self.command = command
        self.response = None
        self.metric = None
        self.unit = None
        self.name = command.name.lower()
        self.metric_prefix = metric_prefix
        self.log = logging.getLogger('obd.monitor.' + self.name)
        self.log.info('metric initialized')

    def update(self):
        self.response = connection.query(self.command)
        if self.response.unit:
            if not self.unit:
                self.unit = self.response.unit
            elif self.unit != self.response.unit:
                raise Exception('{0} unit changed from {1} to {2}'.format(
                    self.name, self.unit, self.response.unit))

        if self.response.value is None:
            return

        if isinstance(self.response.value, obd.Unit.Quantity):
            if self.metric is None:
                self.metric = Gauge(self.metric_prefix + self.name, self.unit)
            self.metric.set(self.response.value.magnitude)
        elif isinstance(self.response.value, bool):
            if self.metric is None:
                self.metric = Gauge(self.metric_prefix + self.name, self.unit)
            self.metric.set(1 if self.response.value else 0)


def connect():
    with lock:
        global connection, metrics
        if connection and connection.status() == obd.utils.OBDStatus.CAR_CONNECTED:
            return True
        log.info('connecting to car...')
        connection = obd.OBD(baudrate=9600)
        if connection.status() != obd.utils.OBDStatus.CAR_CONNECTED:
            return False
        metrics = {}
        for command in connection.supported_commands:
            metric = CommandMetric(command)
            metrics[metric.name] = metric


@route('/read')
def read():
    with lock:
        if connection.status() != obd.utils.OBDStatus.CAR_CONNECTED:
            return {'error': 'no connection'}

        response = connection.query(obd.commands.GET_DTC)
        if response.is_null():
            return {'error': 'no response'}

        return {'result': response.value}


@route('/clear', method='POST')
def clear():
    if connection.status() != obd.utils.OBDStatus.CAR_CONNECTED:
        return {'error': 'no connection'}

    connection.query(obd.commands.CLEAR_DTC)

    return {'result': 'True'}


if __name__ == '__main__':
    obd.logger.setLevel(obd.logging.INFO)
    log = logging.getLogger('obd.monitor')

    log.warning('starting prometheus on port %s' % http_port)
    start_http_server(http_port)  # prometheus

    p.start()

    # Continuously poll the metrics.
    while True:
        first_connection = False if connection else True
        if connect():
            for metric_name in metrics:
                metrics[metric_name].update()

        time.sleep(poll_interval)
