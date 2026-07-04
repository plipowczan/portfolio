---
id: 26
slug: polish-pit-38-claude-code-case-study
title: "3 days to PIT-38, no accountant. 2 hours were enough."
excerpt: >-
  5430 transactions, 5 data sources, two days with a Claude Code
  agent. A case study of the workflow that replaced my accountant on PIT-38.
category: AI
author: Pawel Lipowczan
date: 2026-04-29
readTime: 14 min
image: /images/og-pit-38-claude-code-case-study.webp
tags:
  - Claude Code
  - AI
  - Workflow
  - Case Study
  - Automation
  - PIT-38
lang: en
alternateSlug: pit-38-claude-code-case-study
---

Today is 29 April 2026. The PIT-38 filing deadline expires tomorrow. The day before yesterday in the evening I started with a single sentence - _"create a new PIT-38 project"_. Yesterday afternoon the return was filed with the Polish tax office, the tax was paid, and the official receipt (UPO) was sitting in `output/`. Total **~2 hours** of active work.

**5,430 transactions** across two crypto exchanges. **174,895.50 PLN** of unused crypto cost basis carried forward from 2024. **2 PIT-8C forms** from brokers, **1 supplementary report** on foreign dividends. Filed and accepted by the tax office **51.5 hours** before the deadline. Final tax due: **172 PLN**.

My accountant usually handles this. This year I missed the timing window - and that turned out to be one of the more instructive experiences I've had with an agentic workflow.

This article is not about how I learned to file a PIT-38. I knew what to do, because I've been doing it for years (through my accountant). It's about how **two hours of active work with a properly configured agent** reproduced the work of an expert service - with better documentation than I usually got from my accountant.

> Quick context for non-Polish readers: **PIT-38** is the Polish annual tax form for capital gains income - stocks, mutual funds, foreign dividends, and crypto. It's notoriously fiddly because of multi-source income, foreign currency conversion via central bank D-1 rates, and a multi-year cost-basis carry-forward mechanism for crypto. Filing deadline is 30 April for the previous tax year.

## My accountant usually files my PIT-38

I file a PIT-38 every year. Stocks, funds, crypto, foreign dividends. Never alone. Always through my accountant - I send her the documents, she fills out the form, double-checks, files. It works.

This year I missed the timing. Deadline 30 April, and I started gathering documents on 27 April in the evening. No accountant will take a project with a 3-day buffer - and rightly so. I was forced to do it myself.

Two paths: (a) panic and a hasty last-minute filing, or (b) test whether the AI workflow I use to build things for clients can replace my accountant in two days. I picked (b). It worked.

That changes the article's stakes. This is **not** a "lifehack for people who don't want to hire an accountant." It's a **case study of when AI automation realistically reaches into expert-level service work** that until now was handled by humans.

## Project architecture: every directory has one responsibility

