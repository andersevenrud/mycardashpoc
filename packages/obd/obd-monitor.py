#!/usr/bin/env python3
# Based on: https://github.com/zaneclaes/node-pi-obd-monitor
import sys
import obd
import time
import threading
from datetime import datetime
from bottle import route, run, abort
from prometheus_client import start_http_server, Gauge

baudrate = 9600
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

        connection = obd.OBD(baudrate=baudrate)
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
            abort(500, 'No connection')
            return

        response = connection.query(obd.commands.GET_DTC)
        if response.is_null():
            abort(500, 'No response')
            return

        return {'result': response.value}


@route('/clear', method='POST')
def clear():
    with lock:
        if connection.status() != obd.utils.OBDStatus.CAR_CONNECTED:
            abort(500, 'No connection')
            return

        connection.query(obd.commands.CLEAR_DTC)

        return {'result': True}


if __name__ == '__main__':
    obd.logger.setLevel(obd.logging.INFO)
    timer = Gauge('exporter_collection_time',
                  'How much time it takes to collect metrics')

    start_http_server(http_port)  # prometheus

    p.start()

    # Continuously poll the metrics.
    while True:
        try:
            obd.logger.setLevel(obd.logging.INFO)
            if connect():
                obd.logger.setLevel(obd.logging.WARNING)

                start = datetime.now()

                for metric_name in metrics:
                    metrics[metric_name].update()

                end = datetime.now()
                diff = end - start
                timer.set(diff.total_seconds() * 1000)
        except Exception as e:
            print(e)
            sys.exit(1)

        time.sleep(poll_interval)
