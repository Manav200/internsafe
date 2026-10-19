# Obsidian — High-Contrast Dark
**North Star:** "Precision in Darkness"

Developer-grade dark UI. Near-black surfaces, high-contrast text, and precise accent colors. Clean, fast-feeling, and functional.

---

## 1. Design Philosophy
- **Precision in Darkness**: Every element is razor-sharp, purposeful, and calibrated for long developer sessions without eye fatigue.
- **Flat & Precise**: Minimal or no decorative drop shadows. Spatial separation is achieved strictly through delicate border lines (`1px solid #27272a`) and subtle surface luminance shifts.
- **Functional Accents Only**: Colors exist solely to convey state, identity, or risk. Never use decorative gradients or gratuitous color fills.
- **Zero Light Bleed**: Never render pure white or light grey card surfaces. Maintain zinc-gray dark consistency throughout every view and modal.

---

## 2. Color System & Design Tokens

### Primary & Accent Palette
| Token | Hex | Role | Usage |
|---|---|---|---|
| `color-primary` | `#a78bfa` | Soft Violet | Interactive elements, primary CTA buttons, active links, focus rings |
| `color-primary-hover` | `#bba4fb` | Lighter Violet | Primary button hover state |
| `color-primary-dim` | `rgba(167, 139, 250, 0.12)` | Violet Tint | Selected row / active pill background |
| `color-tertiary` | `#34d399` | Emerald Green | Verified employers, safe indicators, high skill matches, success states |
| `color-tertiary-dim` | `rgba(52, 211, 153, 0.12)` | Emerald Tint | Safe badge container fill, verified tags |
| `color-error` | `#ef4444` | Crimson Red | High-risk alerts, scam detection warnings, destructive actions, errors ONLY |
| `color-error-dim` | `rgba(239, 68, 68, 0.12)` | Crimson Tint | High-risk callout panel fill |
| `color-warning` | `#f59e0b` | Amber | Medium risk caution, approaching deadlines |
| `color-warning-dim` | `rgba(245, 158, 11, 0.12)` | Amber Tint | Medium risk badge fill |

### Surface Scale (Zinc-Based Grays)
| Token | Hex | Role / Placement |
|---|---|---|
| `bg-background` | `#09090b` | True near-black. Base canvas background for the entire application |
| `surface-container-lowest` | `#0c0c0f` | Deepest inset surface. Code snippets, pre/mono blocks, embedded logs |
| `surface-container` | `#121215` | Default component surface. Cards, panels, inputs, modal backgrounds |
| `surface-container-high` | `#18181b` | Elevated surface. Hover states, table headers, sticky navigations |
| `surface-container-highest`| `#222226` | Highest active surface. Active tab pills, dropdown popovers, pressed states |
| `border-outline` | `#27272a` | Universal structural border (`1px solid #27272a`) |
| `border-outline-hover` | `#3f3f46` | Border color upon hover or sub-active focus |

### Text & Contrast Hierarchy
| Token | Hex | Typography Role |
|---|---|---|
| `text-primary` | `#fafafa` | Primary headings, button labels, high-contrast values, titles |
| `text-secondary` | `#a1a1aa` | Body copy, descriptions, secondary metadata, unselected nav labels |
| `text-muted` | `#71717a` | Captions, timestamps, disabled indicators, micro-labels |
| `text-inverse` | `#09090b` | Text rendered on top of solid violet `#a78bfa` primary buttons |

---

