## ADDED Requirements

### Requirement: lastmod is never fabricated

When the sitemap generator cannot determine a modification date for a URL from
its declared source, it SHALL fail and name the URL and the source it could not
read. It SHALL NOT substitute the current date, the build date, or any other
placeholder.

This capability already states where each `lastmod` comes from: a post's own
frontmatter or commit date, a legal page's source file commit date, a listing
page's freshest post. Those requirements are not in question. What is missing is
what happens when the lookup fails — and a silent fallback to the current date
turns an unreadable history into a date that looks deliberate, which is worse
than no sitemap entry at all. Thirty-four of thirty-eight non-blog URLs carrying
one identical date is the observable result.

#### Scenario: Source history is unavailable

- **WHEN** the generator cannot read a commit date for a URL's source file, for
  example because the checkout has insufficient history
- **THEN** the build fails and names the URL and the source file
- **AND** no sitemap is written

#### Scenario: Several URLs share one source file

- **WHEN** multiple URLs derive their `lastmod` from a single source file
- **THEN** each URL's `lastmod` reflects that file's own modification date
- **AND** a date is never assigned to a URL whose source was not read

#### Scenario: All sources resolve

- **WHEN** every URL's source date is readable
- **THEN** the sitemap is written and the build succeeds
