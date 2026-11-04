# AGENTS.md: rules for any AI agent working on this site

This file is for every agent that edits this repo: Claude, Grok, or anything else. Read
all of it before your first change. If something here conflicts with a request, stop and
ask the person who asked. Don't guess.

## What this is

- The marketing website for **Ash & Oak Tree Care** (legal name Fraxinus Pursuits LLC),
  owned and run by **Ben Ash**. Live at https://ashandoaktree.com.
- Plain static HTML, CSS, and a little vanilla JS. No framework, no build step, no npm.
- Hosted on **GitHub Pages** from the `main` branch. `CNAME` points the domain here.
- **Every push to `main` is live for customers in about one minute.** No staging site,
  no preview. Treat each push as publishing.
- **This repo is PUBLIC.** Anyone on the internet can read every file and every commit,
  forever (deleting a file later does not remove it from history).

## The short version (read this if nothing else)

1. `git pull --rebase` before you start. Two people and their agents push here.
2. Make one small, focused change. Do not "clean up" things you weren't asked to touch.
3. Run `bash scripts/check-site.sh`. It must print `check-site: all clear`.
4. Commit with a plain message that says what changed and why, then push.
5. Never commit a secret. Never touch the files in "Do not touch" below.
6. Never invent facts, reviews, prices, credentials, or stats. Only use what's in this file
   or what Ben gave you in writing.
7. No em dashes or en dashes, ever.

## Secrets and .env (read this twice)

- This site needs **zero** secrets to run. Nothing in the site itself uses an API key.
- Your own credentials (GitHub token, xAI/Grok API key, Anthropic key, anything else) live
  in a `.env` file in your local clone, or in your agent platform's secret store.
  **Never in a committed file.**
- `.env` and `.env.*` are gitignored. `.env.example` is the only env file that gets
  committed, and it holds placeholder NAMES only, never real values.
- Never paste a key into HTML, JS, a comment, a commit message, a PR description, or this file.
- If a key ever gets committed or pushed: tell the human right away and **rotate the key**
  (make a new one, kill the old one). Deleting the line is not enough because git history
  is public.
- GitHub access, smallest that works:
  - **Agent runs git on a machine (best):** an SSH **deploy key** with write access, added
    by the repo owner under Settings > Deploy keys. It works on this one repo and nothing
    else. Only the public half (`.pub`) is ever shared; the private half stays on that machine.
  - **Agent only takes a token:** a **classic** token with only the `public_repo` scope,
    named for what it is (example: `grok-ashandoaktree`), 90-day expiration. Fine-grained
    tokens do NOT work here: GitHub blocks them on repos where you're a collaborator.
  - One key or token per agent, so one can be revoked without breaking the others.
- `scripts/check-site.sh` fails on tracked `.env` files, key files, and common token shapes.
  That is a backstop. It does not replace being careful.

## How to work

```bash
git pull --rebase                 # get everyone else's changes first
# ...make your edit...
bash scripts/check-site.sh        # must print: check-site: all clear
git add <the files you changed>   # name them. No `git add -A` or `git add .`
git commit -m "Services: add winter pruning note from Ben"
git push origin main
```

- If the push is rejected, run `git pull --rebase` and push again. Never `git push --force`.
- To undo a bad change: `git revert <commit>` and push. Never rewrite history on `main`.
- GitHub Actions runs the same check on every push. A red X on a commit means something
  live is breaking a rule. Fix it with a new commit right away.
- After a push, wait ~1 minute and load the live page to confirm it looks right.
- Keep commits small. One topic per commit, so one revert undoes one thing.

## Verified business facts (the only facts you may use)