I started with the prompt _"create a new PIT-38 project"_. No brief, no requirements doc, no task list. The agent asked about the tax year and deadline, reached for the internal `_template.md` convention (which it knows from the repo's `CLAUDE.md`), and laid out:

```text
PIT_38/
  inbox/          # drop zone, raw files
  archive/        # post-processing (agent does NOT read)
  data/           # knowledge - agent reads freely
  deliverables/   # checklist, blog inputs
  output/         # final return PDF, UPO
  project.md      # goal, status, decisions
  catalog.md      # file index
```

Every directory has one responsibility. The agent does not look inside `archive/` or `output/` unless I explicitly ask it to. This is **not security** - it's **context hygiene**. The agent works on clean, processed `data/*.md` files, not on 4,096 rows of raw CSV with every question.

It sounds banal. It isn't. Without that separation, every question like _"what were the March transactions?"_ would pull the entire raw CSV into context - either blowing the token budget or forcing the model to "sum on its fingers." With separation: the agent gets a finished `data/crypto-summary-2025.md` with 11 line items and works on structure, not on raw input.

That's the first multiplier of value - and it works **only because** the convention is described in `CLAUDE.md`. Without that file, this project would have taken as long as doing it manually.

![Workflow funnel: 5 independent data sources converge into /ingest, the agent classifies 5,430 raw transactions into 11 taxable events, the return is filed with the Polish tax office with a 174,895 PLN cost-basis buffer rolled forward to 162,948 PLN](/images/diagram-pit-38-funnel-en.webp)

## `/ingest`: one command, four steps

I dropped 7 files into `inbox/`: two PIT-8C forms (XTB and SFIO), three CSVs from crypto exchanges, the dividend report, and last year's filed return as historical reference. Command: `/ingest PIT_38`.

What happens under the hood:

1. **File type identification** - the agent recognises a PIT-8C from its header structure, a crypto report from typical column patterns (timestamp, asset, type, amount).
2. **Routing** - PIT-8C goes to section C of the return, crypto reports to section E, dividends to section G. Each file gets its own `data/{source}-{kind}-2025.md` with normalisation.
3. **Extraction** - key items (revenue, cost, withholding tax) are pulled from PDFs, transaction types are classified from CSVs.
4. **Archiving** - raw files move from `inbox/` to `archive/`, `catalog.md` is updated, `project.md` gets a changelog entry.

A concrete example: PIT-8C from both XTB and SFIO ended up summed in `pit38-calculation.md` in section C, using line numbers consistent with the **PIT-38 form version (18)** for tax year 2025. The agent itself noticed that this was not the same form layout as 2024 - more on that shortly.

The lesson at this stage: `/ingest` is **not batch processing**. The value lives in the iterative loop, which I'll show next.

## Six things I didn't expect from the agent

This is the heart of the article. Six concrete things the agent did across those two days that, had I worked alone with Excel, I either wouldn't have done at all or would have done with errors.

### 1. The 174,895.50 PLN buffer - auto-pulled from PIT-38 2024

Under Polish PIT law, unused crypto cost basis rolls forward indefinitely (Art. 22 §16 of the PIT Act). It's a standard mechanism for active crypto investors.

I knew this buffer existed - I've been filing PIT-38 for years. But I knew it from the perspective of _"tell my accountant about it,"_ not from the perspective of _"enter it in field 38 of the new form precisely."_

On the first ingest pass, the agent asked for last year's return. I uploaded the 2024 PIT-38 PDF. The agent itself extracted the amount from the relevant line and entered it in the matching slot of the new return - where it becomes "costs from prior years."

Value to me: that buffer is usually _"remembered"_ by the accountant, who has my prior year's return in her CRM. Without her, I would have had to remember on my own to download the PDF, open it, find line 38. **The agent did that with a single question.**

This is an underappreciated class of value - automating "easily accessible memory of prior years' context." Accountants do it. Agents with access to historical files in `archive/` do it.

### 2. PIT-38 form version (17) vs (18) - the small detail that breaks a return

In PIT-38 for 2024, prior-year crypto costs lived in one line. In 2025, that line moved. Section C in version (18) gained an extra row for exemptions under Art. 21 §1.105a - and everything below it shifted by two lines.

Many blog posts and online forums still reference the **old line numbering**. If I had entered the data into the old positions, the return would either be rejected outright or, worse, accepted with a calculation error that would surface during an audit.

The agent caught this after I uploaded the blank PIT-38(18) form template as reference. It compared the structure with last year's filed return, flagged the differences in `data/sources.md`, and used the new numbering in the final calculation.

Lesson: **trust reference documents, not the model's memory.** A current form template uploaded > whatever the model picked up from training data a year ago.

### 3. 5,430 transactions → 11 taxable events

4,096 transactions from one platform plus 1,334 from another. 5,430 raw rows in total. After classification: **11 taxable events** that go on the return. The rest are platform-internal operations - transfers, technical adjustments, accruals, small reconciliations - that don't need to be reported.

The LLM's value here is not in **summing**. It's in **classification**. Each of the ~25 transaction types in the report was assigned to one of three categories: taxable event / internal operation / neutral. Each classification was backed by a documented legal rationale in `data/sources.md`.

> I won't go into specific transaction types or legal interpretations - that's beyond the scope of this case study and requires individual consultation with a tax advisor. I'm only showing the **scale** of the classification work.

Without that classification, trying to file 5,430 raw CSV rows manually would have been either impossible in two days or would have led to a dramatic overstatement of the tax base - if I had treated every transaction as a disposal. The scale that the LLM reduces here is non-trivial.

### 4. Central bank D-1 FX rates - 10 edge cases with a holiday calendar

Every transaction in EUR/USD has to be converted to PLN using the **mid-market rate from the National Bank of Poland (NBP) on the business day before the disposal date** (Art. 11a of the PIT Act). Sounds simple. In practice 10 of the 11 transactions needed individual handling, because they fell on non-business days:

| Transaction date | Day of week | NBP rate from |
| --- | --- | --- |
| 2025-02-15 | Saturday | Friday 2025-02-14 |
| 2025-03-16 | Sunday | Friday 2025-03-14 |
| 2025-05-02 | Friday | Wednesday 2025-04-30 (1 May = public holiday) |
| 2025-05-18 | Sunday | Friday 2025-05-16 |
| 2025-06-15 | Sunday | Friday 2025-06-13 |

The agent did this manually for each of the 10 transactions: computed the day of week, checked national holidays (1 May, 3 May, Corpus Christi, 15 August, 1 and 11 November, 25-26 December), pulled the rate from NBP, applied the conversion.

This is **exactly the kind of work where a human brain trips up quickly** - every edge case requires checking a calendar separately. A human would make 1-2 mistakes per 10 transactions (forgetting 1 May is a common Polish-tax bug). The agent made 0.

The class of task _"many small mechanical decisions with subtle rules"_ is an LLM's strength. Not summing. Not creativity. Systematic application of rules to each of 10 situations without boredom and without omission.

### 5. The 6 groszy the LLM couldn't add up

My calculation for section C: a loss of **966.98 PLN**. The official tax-office portal after data ingest: **966.92 PLN**. A 6-grosz (0.06 PLN) discrepancy. Arithmetic error from the LLM when subtracting two 6-digit numbers (16,188.05 − 15,221.13).

Lesson: **LLMs make arithmetic errors on 6-digit additions.** Leave summing to a calculator, Excel, or the tax-office system. The LLM has value in **structure and interpretation**, not arithmetic. This isn't a failure - it's a map of where to use the tool and where not to.

In this specific case the tax-office portal corrected my error for free. In another scenario - say, a paper filing - a 6-grosz delta would have gone to the tax office and probably no one would have cared, but the principle stands: **arithmetic to a compute engine, not to a language model**.

### 6. Ingest as progressive discovery - the strongest beat

The most valuable thing the agent did across those two days was not summing 5,000 transactions. It was **asking about things that weren't on my list**.

I didn't have a list of _"what's needed for PIT-38."_ I uploaded what I had at hand. After each iteration, the agent said: _"OK, this is here, but X is missing"_ or _"watch out, this implies Y, check Z."_

The key moment: **foreign dividends**.

- I didn't know I had dividends from 2025 (small ETFs in XTB, around 958 PLN gross).
- I didn't know they have to be reported separately from everything else (section G of PIT-38, Art. 30a, 19% PL minus withholding).
- After the first ingest, the agent asked: _"and what about dividends? PIT-8C doesn't include them, XTB issues a separate report."_
- I downloaded the **XTB Supplementary Report for PIT-38** - and there were 182 PLN of 19% PL tax on foreign dividends to declare.

Without that question, I would have filed the return **without section G**. Result: a 172 PLN underpayment, audit risk, late-payment interest.

The second moment: **2024 history**. On the first ingest the agent asked whether I had last year's return. I uploaded the PDF - and that's when the 174,895.50 PLN buffer described above surfaced. Without that move I would have paid ~2,200 PLN in tax instead of 0.

This is **the essence of the value**: not _"the agent summed transactions,"_ but **"the agent knew what I didn't know."** Iterative questioning + classifying every document against the PIT-38 taxonomy = impossible to achieve manually without specialised tax knowledge.

Ingest workflow ≠ batch processing. The value is in the loop: you upload → the agent classifies → it identifies gaps → it asks for more → you upload again. After 3-4 iterations you have a complete picture you couldn't have assembled on your own.

## A short primer: how crypto taxation works in Poland

A small explainer for readers outside Polish crypto-tax topics, so that "buffer of 174k" doesn't read as "Pawel lost 174k."

Under Polish law (Art. 17 §1.11 of the PIT Act), a taxable event arises only when **crypto is exchanged for traditional currency or for goods**. As long as you hold a crypto position - regardless of how the market value moves - you don't report anything. Crypto-to-crypto swaps are also neutral (Art. 17 §1f).

If you buy crypto for 100,000 PLN and don't sell for fiat for several years, that 100,000 PLN exists as a **documented cost of acquisition** (Art. 22 §14) and waits. In the year you sell crypto for fiat, that cost reduces the taxable base. If costs > revenue in a given year, the surplus **rolls forward indefinitely** (Art. 22 §16).

That's where the _"buffer 174,895 PLN from 2024 → 162,948 PLN for 2026"_ comes from in my case. It's **not a loss** - it's expenditures on crypto purchases I haven't yet closed via sales to fiat. The buffer shrinks only when I actually sell crypto for PLN/EUR/USD.

This is a heavily simplified description of the mechanism. Full understanding requires consultation with a tax advisor - this is not tax advice.

## Interpretive decisions: where the human comes back into play

With 5,400+ transactions across multiple platforms, some categories of events have **ambiguous tax classification**. There are differing opinions from the Polish National Tax Information service (KIS), differing tax-advisor positions, and administrative-court rulings touching adjacent constructions.

For each such category, the LLM laid out arguments for both sides, estimated risk exposure, and showed me the **numerical trade-off** - how much tax a conservative interpretation implies, how much a less restrictive one, and what the dispute risk looks like with the tax authority. **I made the decision**, not the agent. The agent left the rationale in `data/sources.md` in the repo - if an audit ever comes, I have a documented chain of reasoning.

And one more key point worth repeating to anyone facing a first solo filing: **a PIT-38 amendment is possible up to 5 years back** (until 2030 for the 2025 return). Filing in good faith with documented decisions = a safe path. When you're not sure, a conservative interpretation in the first filing always works - you can later amend in your favour.

In this section the LLM does not decide for me. It **maps options, documents arguments, waits for input**. That's exactly the division of labour I want.

## "You uploaded financial data to an LLM?" - a deliberate choice, not carelessness

I know that for some readers, _"I uploaded financial data to an LLM"_ is already disqualifying. Three things to consider.

**a) Claude Code (Anthropic API) does not use data for training models by default.** It's a different business model from consumer ChatGPT - and a qualitative difference. Current data-handling rules are always worth checking in the [Anthropic privacy policy](https://www.anthropic.com/privacy), but the baseline is this: the API is a production environment for developers and businesses, not a training-data harvester.

