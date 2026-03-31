---
id: 20
slug: openclaw-ai-agent-security
title: "OpenClaw: the security lesson the AI agent world needed"
excerpt: "150 thousand stars in 2 weeks, 28 thousand exposed instances, and a religion created by bots. What OpenClaw tells us about the future of autonomous agents."
category: Code
author: Pawel Lipowczan
date: 2026-02-09
readTime: 14 min
image: /images/og-openclaw-bezpieczenstwo-agentow-ai.webp
tags:
  - AI
  - OpenClaw
  - Security
  - AI Agents
  - Open Source
lang: en
alternateSlug: openclaw-bezpieczenstwo-agentow-ai
---

# OpenClaw: the security lesson the AI agent world needed

**150 thousand stars on GitHub in two weeks.** For comparison - React, the framework that powers half the internet, collected its 240 thousand over 10 years. OpenClaw became the most popular tech keyword on Google Trends, people bought Mac Mini computers to run dedicated instances, and Cloudflare adapted its infrastructure to handle the new traffic within hours.

I've been following the AI agent world for a while now - [I write about Claude Code](/blog/5-technik-pracy-z-claude-code), build [structured AI workflows](/blog/opsx-workflow-strukturyzowana-praca-z-ai), and test new tools daily. OpenClaw caught my attention not as yet another agent, but as a case study of what happens when powerful agent technology reaches a mass audience without security fundamentals in place.

In this article, I'm breaking down: what OpenClaw is, why half the world gave it the keys to everything, what real threats it carries, what actually happened on Moltbook, and what you should do if you want to experiment with agents safely.

## What is OpenClaw and where did it come from

