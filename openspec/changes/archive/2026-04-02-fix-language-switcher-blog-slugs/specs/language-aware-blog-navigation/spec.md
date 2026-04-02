## ADDED Requirements

### Requirement: Language switcher resolves blog post alternate slugs
When the user is viewing a blog post and clicks the language switcher, the system SHALL navigate to the translated version of the same article using its `alternateSlug`, not the current slug with a changed prefix.

#### Scenario: Switch from PL to EN on a blog post with translation
- **WHEN** user is on `/blog/srodowisko-agentowe-ai-dwie-firmy` and clicks the language switcher
- **THEN** the system navigates to `/en/blog/agentic-ai-environment-two-companies` (the EN `alternateSlug`)

#### Scenario: Switch from EN to PL on a blog post with translation
- **WHEN** user is on `/en/blog/agentic-ai-environment-two-companies` and clicks the language switcher
- **THEN** the system navigates to `/blog/srodowisko-agentowe-ai-dwie-firmy` (the PL `alternateSlug`)

#### Scenario: Switch language on a blog post with identical PL/EN slug
- **WHEN** user is on `/blog/remotion-explainer-videos-ai` and clicks the language switcher
- **THEN** the system navigates to `/en/blog/remotion-explainer-videos-ai` (same slug, prefix added)

#### Scenario: Switch language on a blog post with no translation available
- **WHEN** user is on a blog post that has no `alternateSlug` or the alternate post does not exist, and clicks the language switcher
- **THEN** the system navigates to the blog listing page in the target language (`/en/blog` or `/blog`)

### Requirement: Non-blog pages use existing prefix-based switching
The language switcher SHALL continue to use the current prefix add/remove behavior for all pages that are not individual blog posts.

#### Scenario: Switch language on homepage
- **WHEN** user is on `/` and clicks the language switcher
- **THEN** the system navigates to `/en/`

#### Scenario: Switch language on blog listing page
- **WHEN** user is on `/blog` and clicks the language switcher
- **THEN** the system navigates to `/en/blog`
