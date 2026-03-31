---
id: 18
slug: remotion-explainer-videos-ai
title: "Remotion + AI: How to Create Professional Videos with Code and Claude"
excerpt: "I created a 45-second explainer video in minutes. No Adobe, no Canva - just React, Remotion, and Claude Code. Here's how."
category: AI
author: Pawel Lipowczan
date: 2026-01-31
readTime: 11 min
image: /images/og-remotion-explainer-videos-ai.webp
tags:
  - AI
  - Remotion
  - Video
  - Automation
  - Claude Code
lang: en
alternateSlug: remotion-explainer-videos-ai
---

# Remotion + AI: How to Create Professional Videos with Code and Claude

Professional video for thousands of dollars? Or maybe in minutes and for free?

From my own experience, I know that producing marketing video is one of the most frustrating parts of running a business. You either pay a production studio or spend weeks learning After Effects. Or you just give up.

I chose a different path. I created a **45-second explainer video** for my consulting website in minutes. No Adobe, no Canva, no animation knowledge. Just React, **Remotion**, and **Claude Code**.

You can see the result at [konsultacje.lipowczan.pl/explainer](https://konsultacje.lipowczan.pl/explainer).

Traditionally, creating an explainer looks like this: you come up with a concept, write the script, create a storyboard, design graphics, animate each element frame by frame, export, fix things, export again. A minimum of several days of work. Realistically - weeks.

My method? I describe what I want to see, AI generates the code, I render the video. All during lunch.

In this article, I'll show you the complete workflow - from installation through writing prompts to exporting the finished video. If you run a business and need marketing video but don't have the budget for a production studio or time to learn tools - this guide is for you.

## What is Remotion?

**Remotion** is a library for creating video in React. Instead of dragging elements onto a timeline like in Premiere, you describe them in code. Instead of animating manually, you define rules - and Remotion generates smooth transitions.

Sounds technical? In practice, it's simpler than traditional video editing.

```text
Traditional approach: Idea -> Storyboard -> Recording -> Editing -> Export (days/weeks)
Remotion + AI: Idea -> Prompt -> Code -> Rendering (minutes)
```

The difference is fundamental. In traditional tools, you tell it **how** to animate each frame. In Remotion, you describe **what** you want to see - the tool calculates interpolation, timing, and transitions on its own.

What's more, everything is **programmable**. Want to change the brand color? One variable. Want to generate 50 video versions with different product names? A JavaScript loop. Want to add dynamic data from an API? Import and render.

It's the ideal tool for the **vibe coding** approach I described [in a separate article](/blog/vibe-coding-przewodnik). You don't need to be a React expert - just describe what you want, and the AI will generate working code.

Remotion is open-source and free for personal use. A paid license is only required for companies with revenue above $1M per year - so you probably don't need to worry about it.

## See the Result: Sample Explainer

Before we get to installation, see what you can create. I generated this video in minutes using Claude Code and Remotion:

<video controls width="100%" style="max-width: 100%; height: auto;" playsinline>
  <source src="/videos/remotion-explainer.mp4" type="video/mp4" />
  Your browser does not support the video player.
</video>

### The Prompt Used to Create It

Here's the exact prompt I used to describe the video:

```markdown
Create a 45-second explainer video about creating video with Remotion and AI.

**Scenes:**

1. (0-8s) **Problem**
   - Text "Professional video?" with glitch effect
   - Underneath, animated icons: clock + dollar sign + question mark
   - Fade out to darkness

2. (8-16s) **Traditional approach (crossed out)**
   - Horizontal timeline with icons: Idea -> Storyboard -> Editing -> Export
   - Red line crosses out everything
   - Text "Weeks of work" fades away

3. (16-28s) **New approach - hero moment**
   - Large text "Remotion + AI" with gradient glow (#00ff9d -> #00b8ff)
   - Three animated cards fly in from the bottom (staggered, 0.3s delay):
     - "React" with icon
     - "Remotion" with video icon
     - "Claude Code" with AI icon
   - Subtle particle effect in the background

4. (28-38s) **Workflow demo**
   - Terminal simulation with code (font: Fira Code)
   - Typing animation: `npx remotion render...`
   - Progress bar 0% -> 100%
   - Text "45 seconds -> Finished video" with pulsing glow

5. (38-45s) **CTA**
   - Logo/text "pawel.lipowczan.pl" with gradient underline
   - Text "More on the blog" fade in
   - Subtle network mesh animation in the background

**Visual style:**

- Dark mode, background: #0a0e1a
- Primary accent: #00ff9d (gradient to #00b8ff)
- Glassmorphism on cards (backdrop-blur, border-white/10)
- Typography: Inter (headers), Fira Code (code)
- Animations: smooth easing, spring physics for element entries

**Format:** 16:9 (1920x1080)
**Pace:** Dynamic, tech-forward
**Music:** None (optionally ambient synth loop)

**Brand colors (hex):**

- Primary: #00ff9d
- Secondary: #00b8ff
- Background: #0a0e1a
- Dark surface: #151b2b
- Text: #ffffff
- Muted text: #9ca3af
```

See how detailed the prompt is? Each scene has timing, element descriptions, and effects. That's the key to good results.

### Important Note: Use the Skill Explicitly

During testing, I noticed an important detail. When I sent a prompt without explicitly referencing the `remotion-best-practices` skill, Claude started scanning the entire repository and preparing an unnecessary plan. Only when I explicitly invoked the skill (`/remotion-best-practices`) did Claude immediately start building the project correctly with animations.

**Takeaway:** If you have the Remotion skill installed, always invoke it consciously instead of relying on automatic context detection.

### Commands for Working with Remotion

After the code is generated, you have three options:

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Launches Remotion Studio - live preview with hot reload   |
| `npm run build`     | Renders video to MP4 (default out/video.mp4)              |
| `npm run build:gif` | Renders animated GIF (smaller file, lower quality)        |

Remotion Studio is the best way to iterate - you see changes instantly and can scrub the timeline.

## Installation and First Steps

Before you start, you'll need **Claude Code** (Anthropic's CLI) or **Claude Desktop with MCP**. If you haven't set up your environment yet, check out my article on [5 techniques for working with Claude Code](/blog/5-technik-pracy-z-claude-code).

