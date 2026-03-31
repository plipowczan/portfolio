---
id: 7
slug: hackathon-hacknation-experience-analysis
title: Hackathon Hacknation - Experience Analysis and a Lesson in Digitalization
excerpt: See how in 24 hours a team of non-programmers built a working budget system with AI, and why technology isn't everything. An honest analysis of successes and failures from Hacknation.
category: AI
author: Pawel Lipowczan
date: 2025-12-12
readTime: 10 min
image: /images/og-hackathon-hacknation-analiza-doswiadczen.webp
tags:
  - Hackathon
  - AI
  - GovTech
  - Case Study
  - Digitalization
lang: en
alternateSlug: hackathon-hacknation-analiza-doswiadczen
---

# Hackathon Hacknation - Experience Analysis and a Lesson in Digitalization

Hackathon Hacknation, organized by GovTech Poland, was a massive event. Over 1,500 participants, 480,000 PLN in the prize pool, and one goal: build a working solution for public administration challenges in 24 hours.

For our team -- which I'd describe as junior-level programmers -- it was more than a competition. It was a testing ground.

I'm a "retired" programmer. I stopped actively coding about 4 years ago, which in the tech world is practically light years -- tools and frameworks have changed so much that you essentially need to start from scratch. While software engineering experience is very helpful, without knowledge of current languages and environments, you're sometimes working blind.

The other team members had never had much to do with traditional programming. In their day-to-day work, they use no-code technologies supported by language models.

![Hacknation Team](/images/hacknation-team.webp)

Together, we confronted our expectations of "intelligent" AI agents with harsh reality.

Here's the story of how technology met bureaucracy, why lack of validation can kill the best project, and what we learned about collaborating with AI under time pressure.

## 1. Mrs. Zosia and Thousands of Spreadsheets - Problem Analysis

Our challenge involved the budgeting process in public administration. Sounds boring? Maybe, but the scale of the problem is enormous.

The core problem turned out to be a process based on manually exchanging hundreds of thousands of Excel files. Errors, information chaos, lack of transparency -- that's daily life for government officials. We created a metaphor for this process, which we called **"Mrs. Zosia and Thousands of Spreadsheets"**:

1. **Start (Bottom):** "Mrs. Zosia" at the municipal office "reads tea leaves," manually entering budget data into Excel (e.g., a request for a new computer).
2. **Escalation (Top):** The file travels up the hierarchy: Municipal Office -> Regional Office -> Ministry of Finance.
3. **Consolidation:** A special unit at the ministry merges data from all files (often manually!).
4. **Decision and Return (Bottom):** Budget limits travel back the same way, often with arbitrary cuts. In the end, "Mrs. Zosia" learns she won't get the new computer, but nobody can explain why.

## 2. The Solution: Digital Budget

We went with a simple but radical solution: **Digital Budget**. Instead of sending files around, let's move the entire process to the cloud.

Our concept was built on a centralized web application with several key features:

* **Single source of truth:** All budget items are entered in one system, visible (with appropriate permissions) to every level.
* **Transparency and communication:** The ability to comment on and discuss each budget item directly in the system, instead of in emails.
* **Approval workflow:** A simplified process for approving and consolidating the budget.

Interestingly, we also employed AI to choose the challenge itself. We analyzed the available challenges against our team's competencies (mostly "non-programmers") to maximize our chances. The choice fell on budgeting, where understanding the business process seemed more important than complex algorithms.

## 3. The Atmosphere, Sweat, and Sleep Deprivation

![Hackathon Ending](/images/hacknation-end.webp)

The atmosphere at Hacknation was incredible. A huge hall, open space, a stage, constant talks -- the energy of a thousand people "fired up about technology" was contagious. It was this vibe that kept us going even as fatigue grew with every hour.

<video controls width="100%" style="max-width: 100%; height: auto;" playsinline>
  <source src="/videos/hacknation-start.mp4" type="video/mp4" />
  Your browser does not support the video player.
</video>

We worked non-stop for 24 hours. We slept 2-3 hours in the hallway or a dedicated sleeping room, where someone's phone alarm kept going off.

Initially, each of us dove into work "freestyle," creating our own pieces of code. But we quickly realized that was a dead end. The turning point came when we decided to consolidate our efforts around Justyna's prototype, which was the most advanced. It became the foundation of our final solution.

## 4. AI as an "Equalizer" - Technology in Practice

Our main thesis to test was: **AI is an equalizer**. A tool that allows a team with less coding experience (non-programmers) to compete with professional dev teams.

Our technology stack:

* **Frontend:** React, TypeScript
* **Backend:** Supabase
* **Presentation:** Video generated in HiGen

We used heavy AI artillery:

