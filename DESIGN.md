# Design Tokens — bibek-website

**Direction: kinetic, premium, data-first.** The site uses a near-black canvas with a cool
slate tint and a data-viz blue palette. Headings are heavy, condensed and uppercase, with
clean sans body text. The visuals borrow from analytics tooling (column charts, axes,
gridlines, segment meters) rather than from terminals. No frameworks: plain CSS custom
properties on `:root` in `style.css`, vanilla JS, and Three.js from a CDN for the hero only.

## Principles

1. **Data, not hacker.** Motifs come from charts and dashboards: bars, axes, gridlines,
   meters, KPI tiles. No terminal prompts, blinking cursors, code comments or neon green.
2. **One accent, plus a chart ramp.** `--color-accent` (sky blue) marks interaction, key
   numbers and one word per heading. The four-step `--chart-*` ramp is only for data visuals
   (the 3D chart and meters).
3. **A calm first screen.** The hero holds exactly four things: kicker, name, tagline and
   actions. Everything else (stack ticker, socials, meta) lives below the fold.
4. **Display shouts, sans explains, mono labels.** Anton is for names and headings. Inter is
   for all reading text. JetBrains Mono is only for small data labels: indices, dates, tags,
   KPI captions and form labels.
5. **Structure over decoration.** Hairline grids, numbered sections (`01 / About`), square
   corners.
6. **Motion that feels locked in.** Line-mask reveals, short fade-ups, a live-updating chart.
   All of it stops under `prefers-reduced-motion`.

---

## Colour

| Token | Value | Use | Contrast on `--color-bg` |
|---|---|---|---|
| `--color-bg` | `#04060a` | Page canvas (near-black, cool) | — |
| `--color-bg-elevated` | `#080b11` | Alternate section bands, ticker | — |
| `--color-surface` | `#0c1018` | Cards, form | — |
| `--color-surface-hover` | `#111723` | Hovered surfaces | — |
| `--color-border` | `rgb(148 163 184 / 0.12)` | Hairlines, gridlines | — |
| `--color-border-strong` | `rgb(148 163 184 / 0.26)` | Hover outlines, empty meter segments | — |
| `--color-text` | `#f1f5f9` | Headings, primary copy | 18.5 : 1 |
| `--color-text-muted` | `#94a3b8` | Paragraphs, nav | 7.9 : 1 |
| `--color-text-subtle` | `#7c8798` | Labels, placeholders | 5.6 : 1 |
| `--color-accent` | `#38bdf8` | Sky blue: interaction, highlights, active | 9.5 : 1 |
| `--color-accent-soft` | `rgb(56 189 248 / 0.10)` | Tinted hover fills | — |
| `--color-accent-glow` | `rgb(56 189 248 / 0.35)` | Glows | — |
| `--color-on-accent` | `#04060a` | Text on accent fills | 9.5 : 1 |

### Chart ramp (sequential, low → high value)

| Token | Value |
|---|---|
| `--chart-low` | `#15336e` |
| `--chart-mid` | `#1d5fd6` |
| `--chart-high` | `#38bdf8` |
| `--chart-peak` | `#c7ecff` |

The 3D chart reads these tokens and `--color-bg` at runtime, so changing them recolours the
scene.

## Typography

| Token | Value | Use |
|---|---|---|
| `--font-display` | `"Anton", Impact, "Arial Narrow Bold", sans-serif` | Uppercase display: name, headings, tiles, ticker |
| `--font-sans` | `"Inter", system-ui, -apple-system, "Segoe UI", sans-serif` | Body, bullets, buttons, nav |
| `--font-mono` | `"JetBrains Mono", ui-monospace, monospace` | Data labels only (see list in `style.css`) |

### Scale

| Token | Value | Use |
|---|---|---|
| `--text-2xs` | `0.6875rem` | Tags, indices |
| `--text-xs` | `0.75rem` | Eyebrows, nav, buttons, labels |
| `--text-sm` | `0.875rem` | Card copy |
| `--text-base` | `1rem` | Body |
| `--text-lg` | `1.1875rem` | Hero tagline, lead copy |
| `--text-xl` | `clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem)` | Card titles, sub-headings |
| `--text-2xl` | `clamp(2.25rem, 1.4rem + 3vw, 4rem)` | KPI numbers, role titles |
| `--text-3xl` | `clamp(3rem, 1.8rem + 6vw, 8.5rem)` | Section headings |
| `--text-hero` | `clamp(3.5rem, min(10vw, 16vh), 12.5rem)`; `min(25vw, 15vh)` ≤ 600 px | Hero name (scales with width and height) |

| Token | Value |
|---|---|
| `--leading-display` | `0.88` |
| `--leading-body` | `1.7` |
| `--tracking-display` | `0.005em` |
| `--tracking-label` | `0.14em` |

Rules: display text is always uppercase. The accent word in a heading is wrapped in
`.accent`. Outline text (`.outline`) uses a stroke of the text colour with a transparent fill.

## Spacing

4 px base, in `rem`: `--space-1` 0.25 · `--space-2` 0.5 · `--space-3` 0.75 · `--space-4` 1 ·
`--space-5` 1.5 · `--space-6` 2 · `--space-7` 3 · `--space-8` 4 · `--space-9` 6 · `--space-10` 8.

### Layout