- Business: Ash & Oak Tree Care. A family business. Opened April 2025.
- Owner: Ben Ash.
- Phone (work): **(435) 258-9679**. Never use any other number.
- Email: **ben@ashandoaktree.com** (forms and leads), **support@ashandoaktree.com**.
- Offices: 561 W 300 N, Logan, UT 84321 and 1906 E Foxmoor Circle, Sandy, UT 84092.
- Service area: **Logan to Provo along the Wasatch Front.**
- Ben's credentials:
  - **ISA Board Certified Master Arborist, UT-4661B.** Say it in full. Never shorten it
    to "Certified Arborist" (that's a lower credential).
  - Former City Forester for American Fork City.
  - B.S. Landscape Architecture and Environmental Science.
  - Licensed Pesticide Applicator. This is the ONLY "licensed" claim allowed. Never call
    Ben or the business "licensed" otherwise. He is certified and insured.
  - Insured: general liability and workers compensation.
  - "Fewer than 20 BCMAs in Utah" came from Ben. OK to use.
- Consults: **$95 for up to 1.5 hours, credited toward any work booked.** No free visits,
  no next-day promises.
- Call to action everywhere: **"Request a consult"** (links to `request-quote.html`).
- Slogan: **"Success starts with the roots."** (with, not at)
- If a fact isn't listed here and Ben didn't hand it to you in writing, it doesn't go on
  the site. No made-up years of experience, job counts, awards, review quotes, star
  ratings, guarantees, or "trusted by hundreds".

## Writing style

- **No em dashes or en dashes. Ever.** (The long dash characters, Unicode U+2014 and U+2013.) Use periods, commas, colons, parentheses.
  A plain hyphen is fine inside words and in page titles ("Tree Care FAQ - Ash & Oak").
- The brand name keeps its ampersand: **"Ash & Oak"** (in HTML: `Ash &amp; Oak`).
  Everywhere else, write "and", never "&".
- Plain, warm, direct. Write like a person who knows trees, not a brochure.
- No AI tells: no "it's not just X, it's Y", no "delve", no "elevate your outdoor space",
  no lists of three for rhythm, no stacked puns, no hype.
- Don't lecture or boss customers ("Make sure you...", "You should..."). Explain and offer.
- When Ben gives you his own wording, use it as written, even if it breaks a style rule.
  His voice beats the style guide.

## Do not touch

| Thing | Why |
| --- | --- |
| The block between `<!-- REVIEWS:START -->` and `<!-- REVIEWS:END -->` in `index.html` | A review bot rewrites it daily from real Google reviews. Your edits get overwritten. Deleting the markers breaks the bot. Never write review quotes or ratings anywhere else either. |
| `CNAME` | Holds the domain. Breaking it takes the site offline. |
| `d6ef4b7a38e0bb89585a55f6cb74a688.txt` | IndexNow key (Bing and others use it). |
| `<meta name="google-site-verification">` and `<meta name="msvalidate.01">` | Keep Google and Bing search ownership verified. |
| The Cloudflare Web Analytics `<script>` at the bottom of each page | Site analytics. Every real page has it. Copy it onto any new page. |
| `.nojekyll` | Tells GitHub Pages to serve files as-is. |
| `favicon.ico` and `assets/img/favicon-*.png` | Google only accepts favicons in multiples of 48px. Don't resize or replace them without being asked. |
| `pay.html` | Parked. Not linked, not wired. Leave it. |
| Redirect stubs (`commercial.html`, `design-consultations.html`, `process.html`, `review.html`) | Old URLs that forward to new pages. `review.html` is printed as a QR code on business cards. Never delete or retarget them. |

## Site map

| File | Page |
| --- | --- |
| `index.html` | Home |
| `services.html` | Tree Care (7 service cards, young trees, maintenance plans) |
| `residential-design.html` | Residential Design |
| `commercial-design.html` | Commercial Design |
| `request-quote.html` | Request a consult (main lead form) |
| `request-quote-thanks.html` | Thank-you page after a form submit (noindex) |
| `contact.html` | Contact |
| `faq.html` | FAQ (has FAQPage schema in `<head>`, keep it in sync with the visible answers) |
| `service-areas.html` | Service areas (footer link) |
| `privacy.html`, `terms.html` | Legal |
| `404.html` | Not found |
| `assets/css/site.css` | All styles, one file |
| `assets/js/site.js` | Nav and small page behavior |
| `assets/js/forms.js` | Shared form handling (see Forms) |
| `assets/js/quote-form.js` | Consult form: validation, photo shrinking, subject line |
| `assets/img/` | Logos, favicons, `team/` (Ben), `work/` (job photos) |
| `sitemap.xml`, `robots.txt` | Search engines |

Top nav is **Tree Care | Residential Design | Commercial Design**. Don't add nav items
without being asked.

## Forms

- All lead forms POST to `https://formsubmit.co/ben@ashandoaktree.com` (free, no account).
- Don't change the form `action`, the hidden `_next` / `_captcha` / `_subject` fields, or
  the `LIVE` flag in `forms.js`. Changing the email address in `action` silently sends
  leads into a void until FormSubmit re-activates it.
- Never switch to a paid form service.
- Consult subject format: `Consult request: City - Name` (plain hyphen).

## Editing pages

- Copy the `<head>` of a similar existing page as your starting point. Every page has:
  title, meta description, canonical URL, Open Graph and Twitter tags, favicons.
- **Cache-busting:** CSS and images are linked with `?v=YYYYMMDD` (example:
  `site.css?v=20261020c`). If you change `site.css` or replace an image file, bump the
  `?v=` value on every page that links it, or visitors keep the old version.
- **New page checklist:** canonical URL, unique title and description, the analytics
  script, add it to `sitemap.xml`, link to it from at least one existing page.
- **Deleting or renaming a page:** don't. Old URLs are in Google. Ask first; the answer is
  usually a redirect stub instead.
- Check that it works on a phone-width screen. Most visitors are on phones.
- Relative links (`services.html`, `assets/...`). The check script fails on links to
  files that don't exist.

## Photos

- Only Ben's real job photos and photos of Ben. No stock images, no AI-generated images
  presented as real work.
- **Strip location data (EXIF GPS) before committing:** `exiftool -all= -overwrite_original photo.jpg`.
  Customer homes are in these photos.
- Resize before committing (about 1600px on the long side, JPEG quality ~80). Keep files
  under ~400 KB.
- Name files plainly: `assets/img/work/removal-maple-logan.jpg`, not `IMG_4032.jpg`.
- Every `<img>` gets a real `alt` describing the photo, plus `loading="lazy"` below the fold.
- Logo files: check they have real transparency before using them (some "transparent"
  PNGs have a fake checkerboard painted in).

## What not to put in this repo

It's public. So, never:
- Secrets of any kind (see above).
- Internal planning, pricing strategy, customer names, customer addresses, or job notes.
  `NEED-TO-DO.md`, `FUTURE-IDEAS.md`, `internal/` and `marketing/` are gitignored for this
  reason. Keep it that way.
- Personal email addresses or personal phone numbers. Public contact is the work phone
  and the @ashandoaktree.com addresses only.

## When you're not sure

Ask the human who gave you the task. Leaving something alone is always fine. Pushing a
guess onto a live business website is not.
