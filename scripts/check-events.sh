#!/bin/sh

set -e

python3 scripts/check-events.py fortune_generator/json/custom_special.json custom
python3 scripts/check-events.py fortune_generator/json/cyclical_special.json cyclical
python3 scripts/check-events.py fortune_generator/json/static_special.json static