| Token | Value | Use |
|---|---|---|
| `--container` | `86rem` | Max content width |
| `--gutter` | `clamp(1rem, 0.4rem + 3vw, 3.5rem)` | Side padding, 16 px minimum |
| `--section-y` | `clamp(6rem, 4rem + 8vw, 11rem)` | Vertical section padding |
| `--measure` | `64ch` | Max paragraph width |
| `--header-h` | `4.5rem` | Fixed header and scroll offset |

Main grids are 12 columns with asymmetric spans (7/5, 5/7, 4/8). On phones they collapse
to one track, because eleven wide gaps alone would overflow a 360 px screen.

## Shape & depth

| Token | Value |
|---|---|
| `--radius` | `0`. Everything is square, except stickers (see the sticker board below) |
| `--glow-soft` | `inset 0 0 48px -12px var(--color-accent-soft)` |

On hover, cards get a cursor-tracked radial light. JS sets `--mx` and `--my` on `.glow`
elements, and a masked `::after` lights only the border near the pointer.

## Motion

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Default |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Loader bars |
| `--dur-fast` | `160ms` | Colour and border changes |
| `--dur-base` | `320ms` | Buttons, card lift, tile glow |
| `--dur-slow` | `700ms` | Fade-ups, image zoom |
| `--dur-kinetic` | `1000ms` | Line-mask heading reveals |
| `--stagger` | `90ms` | Delay between siblings and lines |

Patterns: kinetic line-mask headings, `.reveal` fade-ups via `IntersectionObserver`,
`[data-count]` count-ups, opposite-direction parallax on the hero name lines, an endless
stack ticker below the hero, and a lift plus image zoom (grayscale to colour) on card hover.
Reduced motion: everything shows instantly and the chart renders one still frame.

## 3D hero: live column chart (Three.js r169)

| Setting | Value |
|---|---|
| Scene | An 18 × 18 grid of instanced bars (12 × 12 on ≤ 768 px) on a floor grid, with x, z and value axes plus value ticks |
| Data | A smooth multi-wave field that drifts slowly over time, so it reads as a live dataset |
| Colour | Each bar is coloured along the chart ramp by height. Faceted shading (lit tops, darker sides). Far rows fade into `--color-bg` |
| Intro | Bars grow in as a diagonal wave over about 2 s |
| Interaction | Bars rise around the cursor's point on the floor (ray–plane hit), and the chart turns slightly with the pointer |
| Layout | A framed object in the right half on wide screens, above the name on narrow ones |
| Budget | Heights are computed in the vertex shader, and each frame updates a few uniforms plus one raycast. Pixel ratio is capped at 2. Rendering pauses when the hero is off-screen or the tab is hidden |
| Fallback | No WebGL or no CDN leaves a soft blue glow |

## Layering

`--z-canvas` 0 · `--z-content` 2 · `--z-header` 100 · `--z-progress` 110 · `--z-loader` 1000.

## Components (reference)

- **Eyebrow:** mono `--text-xs`, uppercase, with the index in accent: `01 / About`.
- **Mini bars:** a three-bar chart mark (45/75/100 %) in accent, used in the hero kicker.
- **Loader:** five bars bouncing in sequence.
- **Button / primary:** accent fill with dark text, square, Inter 600 uppercase. On hover it
  inverts to an outline with accent text.
- **Button / ghost:** `--color-border-strong` outline. On hover the border and text turn accent.
- **Icon button:** 2.75 rem square, hairline. On hover the border turns accent with an
  accent-soft fill.
- **KPI:** mono caption, display number (count-up), sans note, and an optional segment meter.
  One block per real unit, e.g. 3 rollouts, or 7½ of 8 semesters.
- **Sticker board (About):** a 5:6 frame on the chart grid, layered as follows:
  - a blurred copy of the portrait cutout (`img/profile-cutout.webp`, `blur(44px)`) as a
    colour glow;
  - the die-cut portrait sticker (`img/profile-sticker.webp`, white border baked in);
  - the motorbike sticker (`img/profile-min.png`);
  - a white rounded mini column-chart sticker;
  - an accent pill label with a 4 px white outline.

  Each sticker carries its own `--r` rotation and a `drop-shadow`. They pop in (scale
  0.6 → 1 with overshoot, staggered by `--d`) when the board scrolls into view, and
  straighten slightly on hover. Stickers are the one place rounded corners are allowed.
- **Stack tile:** a cell in a hairline grid with index, display name and category. On hover
  the border glows, the name turns accent and a `↗` appears.
- **Project card:** asymmetric span, grayscale image, mono index and tags, display title.
- **Chip / tag:** square, hairline, mono `--text-2xs` uppercase.
- **Input:** surface fill, hairline, square. On focus the border turns accent with a soft glow.
- **Focus visible:** 2 px accent outline with a 3 px offset.

## Breakpoints

| Width | Change |
|---|---|
| ≤ 1024 px | Projects and client cards go to 2 equal columns. Stack tiles go to 2 or 3 per row |
| ≤ 960 px | Navigation collapses into the menu button |
| ≤ 768 px | Hero content sits at the bottom with the chart above. Sections stack into one column. Fewer bars |
| ≤ 600 px | The name fills the width. Projects, hobbies and form fields go to one column. Hero buttons go full width |
| `hover: none` | Hover lifts and the cursor glow are off |
