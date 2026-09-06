# Backlink & Authority Analysis — pawel.lipowczan.pl

Date: 2026-09-05
Credential tier: **Tier 0 — Basic (Common Crawl + Verify only)**. No Moz API key,
no Bing Webmaster key, no DataForSEO configured. This means: no DA/PA, no spam
score, no comprehensive referring-domain index. Moz and Bing calls were not
attempted (would fail on auth). WebSearch was not available as a tool in this
session, so open-web discovery of new mentions (Polish tech media, hackathon
writeups, aggregators, republished articles) could **not** be performed this
run — this is a real coverage gap, not a "clean profile" finding.

## 1. Common Crawl domain-level graph

Source: `commoncrawl_graph.py` (Common Crawl, release cc-main-2026-jan-feb-mar),
confidence 0.50 by convention — but here there is no data at all to weight.

```json
{
  "domain": "pawel.lipowczan.pl",
  "in_crawl": false,
  "in_rankings": false,
  "pagerank": null,
  "harmonic_centrality": null,
  "top_referring_domains": [],
  "note": "Domain not found in Common Crawl data."
}
```

**What this does and does not mean:** the domain is absent from Common Crawl's
graph in this release. This is **not** evidence of low authority, few
backlinks, or a penalty. Common Crawl's web-graph release only indexes a
sample of the web and lags real crawl activity; a domain can be absent because
it's a low-traffic personal site, because CC simply hasn't sampled a page that
links to it, or because the `.pl` ccTLD segment is thin in this release. Do
not read `in_crawl: false` as "in-degree 0" — it is "not measured," full stop.

**Verdict:** no PageRank, no harmonic centrality, no referring-domain list —
**INSUFFICIENT DATA** for any domain-level score from this source.

## 2. Verified inbound signals (entity/profile links)

Source: `verify_backlinks.py` (local crawler, confidence 0.95 for the raw
HTTP/anchor observation, direct measurement not an estimate). Candidates were
the three profile URLs the site itself publishes in `src/utils/constants.js`
and `src/pages/Home.jsx` (GitHub, LinkedIn, Twitter/X) — chosen because they
are the only externally-hosted, publicly-checkable pages tied to this identity
that are known ahead of a working search tool. This is **not** a backlink
discovery pass; it only confirms whether the author's own declared profiles
link back to the site.

| Source | Status | HTTP | Link found | Detail |
|---|---|---|---|---|
| github.com/plipowczan | verified | 200 | yes | Anchor is the bare URL, `rel="me nofollow"` |
| twitter.com/pawellipowczan | verified | 200 | yes | Anchor text `pawel.lipowczan.pl/blog`, `rel="noopener noreferrer"` |
| linkedin.com/in/pawellipowczan | link_removed | 200 | no (as fetched) | **Likely false negative, not a confirmed absence** |

The LinkedIn result must be read with a specific caveat, confirmed by
`validate_backlink_report.py` (status FAIL, error flagged): LinkedIn profile
pages are JS-rendered and gate most content behind a login wall for
unauthenticated fetches. A 200 status with no link found on a social platform
should be treated as `unverifiable_js`, not as proof the link is absent. I am
not claiming the LinkedIn profile lacks a link to the site — I could not
verify it either way with this tool.

GitHub's `rel="me"` is a real, structured identity-verification signal
(IndieAuth-style `rel=me` reciprocal link) — this is genuine evidence the
GitHub profile is authoritatively tied to this domain. It is also
`nofollow`, so it passes no authority signal in a classic PageRank sense; its
value is identity consistency, not link equity.

## 3. Entity-consistency assessment

Confidence 0.85 (direct observation of the site's own declared identity
surface, cross-checked against two of three profiles resolving live).

- The handle `pawellipowczan` / `plipowczan` is used consistently across
  GitHub, LinkedIn, and Twitter/X, and the site's own copy names the person
  consistently ("Paweł Lipowczan").
- Two of three cross-links back to the domain are **verified live**
  (GitHub, Twitter/X). LinkedIn is **unverified, not confirmed absent**.
- No third-party corroboration (press mentions, directory listings,
  aggregator profiles) was checked in this run — WebSearch was unavailable.
  This is the single biggest gap in the entity picture: for a personal
  consultancy, entity strength normally rests on third parties naming the
  person consistently (conference bios, guest-post bylines, community
  directories), and none of that could be checked here.

**Bottom line:** the self-declared identity graph is internally consistent
and partially verified. Whether that identity is corroborated externally is
**not measurable in this run** — re-run with WebSearch or a Tier 1+ data
source to close this gap.

