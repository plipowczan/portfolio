---
id: 32
slug: measured-not-assumed
title: "Measured, Not Assumed. Three Conclusions I Overturned Myself"
excerpt: >-
  I measured what happens to a file's AI marking across nine channels.
  Three times my own conclusion turned out to be false. Five rules that survived.
category: Code
author: Pawel Lipowczan
date: 2026-09-06
readTime: 16 min
image: /images/og-zmierzone-nie-zalozone.webp
tags:
  - Testowanie
  - Metodyka
  - AI Act
  - C2PA
  - AI
lang: en
alternateSlug: zmierzone-nie-zalozone
---

At [Qamera](https://qamera.ai) we build a system that generates product photos and video for online stores: packshots and model sessions, without a studio and without a photographer. I own the technical layer there, including the part that makes every generated file carry a record of where it came from.

That file does not reach the buyer directly. It goes to the store first, the store builds its own thumbnails and variants, and then the same material ends up on Instagram, in an ad, and in a price comparison engine. At every one of those stops, someone writes the file again. The question that follows sounds trivial: does the marking we put into the file reach the person on the other end?

Normally you wave that question away, because the metadata sits in the file and the file goes to the recipient. In mid-July that stopped being enough, because the AI Act landed in our project: the EU regulation that requires marking AI-generated content. I am not writing about the regulation here and this is not a legal text. What matters is what the rule did to our work: it turned "it should work" into "how do you know".

The analysis started at the turn of July and August, and I ran the last follow-up measurement on 5 September. Over that time we measured nine channels: three store engines, four social platforms and two editors. Every measurement got a date, an input and a control.

I write "we measured" because I did not do most of that work by hand. An agent did: it stood the stores up locally, pushed files through the full upload path, read the manifests, scanned bytes against thirteen patterns at once. Those are tasks you describe in three sentences and execute in several hundred steps. My part was designing the measurement and reading the results. There was one thing the agent could not do: upload material to the platforms and check whether a label appeared under the post. That answer requires publishing, and publishing requires a human with an account.

Out of it came a dozen or so tables and five rules that carry far beyond this topic. Out of it also came three situations where I recorded a conclusion and then withdrew it myself. Not after months, but after a single follow-up. Once it was enough to wait a day. Once it was enough to repeat the measurement on our own file instead of someone else's. Once the verdict stayed the same and the reasoning behind it fell apart.

Each of those three conclusions sounded confident at the moment I wrote it down. That is what I want to write about, because confidence is not measurement. It applies to me exactly as it applies to the agent running this project with me: an agent phrases conclusions smoothly and fast, including ones with no reading behind them.

Five rules below. All of them came out of mistakes, not out of a textbook.

## Everyone knew, nobody measured

Two more paragraphs of domain, because without them the rules hang in the air. You do not need to know it to take the method from this text.

A marking has two layers, and that distinction comes back throughout. The first is the **C2PA manifest**. [C2PA](https://spec.c2pa.org/specifications/specifications/2.1/index.html) is an open standard for recording a file's provenance, and a manifest is a block of data embedded in the file that says what the file is and who attests to it. The second layer is the **watermark**, a signal written into the pixels themselves, invisible to the eye and resistant to transformations of the file. Alongside them rides `XMP`, the standard metadata package, the same one that holds a photo's author and title.

The layers differ in durability and in who reads them, and that is where the whole problem sits. The manifest is wiped by **recompression**, a re-save of the image after which the pixels look the same and the bytes are different. The watermark survives recompression, but almost nobody reads it.

Before the measurement, everyone on the project held the same view: the metadata is in the file, the file travels onward, so the metadata travels onward. Nobody had checked, because it seemed too obvious to check.

The measurement showed that view is true in exactly one case: when the file travels byte for byte, meaning nobody re-saves it along the way. Everywhere else you have to check separately, channel by channel.

## Rule 1: a negative control outweighs a positive result

The first measurement on Meta looked like a success. I uploaded material carrying the marking to Instagram and to Facebook, and both posts got an AI content label. Automatically, without touching the self-declaration field on upload.

The conclusion suggests itself: the platform reads our marking. Except that conclusion does not follow from this measurement. The label could have been placed by an image classifier, a model judging the frame itself, which does not care what sits in the metadata.

The objection was not theoretical. Another tool recognised that exact same content as generated from the pixels alone, without looking at metadata. If the platform did the same, a positive result would say nothing about our marking.

The negative control settles it. I took the same material, the same frame, the same pixels, in a form I had previously measured at byte level as stripped of every marker. I uploaded it the same way, to both platforms.

**It got a label on neither** (measured 31 August 2026, control after a day on 1 September). Only that makes the result proof: the label comes from the embedded declaration, not from image recognition.

The same construction had worked earlier on images, on 6 August 2026. Two posts, the same product photo (a **packshot**, a product shot on a plain background), differing only in the metadata layer. The file with a manifest got a label in about two minutes. The file carrying only the watermark, after passing through a store, got none, neither immediately nor in the control a day later.

A fact I had not expected fell out along the way: the platform reads the manifest and does not read the watermark. The durable layer survived the entire trip and produced no effect at all, because nobody on that side inspects it.

The rule is simple to write down and expensive to carry out. A positive result without a control shows that something is happening. It does not show what that something follows from. A control costs a second run, and it is usually missing from the plan, because plans get written around "does it work" rather than around "why does it work".

## Rule 2: the first read lies

On 31 August I uploaded two videos to TikTok and checked the posts a dozen or so minutes later. Neither had a label. I recorded the conclusion: the platform does not read provenance embedded in the file.

The conclusion was specific, it fitted the rest of the picture, and it had consequences. It implied that on this channel our marking produces no effect visible to the audience.

On 1 September I came back to the same posts. One of them carried a label about AI-generated media. The self-declaration field is off by default on that platform and I did not touch it in either post, so the label came from the file.

**The conclusion from 31 August went in the bin.** The platform reads provenance. It just does it more slowly than I managed to check. Why the label landed on one of the two files rather than the other is a separate thread, and I am not opening it here.

What matters for the rule is different: **a negative without a time control is not a negative.** It is a statement about what I saw in one particular minute.

That same follow-up strengthened a different result, and that is the second half of the rule. The controls on Meta still had no label after a day. Had they picked one up late, the whole conclusion from rule 1 would have collapsed. A time control sometimes kills a conclusion and sometimes turns circumstantial evidence into proof, and you cannot tell in advance which time is which.

What I still do not know: exactly when that label appeared. I know it was not there after a dozen or so minutes, and it was there after a day. The window is wide and I did not narrow it. That is a result too, just a less convenient one to put in a table.

## Rule 3: measure on your own artifact

On 6 August I measured what two popular store engines do to the metadata of product photos. The measurement was sound: local instances, the full upload path, every derivative (a **derivative** is the smaller version of an image the store generates itself, a listing thumbnail for instance).

It had one flaw I knew about from the start. It ran on someone else's file. Our own exports did not yet carry the full metadata package, so the input was a file from another source, with a different structure.

The results looked unambiguous.

WooCommerce has a **2560 px** threshold on the longer edge. Below it, the file travels byte for byte: the **SHA-256 hash** of the served file matches the uploaded one exactly (a hash being a cryptographic digest, identical only for identical bytes). Above the threshold, WordPress creates a scaled variant and that is what comes out as "full size", without the manifest.

PrestaShop has neither a threshold nor a copying path. The single sharpest fact from the whole measurement sits in the row the store calls the "original": **the same dimensions, 3712x4608, a fifth of the weight (1,146,413 B against 5,666,168 B), zero metadata.** A file nobody scaled was re-saved anyway. Version 9, measured on 22 August, behaves identically.

To those results I added a sentence that seemed an obvious conclusion: the product page shows a 600 px derivative, without a manifest, so the buyer looks at an unmarked file anyway.

On 22 August I repeated the measurement on our own production file, with our metadata structure. **That sentence is true about the manifest only.** Our `XMP` package reaches every derivative, including the product page that shows 600 px. That it is our package, and not something the store adds, is visible from its contents.

The first measurement could not see this. Someone else's file did not carry our `XMP`, so the question "does XMP reach the derivatives" was never asked at all. I was measuring an object similar to ours and drawing conclusions about ours.

The rule: a measurement on someone else's artifact answers a question about someone else's artifact. If you do not have your own yet, write that down next to the result and come back when you do. I came back sixteen days later and got a different answer.

## Rule 4: look for the mechanism, not the correlation

On 31 August I pushed two marked videos through a consumer video editor, in eight variants: a pass-through with no change at all, a crop, a two-second trim, and a resolution change.

**The marking died in eight cases out of eight.** The scan covered thirteen byte patterns, from standard names to tool names. Zero hits on every pattern in the exports, eight to eleven in the originals.

The row that matters most is "pass-through with no change at all". Aggressive processing is not required. It is enough to load the file into the editor and export it untouched.

The mechanism looked obvious. The **MP4 container**, the structure of a video file made of boxes holding the picture, the audio and the metadata separately, is rebuilt from scratch in the output. The boxes carrying the marking simply do not exist: they were not trimmed or moved, they are absent. So I wrote down that the container rebuild is what kills it.

On 1 September I measured the second axis, meaning what the platforms serve onward. And there the reasoning fell apart.

TikTok rebuilds the container too. It declares that outright, as a separate **transcoding** action (re-encoding the video stream to the platform's own settings). And the provenance chain survives. The platform nests our manifest as a **parent ingredient**, a record saying "this file came from that one", under its own new signature:

```text
file downloaded from the platform
└─ active layer          platform signature   actions: opened + transcoded
   └─ parent ingredient  our signature        action: created
      └─ ingredient      vendor signature     action: created
```

Both files validate as sound. The platform did not lose the chain in the rebuild, it rebuilt the chain along with the file.

**The verdict did not change, the reasoning did.** The marking still dies eight out of eight in the editor. But what kills it is not the container rebuild, it is a rebuild by a tool unaware of provenance. A tool that knows about provenance rebuilds the file and carries the chain across.

The difference is practical, not academic. The first version implied "avoid re-encoding". The second implies "check whether the tool in your chain knows the standard", and that sentence carries over to tools I have not measured yet. A correlation describes eight files. A mechanism describes the ninth.

## Rule 5: write down what you did not measure

A table with an empty cell is worse than no table, because an empty cell reads as a zero. This measurement has plenty of empty cells, and each one gets its own sentence in the limitations section.

**One editor, not a class of editors.** I picked the most popular consumer editor on this market. The mechanism from rule 4 is a property of how the file is assembled rather than of that program, so the result should carry over to any tool that does not carry boxes it does not recognise. "Should" is an argument, not a measurement, and that is how it was recorded.

**Two platforms unmeasured on the second axis.** I know they label the post. I do not know whether the file they serve onward still carries provenance, because the material uploaded there had already passed through the editor and lost its marking before upload. There was nothing to preserve. That is not the same as "checked, and it does not preserve it".

**One variant skipped deliberately.** The poorer of the two files had already passed, so the richer one could only have confirmed the result. Skipping with a justification is fine. Skipping without a record looks, a month later, exactly like a negative result.

I record method traps separately. YouTube labels the post automatically, and the file it serves onward is stripped to zero: no manifest, no marker in the raw bytes. Except my first approach to that measurement would have produced a false negative through the fault of the tool I was downloading with, because automatic stream joining overwrites container metadata. Anyone repeating this measurement has to repeat that condition too, so the condition sits in the note next to the result.

Those two axes are the easiest thing here to conflate. "The platform labels the post" and "the platform passes provenance onward" are two different promises. Of the four platforms measured, one delivers both.

## The fragile layer is public, the robust one is locked

Finally, the result I like least, because it cannot be fixed from our side.

I checked four surfaces where a person can verify a file. One column interested me: can it be done without an account.

Three of the four require signing in. One, the [public Content Authenticity verifier](https://verify.contentauthenticity.org), works without an account and reads **the manifest only**, meaning the layer wiped by the first recompression that comes along. Including recompression in the store the product photo travels through.

We measured the durability of both layers separately, and it comes out the inverse of their accessibility. The manifest died across **ten transformations out of ten**, including conversion to a lossless format where the pixels stayed bit-identical. The watermark passed **five out of five**: recompression without a change of dimensions, scaling, heavy compression, an overlaid graphic element, and a horizontal flip, the classic attack on this layer. It can only be detected in a tool that requires signing in.

We built our own [marking reader in the browser](https://qamera.ai/tools/verify-image), also without an account and without installing anything. It has exactly the same limitation, because it reads the same layer. A public verification path does not get any fuller by adding one more tool on the same side of it.

The split of roles comes out the inverse of the intuitive one:

- the **fragile** layer is publicly readable,
- the **robust** layer is locked behind an account.

Both together work technically. They do not add up to a single public path for checking. A person without an account who wants to verify a file after it has been through a store has nothing to do it with.

I did not come up with this while planning the measurement. It fell out of the table when I put the "what it reads" column next to the "no account" column. Two columns that meant nothing in separate notes.

## Key takeaways

Five rules, each one bought with a mistake:

1. **A negative control outweighs a positive result.** Without a run in which the result is supposed to be absent, you do not know where the result you got comes from.
2. **The first read lies.** The systems on the other side work asynchronously, so a negative without a time control is a statement about one particular minute, not about the system.
3. **Measure on your own artifact.** A measurement on someone else's file answers a question about someone else's file, however identical the procedure.
4. **Look for the mechanism, not the correlation.** A correlation describes the cases you measured. Only a mechanism says anything about the next one.
5. **Write down what you did not measure.** An empty cell in a table reads as a zero a month later, including to you.

None of these is new. I knew all of them before I started. I withdrew three conclusions anyway, so knowing a rule and applying it are two different things. One thing helps: recording the date, the input and the control next to every result, because only then can you see which of the three is missing.

I described the environment this measurement came out of in [how I'm building an AI OS for two companies](/en/blog/agentic-ai-environment-two-companies). How a project like this is run with an agent day to day is in [AI agent system anatomy](/en/blog/ai-agent-system-skills-rules-shared-context).

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Not sure your system does what you think it does?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    The gap between "it should work" and "measured" costs the most when it surfaces late. I can help you design the measurement, run it with proper controls, and record the results so they are still usable six months from now.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Useful Resources

- [Qamera image verifier](https://qamera.ai/tools/verify-image) - read the markings of any file in the browser, no account needed.
- [Content Authenticity Verify](https://verify.contentauthenticity.org) - a second independent path for reading the manifest, also without an account.
- [C2PA specification](https://spec.c2pa.org/specifications/specifications/2.1/index.html) - the basis for the manifest format and the action names referenced in this text.
- [What survives of an image's marking on the way to the buyer](https://qamera.ai/blog/co-zostaje-z-oznaczenia-zdjecia-na-drodze-do-kupujacego) - the same measurements from the store's side (in Polish).
- [My agentic environment](/en/blog/agentic-ai-environment-two-companies) - the stack this measurement came out of.
- [AI agent system anatomy](/en/blog/ai-agent-system-skills-rules-shared-context) - how I run projects with an agent.
- [I built a second brain and matched Google's standard](/en/blog/okf-standard-portable-knowledge-base) - how I record findings so they are still readable in six months.

## FAQ

<details open>
<summary>

### What is the difference between a platform labelling a post and provenance being carried in the file?

</summary>

They are two different promises and they have to be measured separately. "The platform labels the post" means a viewer sees a label under the material. "The platform passes provenance onward" means the file downloaded from the platform still carries a manifest, so someone outside can reconstruct its history. Of the four platforms I measured, one delivers both: another labels the post but serves a file stripped to zero.

</details>

<details open>
<summary>

### Why can the first read after publishing on a social platform produce a false negative?

</summary>

Because the systems on the platform's side work asynchronously and the label appears with a delay. I checked a post a dozen or so minutes after publishing, saw no label, and recorded the conclusion that the platform does not read the marking from the file. A day later the label was there and the conclusion had to be withdrawn. Repeat every negative after a day before you enter it in a table.

</details>

<details open>
<summary>

### Why do I need a negative control if a positive result already shows the mechanism works?

</summary>

A positive result shows that something is happening, but not what it follows from. In my measurement the label could have come from an image classifier rather than the embedded declaration, and the objection was real, because another tool recognised the same content from the pixels alone. Only a second run on material stripped of every marker, which got no label, turned the observation into proof.

</details>

<details open>
<summary>

### Do online stores strip metadata from product photos, and does it depend on the engine?

</summary>

It depends on the engine and on the threshold, and the differences are large. WooCommerce passes a file byte for byte below its 2560 px threshold on the longer edge, and above it swaps in a scaled variant with no manifest. PrestaShop re-saves even a file it does not scale: same dimensions, a fifth of the weight, zero metadata. The layers also behave differently, because the `XMP` package survives where the manifest dies.

</details>

<details open>
<summary>

### How can I check whether my own image file carries an AI provenance marking?

</summary>

The simplest way is to drop the file into a browser-based verifier, for example [qamera.ai/tools/verify-image](https://qamera.ai/tools/verify-image) or [verify.contentauthenticity.org](https://verify.contentauthenticity.org). Both read the C2PA manifest and show who signed the file and which actions they declared. Mind the limitation: they read the metadata layer only, so a file that has been recompressed comes back as unmarked even if it still carries a watermark in the pixels.

</details>

<details open>
<summary>

### Are these measurement rules useful outside the topic of marking AI-generated content?

</summary>

Yes, because none of them is about metadata. A negative control, a time control on negatives, measuring on your own artifact, mechanism over correlation, and recording the gaps all work the same way when testing integrations, data migrations and the behaviour of someone else's API. In all of those the question is "how do you know", and the answer is a reading with a date and a control, not a belief about how the system ought to behave.

</details>
