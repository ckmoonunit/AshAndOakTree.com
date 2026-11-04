#!/usr/bin/env bash
# check-site.sh: house-rule checks for the Ash & Oak site.
# Run it before every push:  bash scripts/check-site.sh
# GitHub Actions runs the same script on every push and pull request.
# Exit 0 = clean. Exit 1 = something listed below needs fixing.

cd "$(dirname "$0")/.." || exit 1
fail=0
bad() { echo "FAIL: $*"; fail=1; }

# Text files git tracks (images, PDFs, fonts skipped).
mapfile -t TEXT < <(git ls-files | grep -Ev '\.(jpg|jpeg|png|gif|webp|pdf|ico|woff2?|ttf|otf)$')

# 1. No em dashes or en dashes anywhere. Use periods, commas, colons, parentheses.
hits=$(grep -nP '\x{2014}|\x{2013}' "${TEXT[@]}" 2>/dev/null)
[ -n "$hits" ] && bad "em/en dash found (house rule: none, ever):
$hits"

# 2. Ben is certified, not licensed. The ONLY allowed use is "Licensed Pesticide Applicator".
hits=$(grep -niw 'licensed' "${TEXT[@]}" 2>/dev/null | grep -v 'Licensed Pesticide Applicator' | grep -v '^scripts/check-site.sh:' | grep -v '^AGENTS.md:')
[ -n "$hits" ] && bad "'licensed' claim found (Ben is ISA certified + insured, not licensed):
$hits"

# 3. The review bot owns the reviews block. Markers must exist, in order.
s=$(grep -n 'REVIEWS:START' index.html | head -1 | cut -d: -f1)
e=$(grep -n 'REVIEWS:END' index.html | head -1 | cut -d: -f1)
if [ -z "$s" ] || [ -z "$e" ] || [ "$s" -ge "$e" ]; then
  bad "REVIEWS:START / REVIEWS:END markers missing or out of order in index.html (the review bot stops working)"
fi

# 4. Files and tags that keep the domain, search, and analytics working.
[ "$(tr -d '[:space:]' < CNAME 2>/dev/null)" = "ashandoaktree.com" ] || bad "CNAME must contain exactly ashandoaktree.com"
[ -f d6ef4b7a38e0bb89585a55f6cb74a688.txt ] || bad "IndexNow key file d6ef4b7a38e0bb89585a55f6cb74a688.txt is missing"
grep -q 'name="google-site-verification"' index.html || bad "google-site-verification meta tag missing from index.html"
grep -q 'name="msvalidate.01"' index.html || bad "msvalidate.01 (Bing) meta tag missing from index.html"
grep -q 'cloudflareinsights.com/beacon' index.html || bad "Cloudflare Web Analytics snippet missing from index.html"

# 5. No secrets in the repo. It is public, and GitHub Pages can serve any file in it.
hits=$(git ls-files | grep -E '(^|/)\.env($|\.)' | grep -v '\.env\.example$')
[ -n "$hits" ] && bad ".env file is tracked (secrets go in a gitignored .env, never committed):
$hits"
hits=$(git ls-files | grep -Ei '\.(pem|key|p12|pfx)$|(^|/)secrets?/')
[ -n "$hits" ] && bad "key/secret file is tracked:
$hits"
hits=$(grep -nE 'xsmtpsib-|xkeysib-|sk_live_|sk_test_|rk_live_|whsec_|ghp_[A-Za-z0-9]{20}|github_pat_|gho_[A-Za-z0-9]{20}|xai-[A-Za-z0-9]{20}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY' "${TEXT[@]}" 2>/dev/null | grep -v '^scripts/check-site.sh:')
[ -n "$hits" ] && bad "something that looks like an API key or token is committed:
$hits"

# 6. Every local link points at a file that exists (HTML comments skipped).
for f in $(git ls-files '*.html'); do
  for href in $(perl -0pe 's/<!--.*?-->//gs' "$f" | grep -oE '(href|src)="[^"#?]+' | sed -E 's/^(href|src)="//' | grep -vE '^(https?:|mailto:|tel:|sms:|data:|//|/$)'); do
    target="${href#/}"
    [ -e "$target" ] || bad "$f links to $href, which does not exist"
  done
done

[ $fail -eq 0 ] && echo "check-site: all clear"
exit $fail