**b) The repo is private and local.** There is no `git push` to GitHub. CSV files are in `.gitignore` - they don't even enter commit history. Raw financial data sits only on my disk. The LLM's context ends with the conversation.

**c) A real benchmark.** The alternative was an accountant at a desk, an Excel file on a USB stick, or the tax-office portal in a browser - in every one of those scenarios my data passes through someone's hands, someone's memory, or someone's servers. **The choice is not between "safe" and "risky." It's between different kinds of trust.**

I deliberately chose to trust Anthropic + a local workflow. Someone else will choose differently and that's fine. The discussion _"is an LLM safe for finances"_ loses meaning if we don't compare it to a concrete alternative.

## What I don't recommend

- **I didn't automate the 172 PLN payment.** The transfer to the dedicated tax microaccount went manually. There's no point doing that through an LLM - one amount, one account number, 30 seconds in the banking app.
- **I don't recommend this setup to anyone without programming comfort.** `/ingest`, directory structure, git, `.gitignore`, markdown editing - it requires familiarity with the tools. Without that, the time spent on setup eats all the gains.
- **An LLM does not replace a tax advisor.** In ambiguous situations - and there are plenty when you have multi-source crypto + stocks + dividends - the final call has to belong to a human, ideally after a consultation with an advisor. The LLM provides arguments and maps risk. The advisor gives a recommendation tailored to your situation and takes responsibility for it.

