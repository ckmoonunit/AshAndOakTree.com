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
- GitHub access for agents: a **classic** token from the agent owner's account, `public_repo`
  scope only, named `grok-ashandoaktree` (or `<agent>-ashandoaktree`), 90-day expiration.
  Stored as `GITHUB_TOKEN` in the agent's secret store or `.env`. One token per agent.
  Fine-grained tokens do NOT work here (GitHub blocks them for repo collaborators).
- `scripts/check-site.sh` fails on tracked `.env` files, key files, and common token shapes.
  That is a backstop. It does not replace being careful.

## Task process (how work gets assigned, done, and handed back)

The site owner's side defines the tasks. Agents carry them out. No agent invents its own work.

### Where tasks live: GitHub Issues
- Every task is a GitHub Issue on this repo. If it isn't an Issue, it isn't a task.
- Label `grok` = assigned to Grok agents. Label `claude` = assigned to Claude agents.
  No label = not assigned yet, don't touch it.
- One Issue = one change. If a task turns out to be two things, comment that on the Issue
  and do only the first.

### Two kinds of task
| Kind | Examples | How it ships |
| --- | --- | --- |
| **Small** | Copy edits on an existing page using wording from Ben, typo fixes, a new FAQ entry, swapping in a new job photo, updating a service description | Push straight to `main` |
| **Big** | A new page, nav changes, layout or CSS changes, any JS, forms, `<head>` / SEO tags, schema, sitemap, deleting or renaming anything, anything in "Do not touch" | Branch + Pull Request. A human merges. Never push these to `main` yourself |

If you can't tell which kind it is, it's big.

### Doing a small task
1. `git pull --rebase`
2. Comment on the Issue: `Starting this.` (so two agents don't do the same work)
3. Make the change. Only that change.
4. `bash scripts/check-site.sh` must print `check-site: all clear`.
5. Commit. Message starts with the agent and ends with the Issue number:
   `[grok] FAQ: add question about winter pruning (#12)`
6. `git push origin main`. If rejected: `git pull --rebase`, re-run the check, push again.
7. Wait about a minute. Confirm the GitHub Actions check on your commit is green and the
   live page at https://ashandoaktree.com shows the change.
8. Close the Issue with a comment: what changed, which file, the commit hash, the live URL.

### Doing a big task
1. `git pull --rebase`, then `git checkout -b grok/12-short-name` (agent, Issue number, topic).
2. Comment on the Issue: `Starting this on branch grok/12-short-name.`
3. Make the change. Run the check. Commit with the same message format.
4. `git push origin grok/12-short-name` and open a Pull Request into `main`.
   PR description: what changed, why, which pages to look at, and `Closes #12`.
5. Stop there. A human (or the owner's Claude agent, when a human asks it to) reviews.
   Fix any review comments on the same branch. Never merge your own PR.

### When you're blocked
- Missing a fact, a photo, or Ben's wording: comment on the Issue saying exactly what you
  need, add the label `blocked`, and stop. Never fill the gap with a guess.
- The check fails on something you didn't touch: comment on the Issue, don't "fix" other
  people's work.
- Something you pushed broke the live site: `git revert <your commit>`, push, then comment
  on the Issue with what happened.

### Working alongside other agents
- Always `git pull --rebase` right before you start and right before you push.
- Never edit a file another open PR is changing unless your Issue says to.
- The review bot commits to `index.html` daily around 8:00 AM Mountain (commit message
  starts with `Reviews:`). That's normal. Pull and carry on.
- Git identity: set `user.name` to the agent's name (example: `Grok (for Ben Ash)`) so the
  history shows who did what.

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