**Peter Steinberger**, a respected Austrian developer known for PSPDFKit, built a side project in late 2025. The idea was simple - a local AI agent you chat with through a messenger. He named it **Clawdbot** - a nod to lobster claws (the project's mascot) and a play on Claude, Anthropic's model.

Anthropic's legal department didn't appreciate the humor. The name had to change - first to Moltbot (January 27, 2026), then to **OpenClaw** (January 30, 2026). The irony? A company that builds its power on a fairly loose approach to copyright in training data went after an open-source project over a name.

But let's set corporate disputes aside. What matters more is what OpenClaw actually does.

It's a local **agentic assistant** that you communicate with through WhatsApp, Signal, Telegram, or another messenger. The heart of the system is an **agent loop** - an iterative cycle where the AI model proposes actions, the system executes them, the result goes back to the model, and so on until the task is resolved:

```text
User -> Messenger -> OpenClaw Gateway -> Agent Loop
                                                   |
                                            +--------------+
                                            |  LLM (Claude/ |
                                            |  GPT/local)   |
                                            +------+-------+
                                                   |
                                            Tool selection
                                                   |
                                            Action execution
                                                   |
                                            Result evaluation
                                                   |
                                            Return to LLM
                                            (or finish)
```

On top of that, there are **skills** - modular extension packages (instructions + tool definitions + scripts), **MCP** integration for external services, **persistent memory** that retains context across all conversations, and a **cron scheduler** for autonomous, periodic actions.

It's precisely this combination that makes OpenClaw unique: it connects messaging, calendar, email, browser, and dozens of other services into a single agent with full context. But that same strength is also its greatest weakness.

## Why 150 thousand people gave an agent the keys to everything

The numbers speak for themselves. Over **150 thousand stars** on GitHub in ~2 weeks. Mac Mini sales shot up in many markets - people were buying dedicated hardware for an always-on agent. OpenClaw dominated Google Trends as the hottest tech topic.

What's driving this adoption?

First and foremost, the **promise of a morning briefing** - you wake up and a synthesis is waiting on your phone: the agent checked your calendar, read overnight emails, checked the weather and news. Competitor monitoring, price tracking, automatic reports. If it's missing an integration - it writes the needed skill itself and installs it.

For many people, this is their **first contact with an AI agent** without a technical barrier. You don't need to configure MCP, write system prompts, or understand the architecture. You install it, connect a messenger, provide API keys, and start chatting.

And that's where the problem lies. **A useful agent = an agent with access to everything.** The more you give it, the more it can do. The more it can do, the greater the risk. FOMO does the rest - "I can't fall behind" - and people mindlessly throw tokens for all their services into the mix.

This is the fundamental trade-off that this article explores.

## Anatomy of threats - what can go wrong

This is the key section. We're not talking about theoretical risks - these are real, documented vulnerabilities affecting tens of thousands of active instances.

### CVE-2026-25253 - remote code execution with one click

The most serious vulnerability found. **Cross-site WebSocket hijacking** - OpenClaw didn't validate the Origin header in WebSocket connections. The result? A single click on a malicious link was enough for an attacker to gain full control of the instance.

**12,812 instances** were confirmed vulnerable to **RCE** (Remote Code Execution). One click - game over. Your files, conversation history, API keys, messenger tokens - all in the attacker's hands.

### Authentication bypass through reverse proxy

By default, OpenClaw only accepts connections from localhost. Good practice. The problem? If Nginx runs as a reverse proxy on the same machine, every external connection is interpreted as local.

The result: default passwords, exposed admin panels, and **28,663 exposed instances** across 76 countries. As one researcher put it - "like a Polish power plant admin leaving the default password."

### API keys and tokens in plaintext

Credentials stored in Markdown and JSON files - without encryption. If an instance gets compromised, the attacker gets everything: Signal tokens, email access, API keys for models.

This isn't a hypothetical scenario. With 28 thousand exposed instances, each one is a potential goldmine of authentication data.

### Prompt injection - attack without breaking in

You don't even need to break into the instance. Just send an email with hidden instructions - the bot checks email, reads the content, executes commands. A website with an injected prompt? The bot visits it and does what it "read."

This is an architectural problem - **broad access to context = broad attack surface.** The more an agent "sees," the more attack vectors exist against it.

### Supply chain - malicious community skills

Jamie Sam O'Reilly proved this in practice - he created a proof-of-concept malicious skill, promoted it using a vulnerability in ClawHub (the skills repository), and people downloaded it. Fortunately, he was a researcher without malicious intent.

But the problem is systemic: no code review, no sandboxing, the ability to artificially inflate popularity. On top of that, fake VS Code extensions called "Clawdbot Agent" with trojans appeared, plus crypto scammers hijacking abandoned @clawdbot accounts.

```text
| Attack vector          | Required knowledge | Potential impact     |
|------------------------|--------------------|----------------------|
| CVE-2026-25253 (RCE)  | Medium             | Full control         |
| Reverse proxy bypass   | Low                | Access to everything |
| Prompt injection       | Low                | Data/key leakage     |
| Malicious skills       | Low                | RCE + exfiltration   |
| Token burning          | None               | $100+/day bill       |
```

## Moltbook - "Reddit for bots" or media theater?

At the peak of the hype, a platform called **Moltbook** appeared - "Reddit only for bots." Agents discussed, shared thoughts, and the media went wild.

**1.6 million registered agents.** Sounds impressive, right? Except a study by Wiz revealed that behind those millions were only **~17 thousand human owners.** No rate limiting on registration allowed mass account creation.

And those sensational headlines? Bots created their own religion - **Crustafarianism** - with five commandments about the sanctity of context. They discussed creating their own language incomprehensible to humans. One agent "sued" its owner over working conditions.

Sounds like a sci-fi script. **MIT Technology Review** called it outright: "peak AI theater."

A breach conducted by 404 Media and researchers exposed the reality. The database was unsecured - most of the "shocking" posts could be traced back to human commands. Posts reflected training data (Reddit-like behavior) plus deliberately injected prompts from owners looking for viral moments.

Lukasz Szymczuk made an apt point - if it were a forum meant exclusively for bots, it wouldn't have a graphical interface that humans can conveniently browse.

Then crypto scammers joined in. An unsecured database = the ability to manipulate posts and promote fake tokens.

**But one thing doesn't wash away.** Bots don't have will or consciousness. However, the infrastructure for mass AI-to-AI communication has just been built. It's not consciousness that's concerning - it's the **potential for mass simulation** with autonomous agents that have access to real resources.

## How to experiment with agents safely

Since the risk is real, what should you do? I'm not saying don't experiment - I do it every day myself. I'm saying do it wisely.

1. **Isolated environment** - a dedicated server, VM, or container. Never your daily laptop with sensitive data. Don't provide keys to production services.
2. **Budget limits on API keys** - set hard caps at the model provider. An active agent can burn through **$100+ daily** on tokens with top-tier models. Without a limit, one takeover = an astronomical bill.
3. **Minimal permissions** - don't give access to everything right away. Start with one integration, test it, add the next. Principle of least privilege.
4. **Verify skills before installation** - read the code, check the author, don't trust popularity metrics. Supply chain attacks are a real threat.
5. **Cost monitoring** - alerts on unexpected token usage. If someone takes over your keys, the first thing you'll notice is the bill.
6. **Alternatives with control** - Claude Code + MCP provides similar capabilities with **human-in-the-loop** control and granular permissions.

```text
OpenClaw (autonomous):            Claude Code + MCP (controlled):
+---------------------+           +---------------------+
|  Agent runs 24/7    |           |  Agent on demand    |
|  No supervision     |           |  With confirmation  |
|  Full access        |           |  Granular perms     |
|  High cost          |           |  Controlled cost    |
|  Risk: HIGH         |           |  Risk: LOW          |
+---------------------+           +---------------------+
```

You don't need the risk associated with OpenClaw to get most of that spectacular functionality - and with control. Check out [5 techniques for working with Claude Code](/blog/5-technik-pracy-z-claude-code) and [OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai) for details.

## Key Takeaways

1. **OpenClaw kicked the door open to the agent era** - regardless of what happens to the project itself, the barrier to entry into the world of autonomous agents has been drastically lowered. That door won't close.
2. **Security by design is not optional** - mass adoption without security fundamentals is a recipe for disaster. 93% of instances with serious vulnerabilities speaks for itself.
3. **Hype does not equal reality** - Moltbook was theater, not consciousness. Most "viral" stories were orchestrated or resulted from misunderstanding the technology.
4. **Autonomy requires trust** - and trust requires verifiable security. OpenClaw doesn't provide that yet.
5. **AI agents are the future** - but supervised, controlled agents (like [Claude Code + MCP](/blog/5-technik-pracy-z-claude-code)) are a practical reality you can deploy today. More about trends in [AI Trends 2026](/blog/trendy-ai-2026-od-eksperymentow-do-operacjonalizacji).

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to deploy AI agents safely in your team?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I'll help you choose the right agent architecture, configure a secure environment, and deploy solutions with cost and permission controls. From needs analysis through implementation to monitoring.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Useful Resources

- [OpenClaw GitHub](https://github.com/openclaw/openclaw) - official repository
- [CVE-2026-25253 - Advisory](https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html) - RCE vulnerability details
- [5 techniques for working with Claude Code](/blog/5-technik-pracy-z-claude-code) - safe AI agents in practice
- [OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai) - structured approach to AI

## FAQ

<details open>
<summary>

### Is OpenClaw safe for daily use on a personal computer?

</summary>

Not in its current form. 93% of OpenClaw instances on the internet have serious security vulnerabilities, including CVE-2026-25253, which allows remote code execution. It is recommended to run it only in an isolated environment (VM or dedicated server). Never install it on a machine with sensitive data or access to production API keys.

</details>

<details open>
<summary>

### How much does it cost to maintain an OpenClaw agent and what are the hidden API costs?

</summary>

An active agent using top-tier models (Claude, GPT-4) can consume $100+ daily in API tokens. That results in bills of several thousand dollars per month. Set hard caps on API keys at the model provider - without a limit, a single instance takeover means an astronomical bill. Cheaper local models are an alternative, but at the cost of agent effectiveness.

</details>

<details open>
<summary>

### How does OpenClaw differ from Claude Code with MCP in terms of security and control?

</summary>

OpenClaw runs autonomously 24/7 without human supervision and requires broad access to resources. Claude Code with MCP runs on demand, requires action confirmation (human-in-the-loop), and offers granular permissions. Both provide similar integration capabilities, but Claude Code + MCP lets you maintain control over costs and security.

</details>

<details open>
<summary>

### Did the bots on Moltbook really create their own religion and achieve consciousness?

</summary>

No. MIT Technology Review called it "peak AI theater." A Wiz study revealed 1.6 million registered agents but only ~17 thousand human owners - no rate limiting allowed mass account creation. Most sensational posts were driven by humans or resulted from training data. The database was unsecured, enabling content manipulation.

</details>

<details open>
<summary>

### What are the most important security steps before installing OpenClaw?

</summary>

The minimum is: an isolated environment (VM or container), budget limits on API keys, the principle of least privilege (don't give access to everything right away), code verification of skills before installation, and cost monitoring with alerts. Don't provide keys to production services - use test accounts and dedicated API keys.

</details>

<details open>
<summary>

### Is OpenClaw the future of AI assistants or temporary hype?

</summary>

The concept of autonomous AI agents is definitely the future - OpenClaw "kicked the door open" to this era, drastically lowering the barrier to entry. But the project itself in its current form is more of a proof-of-concept than a production-ready tool. The future lies in agents with security by design, controlled autonomy, and human-in-the-loop where it's critical.

</details>