## If you're reading this today - you still have ~30 hours

If you haven't filed your PIT-38 yet and you have multi-source income, here's a minimum-viable plan for **2-3 hours** before the 30 April deadline:

1. Download every PIT-8C from your brokers (XTB, mBank, etc.) and reports from your crypto exchanges.
2. Open the official tax portal (Twój e-PIT) - section C (stocks + funds) is auto-filled for most people.
3. Sections E (crypto) and G (foreign dividends) have to be filled manually. This is where the portal won't help you.
4. **Check your PIT-38 from 2024.** See whether the relevant line carries unused crypto costs from prior years. That can be a buffer worth **a few to a few tens of thousands of PLN** that you might have forgotten about.
5. File via Trusted Profile (Profil Zaufany). Pay the microaccount by 30 April.
6. **Worst case: a PIT-38 amendment is possible until 2030.** Filing a roughly correct return on time is always better than no return + late-filing waiver paperwork.

**After the deadline**, in three profiles:

- **Simple PIT (one PIT-37 from employment)** - Twój e-PIT and that's it. Don't overcomplicate.
- **2-3 sources (stocks + crypto)** - worth considering an evening or two to set up a workflow like this.
- **5+ sources and a history of carried losses** - this is **your scenario**. The crypto cost-basis buffer can be worth 5-50k PLN in overlooked tax annually. The setup pays for itself.