Installation consists of two steps. First, create a Remotion project:

```bash
npx create-video@latest
```

This is a standard Remotion command that creates a new project with the entire file structure - React components, configuration, and sample video.

Then install the skill for Claude Code:

```bash
npx skills add remotion-dev/skills
```

What happens during installation? **Skills** are Claude Code extensions that add specialized knowledge. The `remotion-best-practices` skill teaches the AI best practices for creating animations in Remotion - component structure, timing, interpolation, and export.

How does it work in practice? You simply describe the video you want to create. Claude automatically recognizes the Remotion context and uses knowledge from the skill to generate code. There are no special commands to remember - you write prompts in natural language.

Example workflow:

```text
1. Open Remotion project in Claude Code
2. Describe video: "Create a 30-second logo animation with glow effect"
3. Claude generates React components with animations
4. Launch preview: npx remotion studio
5. Render: npx remotion render src/index.ts MyVideo out/video.mp4
```

**Important:** You don't need to know React at an advanced level. Basic understanding of components and props is enough. The AI does the rest. In practice, my prompts don't contain a single line of code - I only describe the visual effect.

## Prompt Engineering for Video

This is where the real work begins. Video quality depends directly on prompt quality. The AI can't read your mind - it needs specific instructions.

### Anatomy of a Good Prompt

Every good video prompt contains four elements:

1. **Scene breakdown with timing** - the AI needs to know what happens at which second
2. **Visual style** - colors, mood, aesthetic
3. **Brand assets** - specific hex values, not "green"
4. **Format and purpose** - 16:9 for YouTube, 9:16 for Stories

Example of a structured prompt:

```markdown
Create a 45-second explainer video for a consulting website.

**Scenes:**

1. (0-10s) Logo animation with gradient #00ff9d -> #00cc7d
2. (10-25s) 3 main services as animated cards
3. (25-40s) Testimonial or statistic
4. (40-45s) CTA with contact button

**Style:** Professional, minimalist, dark mode
**Format:** 16:9 (YouTube/website)
**Pace:** Calm, business-oriented
```