## 3. Typography
- **Font Family**: `Geist`, `Geist Mono`, system fallbacks (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`).
- **Heading Styling**:
  - `letter-spacing: -0.02em` (`tracking-tight`).
  - Color: `#fafafa`.
  - Crisp, confident, developer-oriented hierarchy (`h1: 2rem/2.5rem`, `h2: 1.5rem/2rem`, `h3: 1.125rem/1.5rem`).
- **Body Styling**:
  - Standard letter-spacing (`normal`).
  - Leading: Relaxed for descriptions (`leading-relaxed`), snug for tables and metadata lists (`leading-snug`).
  - Monospace: `Geist Mono`, `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace` for code snippets, stipends, and tags.

---

## 4. Elevation & Spatial Rules
- **No Heavy Drop Shadows**: Replace blur shadows with clean borders (`1px solid #27272a`).
- **Subtle Surface Shifts**: Interactive hover and active feedback occurs through surface luminance:
  - Default: `#121215` (surface_container)
  - Hover: `#18181b` (surface_container_high)
  - Active: `#222226` (surface_container_highest)
- **Focus Rings**:
  - Ring width: `2px solid #a78bfa`
  - Ring offset: `2px` with offset color `#09090b` (`ring-2 ring-[#a78bfa] ring-offset-2 ring-offset-[#09090b]`)
  - Outlines are never suppressed without a replacement focus ring.

---

## 5. Component Specifications

### Buttons
1. **Primary Button**:
   - Background: `#a78bfa` (Solid soft violet)
   - Text: `#09090b` (Deep black for extreme contrast)
   - Font: `font-semibold`, `text-sm`
   - Radius: `8px` (`rounded-lg` / `rounded-[8px]`)
   - Hover: `#bba4fb`
   - Focus: `ring-2 ring-[#a78bfa] ring-offset-2 ring-offset-[#09090b]`
2. **Secondary Button**:
   - Background: `transparent` (or `#121215`)
   - Border: `1px solid #27272a`
   - Text: `#fafafa`
   - Hover: Background `#18181b`, Border `#3f3f46`
   - Radius: `8px`
3. **Ghost Button**:
   - Background: `transparent`
   - Text: `#a1a1aa`
   - Hover: Background `#18181b`, Text `#fafafa`
   - Radius: `8px`

### Cards
- Background: `#121215` (`surface_container`)
- Border: `1px solid #27272a` (`border-outline`)
- Radius: `8px` (`rounded-lg` / `rounded-[8px]`)
- Padding: `16px` to `24px` (`p-4` to `p-6`)
- Hover: Border `#3f3f46`, subtle lift to `#18181b`

### Inputs & Form Controls
- Background: `#121215`
- Border: `1px solid #27272a`
- Text: `#fafafa`
- Placeholder: `#71717a`
- Radius: `8px`
- Focus: `border-[#a78bfa]`, `ring-2 ring-[#a78bfa]/40`

### Code Blocks & Logs
- Background: `#0c0c0f` (`surface_container_lowest`)
- Border: `1px solid #27272a`
- Font: `Geist Mono`, `text-xs` to `text-sm`
- Text: `#fafafa` and `#34d399` highlights
- Radius: `8px`

### Risk & Status Badges
- **Low Risk (Verified)**:
  - Border: `1px solid rgba(52, 211, 153, 0.3)`
  - Background: `rgba(52, 211, 153, 0.1)`
  - Text: `#34d399`
- **Medium Risk (Caution)**:
  - Border: `1px solid rgba(245, 158, 11, 0.3)`
  - Background: `rgba(245, 158, 11, 0.1)`
  - Text: `#fbbf24`
- **High Risk (Scam Alert)**:
  - Border: `1px solid rgba(239, 68, 68, 0.4)`
  - Background: `rgba(239, 68, 68, 0.12)`
  - Text: `#f87171`

---

## 6. Rules of Obsidian High-Contrast Dark
1. **Never use light backgrounds**: Pure white and slate-50 backgrounds are strictly forbidden. The page canvas is `#09090b`.
2. **Maintain zinc gray consistency**: All surface steps (`#09090b` → `#0c0c0f` → `#121215` → `#18181b` → `#222226` → `#27272a`) remain in the precise neutral zinc chromatic spectrum.
3. **Borders over shadows for separation**: Structure is defined by crisp, 1-pixel architectural borders.
4. **Accent colors for function, never decoration**: Violet `#a78bfa` denotes interactability; emerald `#34d399` denotes legitimacy and success; crimson `#ef4444` denotes threat or critical error.
5. **High contrast always**: Primary text `#fafafa` on dark surfaces satisfies AAA contrast requirements everywhere.