The value of an LLM grows not linearly but **in jumps**, when the repo's structures are legible to it. Without `CLAUDE.md` and project conventions, this project would have taken as long as working with an accountant. With them - two hours. That is exactly the ROI range that can't be sold via generic content marketing - because it requires the infrastructure to be there first.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Got multi-source taxes and thinking "I want this too"?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I help freelancers and technology consultants set up AI workflows for the
    kinds of work they used to delegate to experts. I'll show you what such a
    setup could look like for you.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Useful Resources

- [Twój e-PIT (Polish tax portal)](https://www.podatki.gov.pl/pit/twoj-e-pit/) - auto-fills section C for stocks and funds
- [Polish PIT Act - ISAP](https://isap.sejm.gov.pl/) - Art. 17 §1.11, Art. 22 §§14, 16, Art. 11a (FX rates), Art. 30a (dividends)
- [NBP - average exchange rates](https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/) - D-1 rates for FX transactions
- [Anthropic - Privacy & Data Usage](https://www.anthropic.com/privacy) - default API data handling
- [Skills 2.0 - multi-agent system for company management](/en/blog/skills-2-0-multi-agent-system-company-management) - context for how `CLAUDE.md` conventions are built
- [Spec-driven SEO on portfolio and Qamera AI](/en/blog/spec-driven-seo-portfolio-qamera-ai-case-study) - another case study, same workflow class

## FAQ

<details open>
<summary>

### Can I do PIT-38 with Claude Code if I'm not a programmer?

</summary>

Short answer: probably not worth it. The setup requires familiarity with git, the terminal, directory structures, markdown editing, and `.gitignore`. Without that, the time spent configuring eats all the gains. A safer path for non-technical users is an accountant or the official tax portal with manual entry of sections E and G.

</details>

<details open>
<summary>

### Does Anthropic use my financial data to train models?

</summary>

By default, no - Claude Code (Anthropic API) operates under a different business model than consumer ChatGPT. Data sent through the API is not used to train models without explicit customer consent. It's a different category from free consumer tools. Always worth checking the current rules in the [Anthropic privacy policy](https://www.anthropic.com/privacy).

</details>

<details open>
<summary>

### What is the "crypto cost-basis buffer" and why can it be worth tens of thousands of PLN?

</summary>

The buffer is your documented spending on crypto purchases that you haven't yet closed via sales to fiat currency. Under Polish PIT (Art. 22 §§14, 16) those costs wait in a buffer until the year you sell crypto for fiat - then they reduce the taxable base. Any surplus of costs over revenue in a given year rolls forward to subsequent years **with no time limit**. That's why checking last year's return can be worth several to several tens of thousands of PLN in overlooked buffer.

</details>

<details open>
<summary>

### What if I'm reading this after 30 April and haven't filed PIT-38?

</summary>

File as soon as possible with a "czynny żal" (active regret, Art. 16 of the Polish Fiscal Penal Code) - the penalty for non-filing grows with time, and czynny żal in many cases lets you avoid the fine. A PIT-38 amendment is possible up to 5 years back, so it's better to file a roughly correct return late than not at all. Afterwards, consult a tax advisor if your situation is complex.

</details>

<details open>
<summary>

### Does an LLM replace a tax advisor for multi-source PIT?

</summary>

No. An LLM is good at classifying transaction types, extracting data from PDFs, and mechanically applying NBP exchange-rate rules - but in cases of ambiguous legal classification the final call must belong to a human. Ideally - after a consultation with an advisor who takes responsibility for a recommendation tailored to your situation. The LLM maps options and risks. The advisor makes the decision and signs their name to it.

</details>