See the difference between "make a nice video about my company" and this prompt? The first will give random results. The second will give you exactly what you need.

### Pawel's Prompt Template

This is the prompt I used to create my website's explainer. You can copy and adapt it:

```markdown
For the current project create a 45-second explainer video based on the content.

The video should:

- Extract and use the brand colors from the site
- Highlight the main services/products
- Include key selling points
- Use professional, elegant animations
- End with a clear call-to-action

Aspect ratio: 16:9
Style: PROFESSIONAL
```

This prompt works especially well when you already have a website or design system. Claude Code analyzes the project context and extracts colors, typography, and style from existing files.

Key phrases that help:

- **"Extract from site"** - the AI will search the project and use existing values
- **"Professional, elegant"** - vibe descriptors are more effective than detailed instructions
- **"Clear call-to-action"** - the AI knows the ending should drive action

## Use Cases

Remotion + AI isn't just for explainers. Here are practical applications I've tested or seen in action.

### For Entrepreneurs and Consultants

**Explainer videos** - short videos explaining a service. Perfect for landing pages, where 30-60 seconds of animation can replace a paragraph of text.

**Product demos** - show how your product works without screen recording. Animated mockups look more professional and don't become outdated with every UI update.

**Case study visualizations** - instead of a boring PowerPoint presentation, animate statistics and charts. "Revenue increased 340%" has more impact as an animation than as a bullet point.

### For Content Creators

**Animated title sequences** - intros for YouTube videos. Instead of buying a template on Envato, you'll generate a unique opener matching your brand.

**Lower thirds** - name and title captions. Once generated, you can reuse them with different data.

**Social media content** - Stories and Reels in 9:16 format. Remotion renders in any aspect ratio.

### For SaaS and Products

**Feature announcements** - a new feature deserves more than a blog post. A 15-second teaser looks professional and generates engagement.

```markdown
Create a 15-second new feature teaser for LinkedIn.

Scene 1: Feature name as large text with glow effect
Scene 2: 3 bullet points with benefits (staggered animation)
Scene 3: "Available now" with product logo

Format: 1:1 (LinkedIn feed)
Colors: Product palette (#1a1a2e, #16213e, #0f3460, #e94560)
```

**Onboarding videos** - short animations explaining next steps. Easier to update than recordings with voiceover.

**Release notes as video** - changelog in animated list form. Users are more likely to watch a 30-second video than read a list of changes.

## Tips for Better Results

After a dozen or so video projects with AI, I've gathered a set of practices that consistently improve results.

