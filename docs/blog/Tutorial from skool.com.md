Claude + Remotion(Easiest Way to Make Graphics)

Installation (Step-by-Step)

### Step 1: Open VS Code

### Step 2: Open Terminal

1. Launch VS Code
    
2. Click **Terminal** in the top menu
    
3. Select **New Terminal**
    
4. A terminal window will appear at the bottom
    

### Step 3: Install Remotion Skill

Copy and paste this command into your terminal:

```bash
npx skills add remotion-dev/skills
```

Press **Enter** and follow the prompts. Installation takes 30-60 seconds.

### Step 4: Verify Installation

Once you see the confirmation message, test it with this simple prompt:

**Test Prompt:**

```
Create a 5-second motion graphic for a coffee brand. Show the text "Fresh Coffee Daily" with a smooth fade-in animation. Use warm brown and cream colors. Make it feel cozy and inviting.
```

If Claude starts writing code and renders an animation, you're ready to go!

---

## Use Case #1: For Video Editors

### Creating Animated Title Sequences

**Prompt Template:**

```
Create an animated YouTube intro for [YOUR CHANNEL TOPIC]. The intro should:
- Be 5 seconds long
- Show the channel name "[YOUR CHANNEL NAME]"
- Include the tagline "[YOUR TAGLINE]"
- Use [COLOR SCHEME] colors
- Have an [ENERGETIC/MINIMAL/CORPORATE] feel
- Aspect ratio: 16:9
```

**Example Prompt:**

```
Create an animated YouTube intro for a tech review channel. The intro should:
- Be 5 seconds long
- Show the channel name "Tech Simplified"
- Include the tagline "Making Technology Easy"
- Use electric blue and white colors
- Have an energetic feel
- Aspect ratio: 16:9
```

### Creating Lower Thirds

**Prompt Template:**

```
Create a lower third animation that displays:
- Name: [PERSON'S NAME]
- Title: [PERSON'S TITLE]
- Duration: 3 seconds
- Style: [MODERN/CLASSIC/MINIMAL]
- Colors: [YOUR BRAND COLORS]
- Animation: Slide in from left, hold, slide out to right
```

### Creating Custom Transitions

**Prompt Template:**

```
Create a [DURATION]-second transition effect that:
- Starts with [STARTING STATE]
- Ends with [ENDING STATE]
- Uses [TYPE OF ANIMATION - wipe/fade/zoom]
- Color: [TRANSITION COLOR]
- Aspect ratio: 16:9
```

### Quick Edit Request

**Prompt for Changes:**

```
Change the accent color to [NEW COLOR] and make the text [NEW COLOR/STYLE]
```

---

## Use Case #2: For SaaS & App Founders

### Creating Product Demo Videos

**Comprehensive Demo Prompt:**

```
Create a [DURATION]-second product demo video for [YOUR APP NAME], a [APP DESCRIPTION]. 

Scene 1 (0-5s): 
- Show the app logo with tagline "[YOUR TAGLINE]"
- Smooth fade-in animation

Scene 2 (5-15s):
- Display a mockup of the main interface
- Highlight these 3 key features:
  1. [FEATURE 1]
  2. [FEATURE 2]  
  3. [FEATURE 3]
- Animate each feature appearing with subtle emphasis

Scene 3 (15-25s):
- Show a user benefit screen with text "[MAIN BENEFIT]"
- Include an animated icon representing the benefit

Scene 4 (25-30s):
- Call-to-action: "[YOUR CTA]"
- Display website URL

Brand colors: [PRIMARY COLOR], [SECONDARY COLOR]
Style: [MODERN/PLAYFUL/PROFESSIONAL/MINIMAL]
Aspect ratio: [16:9/9:16/1:1]
```

**Example Prompt:**

```
Create a 30-second product demo video for MindfulSpace, a meditation and wellness app.

Scene 1 (0-5s):
- Show the app logo with tagline "Find Your Inner Peace"
- Smooth fade-in animation

Scene 2 (5-15s):
- Display a mockup of the main interface
- Highlight these 3 key features:
  1. Guided meditation sessions
  2. Sleep stories
  3. Breathing exercises
- Animate each feature appearing with subtle emphasis

Scene 3 (15-25s):
- Show a user benefit screen with text "Reduce stress in just 10 minutes a day"
- Include an animated lotus flower icon

Scene 4 (25-30s):
- Call-to-action: "Start Your Free Trial Today"
- Display website URL

Brand colors: Calming blue (#4A90E2), Soft purple (#B084CC)
Style: Minimal and calming
Aspect ratio: 16:9
```

### Iteration Prompt:

```
Make the transitions between scenes faster (1 second each) and add a pricing section at the end showing [YOUR PRICING TIERS]
```

---

## Use Case #3: For Business Owners

### Website-to-Video Explainer

**Prompt Template:**

```
Visit my website at [YOUR WEBSITE URL] and create a 45-second explainer video based on the content. 

The video should:
- Extract and use the brand colors from the site
- Highlight the main services/products
- Include key selling points
- Use professional, elegant animations
- End with a clear call-to-action

Aspect ratio: [16:9/9:16/1:1]
Style: [PROFESSIONAL/MODERN/PLAYFUL]
```

