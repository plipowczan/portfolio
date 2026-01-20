# AI Design Style Reference

Use this document as a reference point for all design-related tasks.

## Visual Style

| Aspect                | Choice                               | Rationale                                                                        |
| :-------------------- | :----------------------------------- | :------------------------------------------------------------------------------- |
| **Overall Aesthetic** | **Modern Tech / Dark Mode**          | Reflects technical expertise and modern web trends.                              |
| **Color Palette**     | **Teal/Green Gradients + Dark Navy** | Distinctive brand identity, high contrast, "hacker/cyber" vibe but professional. |
| **Typography**        | **Inter (Sans) + Fira Code (Mono)**  | Inter for readability and modern look; Fira Code for technical/code elements.    |
| **Spacing**           | **Generous Whitespace**              | Improves readability and gives a premium feel.                                   |
| **Visual Weight**     | **Bold Headings, Glassmorphism**     | Highlights key messages; glassmorphism adds depth without clutter.               |
| **Effects**           | **Glows, Gradients, Blur**           | Adds dynamism and visual interest to the dark theme.                             |

## Layout Structures

| Layout Type              | Usage                      | Characteristics                                                |
| :----------------------- | :------------------------- | :------------------------------------------------------------- |
| **Hero Full-Screen**     | **Home Page Top**          | Centered content, animated background, strong CTA.             |
| **Card Grid**            | **Projects, Blog Listing** | Responsive grid, consistent card heights, hover effects.       |
| **Section with Sidebar** | **Blog Post (Desktop)**    | Content on left/center, table of contents or related on right. |
| **Single Column**        | **Legal Pages, Mobile**    | Focus on readability, linear flow.                             |

## Color Themes

Based on `tailwind.config.js`:

| Theme            | Primary (Green) | Secondary (Blue) | Background (Dark) | Text                 |
| :--------------- | :-------------- | :--------------- | :---------------- | :------------------- |
| **Main**         | `#00ff9d` (500) | `#00b8ff` (500)  | `#0a0e1a` (800)   | `#ffffff` (White)    |
| **Hover/Active** | `#00cc7d` (600) | `#0096cc` (600)  | `#050810` (900)   | `#e5e7eb` (Gray-200) |
| **Subtle/Bg**    | `#003320` (900) | -                | `#151b2b` (700)   | `#9ca3af` (Gray-400) |

## Key UI Components

- **Buttons:** Gradient background or border, rounded corners, hover scale effect.
- **Cards:** Dark background with slight transparency (glassmorphism), subtle border, hover glow.
- **Inputs:** Dark background, bottom border or full border, focus ring with primary color.
- **Navigation:** Sticky, backdrop blur, active state indicator.