1. **Always specify timing** - the AI defaults to overly long scenes. Without specific seconds, you'll get a 3-minute video instead of a 45-second one.
2. **Describe brand assets specifically** - hex colors (#00ff9d), not "green." The AI interprets "blue" in 50 different ways.
3. **Use "vibe" descriptions** - "Apple-like minimalism" is more effective than detailed instructions about kerning and leading. The AI knows the aesthetics of top brands.
4. **Iterate in small steps** - one video, one change. Don't try to fix everything with a single prompt. "Make the logo animation faster" > "Fix the video."
5. **Test different formats** - 16:9 is not the same as 9:16 in terms of content structure. Vertical video requires a different element layout, not just cropping.
6. **Export at the right quality** - 1080p for web, 4K for presentations. Higher resolution = longer render, but YouTube compresses anyway.

If you want more on AI-driven animations, check out my article on [creating Apple-style animations](/blog/animacje-apple-ai-cursor). I describe a similar workflow with Google Flow and Cursor there.

## What Remotion Won't Do

Let's be realistic - Remotion + AI doesn't replace a production studio in every scenario.

**Limitations:**

- **Complex motion graphics** - advanced 3D effects, particle systems, morphing are out of reach. This isn't After Effects.
- **Real footage editing** - Remotion isn't a video editor. It won't cut your camera recordings.
- **Voice generation** - the library doesn't generate voice. You need external TTS (ElevenLabs, Murf, etc.).
- **Photo-realistic graphics** - you're generating animations, not films. No cameras, actors, or film sets.

**Workarounds:**

- **Combine with external tools** - ElevenLabs generates voiceover, Remotion handles animation. Merge in Premiere or DaVinci.
- **Use as an animation layer** - Remotion excels at overlaying animated elements on existing video.
- **Hybrid approach** - simple scenes in Remotion, complex ones in traditional tools. Mix and match.

Remotion is ideal for: explainers, motion graphics, data visualization, UI animations, product teasers. It's not ideal for: documentaries, vlogs, content with real footage.

## Summary

Creating professional marketing video doesn't have to cost thousands or take weeks. With Remotion and Claude Code, you can have a finished explainer during lunch.

**Key takeaways:**

1. **Remotion + AI = video in minutes instead of days** - the declarative approach eliminates manual animation
2. **You don't need to be an animator or a programmer** - the AI generates code, you describe the effect
3. **Good prompts = good results** - scene structure, timing, hex colors, vibe descriptors
4. **Start with simple projects** - logo animation, title card, then explainer
5. **Iterate** - the AI doesn't have to nail it on the first try, but it will by the third
6. **Format matters** - 16:9 vs 9:16 vs 1:1 requires a different approach to layout

The democratization of video production is one of the most interesting AI trends. Just a year ago, I was convinced that video was the domain of Adobe specialists. Today I know that anyone with access to Claude Code can create something that looks professional.

Start small - an animated logo, a 10-second teaser. Get a feel for the tool. Then scale up.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to create professional video for your business?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I'll help you implement AI in your marketing content creation process - from strategy through implementation to production automation.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Resources

**Official sources:**

- [Remotion Official Docs](https://remotion.dev/docs) - Official library documentation
- [Remotion Skills Repository](https://github.com/remotion-dev/skills) - Installation and Skills examples for Claude Code
- [My explainer video](https://konsultacje.lipowczan.pl/explainer) - The final result of the workflow from this article

**Related articles:**

- [Apple-style animations with AI](/blog/animacje-apple-ai-cursor) - A similar workflow with Google Flow and Cursor
- [Vibe Coding guide](/blog/vibe-coding-przewodnik) - The coding-with-AI philosophy underlying this approach

## FAQ

<details open>
<summary>

### Do I need to know programming to use Remotion with AI?

</summary>

No, Claude Code generates the code for you. All you need is the ability to write good prompts and a basic understanding of the effect you want to achieve. React works "under the hood" - you describe scenes, timing, and style, and the AI translates that into working code.

</details>

<details open>
<summary>

### How much does it cost to create video with Remotion and do I need a paid license?

</summary>

Remotion is open-source and free for personal and commercial use for companies with revenue below $1M per year. A paid license is only required for larger organizations. Claude Code requires a Claude Pro subscription ($20/month) or usage through the API with your own key.

</details>

<details open>
<summary>

### Can I use the generated video commercially and who owns the rights?

</summary>

Yes, video created with Remotion fully belongs to you. You can use it commercially without restrictions. Just make sure that the assets used (fonts, icons, music) have appropriate licenses - the AI may suggest resources that require additional rights.

</details>

<details open>
<summary>

### How long does it take to render a 45-second video and what does it depend on?

</summary>

Typically 2-5 minutes for simple animations on a modern laptop with 8GB+ RAM. Time depends on effect complexity, resolution (4K takes longer than 1080p), and number of elements. For large projects, you can render in the cloud via Remotion Lambda - faster, but paid.

</details>

<details open>
<summary>

### Can Remotion generate video with voiceover and how do I add voice to animation?

</summary>

Remotion doesn't generate voice - it's an animation library, not TTS. You can combine it with ElevenLabs, Murf, or other text-to-speech services, generate an audio file, and then synchronize it with the animation in Remotion. The AI will help you write the code for syncing audio with scenes.

</details>

<details open>
<summary>

### How does Remotion differ from Canva or CapCut, and when should you choose which tool?

</summary>

Canva and CapCut are visual editors with ready-made templates - great for one-off quick edits without writing code. Remotion is a programming tool that gives you full control, repeatability, and automation. Choose Remotion when you need to generate many video variants, integrate with API data, or build a consistent video production system.

</details>