## 4. Toxic / unexpected inbound links

**None observed.** This is a limitation statement, not a clean bill of
health: at Tier 0 with no referring-domain index and no completed web search,
there was no inbound-link inventory to screen for toxicity in the first
place. I did not check any known link source that could have produced a
suspicious result. Do not report this as "no toxic links found" — report it
as "toxic-link screening not performed; no data source available at Tier 0
covered inbound links other than the three self-declared profiles checked
above."

## 5. Backlink Health Score

**Not scored.** Per the Tier 0 rule, fewer than 4 of the 7 scoring factors
have any data (referring-domain count: no data; domain quality distribution:
no data; anchor-text naturalness: 1 data point, insufficient; toxic-link
ratio: no data; link velocity: no data; follow/nofollow: 2 data points from
self-declared profiles only; geographic relevance: no data). Producing a
numeric score here would be exactly the misleading output the workflow
prohibits.

## 6. Realistic link-acquisition angles (non-spammy, fit for this author/site)

Given the actual content: ~30 bilingual posts on AI agents, Claude Code, RAG,
and automation; a free 8-lesson course (LLM Wiki / second-brain course);
real, named client case studies and testimonials.

1. **Guest post or co-authored piece for a Polish dev/tech outlet** (e.g. a
   Polish-language technical publication in the AI/dev-tools space) built
   around one case study, not the homepage — pitch the specific outcome, not
   "check out my site."
2. **HackNation and adjacent hackathon organizer pages/writeups** — if the
   author has participated in or mentored at hackathons, ask organizers to
   link the participant/mentor bio to the site; this is a legitimate,
   already-expected link, not solicited.
3. **GitHub template repo (`second-brain-template`) README and Show HN /
   relevant subreddit post** — the repo is already public; a README that
   properly credits and links the course and blog is a natural, durable
   link that lives in a place people actually click through from.
4. **Course-directory and free-resource aggregators for AI/LLM learning**
   (e.g. "awesome-llm" style curated lists on GitHub, or newsletter
   roundups covering practical AI tooling) — pitch the free 8-lesson course
   as a concrete resource, not the domain in general.
5. **LinkedIn recommendations/testimonials already collected** — the site
   already sources testimonials from LinkedIn recommendations
   (`src/data/testimonials.js`); asking those same named clients to link the
   case study from their own company blog or LinkedIn post (when they
   publish about the engagement) is a natural, relationship-based link, not
   a scheme.
6. **Podcast or livestream guest appearances** on Polish or English
   AI/dev-tools shows — show notes routinely link guest sites; this fits an
   author who already publishes long-form technical content.
7. **Directly answer developer-community questions** (Stack Overflow,
   relevant Discord/Slack communities, r/LocalLLaMA-style subreddits) linking
   to a specific blog post that solves the exact question asked — value-first,
   not homepage-drop.

**Rejected as link-scheme behaviour:** any paid guest-post network, PBN or
directory mass-submission service, reciprocal-link exchanges unrelated to an
actual working relationship, and any "SEO backlink package" — none of these
fit a named individual consultancy and all carry real penalty risk with no
verifiable authority in return.

## Data sources & confidence summary

| Claim | Source | Confidence |
|---|---|---|
| CC graph absent for domain | Common Crawl (`commoncrawl_graph.py`) | 0.50 (measurement of absence, not of authority) |
| GitHub rel=me backlink verified | Verify crawler (`verify_backlinks.py`) | 0.95 |
| Twitter/X backlink verified | Verify crawler (`verify_backlinks.py`) | 0.95 |
| LinkedIn backlink status | Verify crawler | 0.20 — flagged as likely false negative (JS/login wall), confirmed by `validate_backlink_report.py` |
| DA/PA/spam score | Not available — no Moz key | n/a |
| Bing inbound links, competitor gap | Not available — no Bing key | n/a |
| DataForSEO metrics | Not available — not installed | n/a |
| New public mentions (media, aggregators, hackathon writeups) | Not checked — WebSearch unavailable this run | n/a |
| Overall Backlink Health Score | Not computed — insufficient factors | n/a |

## Validator run

`validate_backlink_report.py` was run against the collected CC + verify data.
Result: **FAIL**, 1 error, 1 info — both are addressed above (LinkedIn
false-negative caveat; CC absence-is-not-low-authority caveat). No further
correction was needed beyond stating these explicitly in the report body.
