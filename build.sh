#!/bin/sh
# פקודת ה-build של Cloudflare Pages (פרויקט achiya-feedback): sh build.sh
# מעתיקה ל-dist רק את קבצי האתר, ומוחקת את קוד הגשרים (bridge.gs) כדי שלא יהיה ציבורי.
set -e
rm -rf dist
mkdir -p dist
cp index.html dist/
cp -r img siyum bitul dist/
rm -f dist/*/bridge.gs
