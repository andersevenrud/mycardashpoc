#!/bin/sh
npm ci --quiet --no-audit --no-fund
exec npm run dev
