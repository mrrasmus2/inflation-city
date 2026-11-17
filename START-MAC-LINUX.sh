#!/usr/bin/env sh
cd "$(dirname "$0")"
command -v node >/dev/null || { echo 'Install Node.js 18+ from nodejs.org'; exit 1; }
node server.js