**Example Prompt:**

```
Visit my website at www.example-design-studio.com and create a 45-second explainer video based on the content.

The video should:
- Extract and use the brand colors from the site
- Highlight the main services (web design, branding, UX/UI)
- Include our key selling point about working with startups
- Use professional, elegant animations
- End with "Schedule a Free Consultation"

Aspect ratio: 16:9
Style: Professional and modern
```

### Adjustment Prompt:

```
Make the text 20% larger and slow down the transitions between sections to 2 seconds each
```

---

## 5 Pro Tips for Better Results

### 1. Be Specific About Timing

**Vague:** "Add a slow fade"

**Specific:** "Add a 2-second fade-in followed by a 3-second hold, then a 1.5-second fade-out"

### 2. Mention Your Brand Assets

**Prompt Addition:**

```
Use the logo file from my uploads [or: I'll provide the logo] and incorporate it in the top right corner throughout the video
```

### 3. Describe the Vibe

Include descriptive words like:

- **Energetic** - Fast transitions, dynamic movement
    
- **Minimal** - Clean lines, lots of white space
    
- **Corporate** - Professional, steady animations
    
- **Playful** - Bouncy movements, bright colors
    
- **Calming** - Slow, smooth transitions
    

**Example:**

```
Create a motion graphic with a calming, minimal vibe. Slow transitions, soft colors (pale blue and white), and gentle animations.
```

### 4. Specify Aspect Ratio Upfront

- **YouTube/Desktop:** 16:9 (horizontal)
    
- **Instagram/TikTok Stories:** 9:16 (vertical)
    
- **Instagram Feed:** 1:1 (square)
    
- **LinkedIn:** 16:9 (horizontal)
    

### 5. Break Complex Projects Into Scenes

**Instead of:**

```
Create a complete 60-second promotional video with everything
```

**Do this:**

```
Create a 60-second video structured as follows:

Scene 1 (0-10s): [Description]
Scene 2 (10-25s): [Description]  
Scene 3 (25-40s): [Description]
Scene 4 (40-50s): [Description]
Scene 5 (50-60s): [Description]
```

---

## Integrating Remotion Into Your Apps

You can make motion graphics generation a feature of apps you build with Claude Code.

**Example: Meal Planning App with Auto-Generated Videos**

**Integration Prompt:**

```
Build a meal planning app where users input their dietary preferences and get a weekly meal plan. 

Add this feature: When they click "Generate My Plan," automatically create a 15-second motion graphic video that shows:
- The weekly meal plan overview
- Key ingredients highlighted
- Meal timing for each day
- Branded with our app colors [YOUR COLORS]

The video should be downloadable and shareable on social media.
```

This makes Remotion a programmable video engine built directly into your application.

---

## Common Mistakes to Avoid

### Mistake #1: Asking for Too Much at Once

**Don't:** Request a 30-second video with 10 different complex scenes in one prompt

**Do:** Break it into stages or describe scene-by-scene with clear timing

### Mistake #2: Not Iterating Enough

Your first generation might be 80% there. **Always iterate:**

- Adjust colors
    
- Change timing
    
- Tweak text size
    
- Modify animations
    
- Refine transitions
    

**Example Iteration:**

```
Good start! Now please:
- Make the main headline 30% larger
- Change the background from blue to navy
- Speed up the entrance animations to 0.5 seconds
- Add a subtle drop shadow to the text
```

---

## What Remotion Is Best For

**Perfect for:**

- Animated text and typography
    
- Shapes and geometric animations
    
- Transitions and effects
    
- UI mockups and demos
    
- Logo animations
    
- Data visualizations
    
- Lower thirds and graphics
    

**Not designed for:**

- Live-action footage (you'll need to film this)
    
- Stock video clips of people/places
    
- Complex 3D animations
    
- Photo/video editing
    

**Workaround:** Combine your filmed footage with Remotion-generated graphics in your editing software.

---

## 📚 Quick Reference: Prompt Templates

### Social Media Content

```
Create a [DURATION]-second [PLATFORM] post for [TOPIC]:
- Text: "[YOUR MESSAGE]"
- Style: [ENERGETIC/MINIMAL/BOLD]
- Colors: [COLOR 1], [COLOR 2]
- Aspect ratio: [9:16 for Stories, 1:1 for Feed, 16:9 for YouTube]
- Include call-to-action: "[YOUR CTA]"
```

### Logo Animation

```
Create a 3-second logo animation for [COMPANY NAME]:
- The logo should [FADE IN/ZOOM IN/SLIDE IN]
- Followed by the tagline "[YOUR TAGLINE]" appearing below
- Colors: [BRAND COLORS]
- Style: [PROFESSIONAL/PLAYFUL/MINIMAL]
- End with everything holding on screen for 1 second
```

### Testimonial Display

```
Create a 10-second testimonial animation:
- Quote: "[TESTIMONIAL TEXT]"
- Author: [NAME], [TITLE]
- Background: [COLOR OR STYLE]
- Animate the quote appearing word by word
- Then show the author info below
- Use elegant, professional styling
```