* **Pawel and Kuba:** Antigravity (Gemini Pro / Claude 4.5 models). We burned through the entire weekly token limit in a dozen hours.
* **Justyna:** Bolt (Claude Code model). Record consumption of **18 million tokens**.

### A Contrarian Take on AI

Did AI write the application for us? Not exactly. Despite the enthusiasm, we felt slightly disappointed.

* **Code often didn't work:** AI generated solutions that looked correct but fell apart at runtime.
* **Hallucinations:** Suggested libraries didn't exist, and pieces of logic were completely off.
* **Hand-holding required:** Achieving a correct result demanded precise prompting and constant course correction.
* **Blockers:** Justyna hit a bug in _current user_ filters that the model couldn't diagnose. We had to go back to basics -- reading code and debugging manually.

AI is a powerful force multiplier, but not a magic wand. Without technical skills and critical thinking, we would have gotten stuck halfway.

## 5. The Biggest Weakness - Lack of Validation

Our final score was **2.15 / 5 points**. We didn't make the finals. Why?

The technology worked. The presentation was great. One crucial element was missing: **VALIDATION**.

The team didn't have access to a practitioner -- a government official who works with budgets day-to-day. The mentor assigned to the challenge wasn't a domain expert. As a result, we built a system that seemed logical to us but could have been completely disconnected from administrative reality ("off-target").

This is the most important lesson: **Validation > Technology**. Even the best code can't save a solution that doesn't address real user needs.

## 6. Plan for the Next Hackathon

Learning from experience, we prepared an improved process for the future:

### 1. Challenge Selection

* Define team roles (strengths/weaknesses).
* Scrape challenges and analyze them with an AI agent for team fit.
* _Takeaway:_ We had this stage down pat.

### 2. Business Analysis (This Is Where We Failed!)

* Prepare a current-state process map (AS-IS).
* Design the target process (TO-BE).
* Write User Stories.
* **PRD (Product Requirements Document):** What are we building and why?
* **SRS (Software Requirements Specification):** How are we building it?
* Prepare "skills" for AI agents.

### 3. Development

* Start with a prepared boilerplate (don't waste time on setup!).
* Iterative development of functional requirements.
* AI-generated automated tests.
* Continuous Code Review.

### 4. Documentation and Verification

* Review for security and performance.
* Prepare documentation (optional).

## Summary and Takeaways

Hacknation was an invaluable lesson for us. It confirmed that AI lets you do things that were impossible just a year ago -- a small team built a working web application in 24 hours. At the same time, it exposed a brutal truth: in the world of product development, **technology is secondary to understanding the problem**.

Other teams that came with ready-made components and better business analysis homework won. The "freestyle" approach is romantic, but in a match against preparation -- it loses.

AI is the future of programming, but it's still the human who must be the pilot who knows where they're flying.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to implement AI in your organization?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I can help you find real AI applications for your business, avoid common pitfalls, and deploy solutions that deliver measurable results. From concept through prototype to production.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## FAQ

<details open>
<summary>

### Can AI allow non-programmers to compete with professional teams at hackathons?

</summary>

AI is an equalizer -- a team without coding experience can build a working web application in 24 hours. However, AI isn't a magic wand: code often doesn't work, models hallucinate non-existent libraries, and achieving results requires constant course correction. Without technical skills and critical thinking, you'll get stuck halfway.

</details>

<details>
<summary>

### What is the biggest mistake teams make at tech hackathons?

</summary>

Failing to validate the solution with the end user. You can build a technically working system that's completely disconnected from reality -- "off-target." Teams win not with the best code, but with better business analysis. Validation > Technology: even the best code can't save a solution that doesn't address real needs.

</details>

<details>
<summary>

### How much does AI actually help when building a project in 24 hours?

</summary>

AI is a powerful force multiplier -- you can consume 18 million tokens and generate tons of code. But it requires hand-holding: proposed solutions look correct but fall apart at runtime. Debugging still requires manually reading code. AI accelerates development but doesn't eliminate the need for technical fundamentals.

</details>

<details>
<summary>

### What preparation process increases your chances of winning a hackathon?

</summary>

Four stages: (1) selecting a challenge matched to team competencies, (2) business analysis with AS-IS/TO-BE process maps and user stories, (3) development with a prepared boilerplate and tests, (4) documentation and verification. The critical mistake is skipping stage 2 -- business analysis determines success more than code quality.

</details>

<details>
<summary>

### Why is understanding the problem more important than technology at hackathons?

</summary>

Technology is secondary to understanding the user's problem. Teams with ready-made components and better business analysis win over teams with better code that didn't validate their solution. The "freestyle" approach is romantic, but in a match against preparation, it loses.

</details>
