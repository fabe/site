# Tailwind DRY cleanup plan

Scope: personal site routes and shared components. Do not proactively refactor `app/routes/work.tsx` or `app/routes/work/**`; only touch `/work` files if a shared component/API/class rename requires a small compatibility update. Preserve the current visual design; this is a structural refactor of repeated Tailwind class strings and small duplicated patterns, not a redesign.

## Scan summary

I scanned the route tree, shared components, Tailwind config, and global CSS. The styling language is already coherent, but the code repeats the same visual primitives in many places:

- Page titles repeat across `colophon`, `patents`, `playlists`, `photos`, `login`, `globe`, and post/photo detail pages.
- Muted text and metadata repeat: `text-sm text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark` and variants.
- Rounded media frames repeat in `Prose`, `ImageLightbox`, `Video`, `Figures`, photo cards, and post covers.
- Overlay borders repeat: `absolute inset-0 pointer-events-none ... border border-neutral-800/5 dark:border-white/5`.
- Action button backgrounds repeat in `Links`, `Prose`, figures, `BioHeader`, post/photo back buttons, share buttons, and globe CTA.
- Backdrop/lightbox styling repeats in `Dialog`, `Lightbox`, and `ImageLightbox`.
- List/definition row structures repeat in home sections, posts, patents, colophon, playlists, and resume.
- Conditional class composition is currently hand-written with template strings, which makes small class mistakes easy.

## Guardrails

1. No significant visual changes.
2. Keep Tailwind classes visible where they encode one-off layout decisions.
3. Extract only stable primitives that are reused or clearly semantic.
4. Prefer small typed components and class constants over broad generic abstractions.
5. Do not refactor `/work` route files. Small mechanical updates inside `/work` are allowed only when required by shared component/API/class changes, so the codebase continues to build.
6. Run `pnpm lint` and `pnpm build` after implementation.

## Proposed implementation order

### 1. Add a tiny class composition helper

Create `lib/cn.ts`:

```ts
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
```

Use it only where it replaces brittle template-string conditionals. Do not introduce a dependency for this.

Primary targets:

- `components/Badge/index.tsx`
- `components/MediaCard/index.tsx`
- `components/ImageLightbox/index.tsx`
- `components/Video/index.tsx`
- `app/routes/photos/index.tsx`
- `app/routes/photos/$slug/index.tsx`
- `app/routes/login.tsx`

### 2. Centralize text primitives without changing typography

Create a small file such as `components/Typography/index.tsx` or `components/ui/text.tsx` with class constants/components:

- `pageTitleClass`
  - `text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl`
- `pageTitleSpacedClass`
  - `pb-6 sm:pb-12` + `pageTitleClass`
- `mutedTextClass`
  - `text-neutral-500 dark:text-silver-dark`
- `smallMutedTextClass`
  - `text-sm text-neutral-500 [font-variation-settings:'opsz'_14] dark:text-silver-dark`
- `captionClass`
  - `text-sm text-neutral-500 dark:text-silver-dark text-balance text-center pt-4`

Then replace exact repeats in:

- `app/routes/colophon.tsx`
- `app/routes/patents.tsx`
- `app/routes/playlists.tsx`
- `app/routes/photos/index.tsx`
- `app/routes/photos/$slug/index.tsx`
- `app/routes/login.tsx`
- `app/routes/globe.tsx`
- `components/Home/*`
- `components/Prose.tsx`
- `components/Video/index.tsx`
- `components/ImageLightbox/index.tsx`
- `components/Lightbox/Photo.tsx`
- `components/MediaCard/index.tsx`

This should be class-constant extraction, not a heavy component hierarchy.

### 3. Fix `LinkButton` / action-button duplication

`components/Links/index.tsx` already contains the animated pill background, but several callers pass a full duplicate button style through `className`:

- `app/routes/posts/$slug.tsx`
- `app/routes/photos/$slug/index.tsx`
- `components/Prose.tsx`
- `components/BioHeader/index.tsx`

Refactor `LinkButton` and `LinkShare` around one shared internal primitive, e.g. `ActionButtonShell`:

- outer: `group relative isolate flex items-center leading-tight gap-1 text-sm px-2 py-1.5`
- background span: current rounded animated bg classes
- content span: current icon/text typography classes

Then callers should pass only true layout overrides like `-ml-2`, `-mr-2`, `self-start`, `hidden sm:block`, not complete visual button definitions.

This is high value because it removes repeated classes while preserving exactly the existing button look.

### 4. Add reusable media frame primitives

Create `components/Frame/index.tsx` or `components/ui/frame.tsx` with:

- `frameClass`
  - `relative overflow-hidden bg-gray-100 dark:bg-neutral-800/75`
- `roundedFrameClass`
  - `rounded-xl sm:rounded-2xl`
- `mediaBorderClass`
  - `absolute inset-0 pointer-events-none box-border border border-neutral-800/5 dark:border-white/5`
- `MediaBorder({ radius })`
- optionally `MediaFrame({ children, className, radius = "xl" })`

Replace duplicated frame/border markup in:

- `components/Prose.tsx`
- `components/ImageLightbox/index.tsx`
- `components/Video/index.tsx`
- `components/Figures/*`
- post cover image wrapper if useful

Keep one-off layout classes where they are. The goal is to remove repeated rounded/background/border formulas.

### 5. Extract image caption once

`ProseCaption` exists in `components/Prose.tsx`, but other components duplicate the same caption class.

Move it to a neutral shared component, e.g. `components/Caption/index.tsx` or `components/Typography`:

- Used by `ProseImageToggle`
- `ImageLightbox`
- `Video.SimplePlayer`
- `Video.Player`
- potentially figure components

Then keep `ProseCaption` as a re-export or alias if MDX imports expect it.

### 6. Normalize section/list rows

`HomeSection` is a good start. Extend the pattern without over-abstracting:

- Add `SectionHeading` for `text-neutral-500 dark:text-silver-dark` h3s.
- Add `DefinitionList` / `DefinitionRow` only if it stays readable.
- Use it for `Resume`, `Posts` route list, `Patents`, and `Colophon` where the `dl/dt/dd` structure is duplicated.

Do not hide all markup. These pages are content-heavy and should remain easy to scan.

### 7. Clean `MediaCard`

Refactor `components/MediaCard/index.tsx` into small internal constants/components:

- `cardRowClass`
- `borderTopClass`
- `SkeletonBlock`
- `MediaArtwork`
- `MediaText`

Also fix this subtle output issue:

```ts
subtitle={`${artist}${album ? ` · ${album}` : null}`}
```

should become:

```ts
subtitle={album ? `${artist} · ${album}` : artist}
```

That is not visual cleanup, but it prevents the string `null` from rendering.

### 8. Clean photo route components

Public photo routes have dense Tailwind and local logic. Extract local helpers/components, not global abstractions unless reused:

- `PhotoSetCard` can keep its layout but use shared `pageTitleClass`, `cn`, and media-border helpers.
- `PhotoThumbnail` can use `cn` and a small `photoFallbackColor(id)` helper.
- Move repeated color fallback/gradient helpers into local pure functions or `lib/photoColors.ts` if shared between `/photos` and `/photos/$slug`.
- Remove comments that just restate the class names (`Fixed gradient overlay`, `White border on dark mode`) once the components are named clearly.

### 9. Clean lightbox/dialog overlays

Backdrop classes repeat in:

- `components/Dialog/index.tsx`
- `components/ImageLightbox/index.tsx`
- `components/Lightbox/index.tsx`

Extract:

- `glassBackdropClass`
  - `bg-gray-50/80 dark:bg-neutral-900/80 backdrop-blur-[50px] backdrop-saturate-[2]`
- `dimBackdropClass` for the darker lightbox shell where needed

Keep z-index and layout local because each overlay has different stacking behavior.

### 10. Clean video controls carefully

`components/Video/index.tsx` has the densest interactive class soup. Refactor internally only:

- `ControlIconButton`
- `OverlayButton`
- `controlVisibilityClass(isVisible)` via `cn`
- shared motion transition constants for play/pause icon swaps
- shared caption component

Avoid changing event behavior or animation timings.

### 11. Optional: promote stable utilities into `globals.css`

Only for formulas used everywhere and already conceptually global:

- `.media-border`
- `.caption`
- `.text-muted-sm`
- maybe `.page-title`

Use this sparingly. Component class constants may be better because they are easier to type and co-locate with React components.

## Files likely touched

High confidence:

- `lib/cn.ts`
- `components/Links/index.tsx`
- `components/MediaCard/index.tsx`
- `components/ImageLightbox/index.tsx`
- `components/Video/index.tsx`
- `components/Prose.tsx`
- `components/Home/Section.tsx`
- `components/Home/Resume.tsx`
- `components/Home/Projects.tsx`
- `components/Home/NowPlaying.tsx`
- `components/Layouts/index.tsx`
- `app/routes/colophon.tsx`
- `app/routes/patents.tsx`
- `app/routes/playlists.tsx`
- `app/routes/photos/index.tsx`
- `app/routes/photos/$slug/index.tsx`
- `app/routes/posts/$slug.tsx`
- `app/routes/login.tsx`
- `app/routes/globe.tsx`

Possible, if the extraction stays clean:

- `components/Figures/*`
- `components/Dialog/index.tsx`
- `components/Lightbox/index.tsx`
- `components/Lightbox/Photo.tsx`
- `components/Tooltip/index.tsx`

Avoid unless necessary:

- `app/routes/work.tsx` — compatibility-only changes, no cleanup/refactor
- `app/routes/work/**` — compatibility-only changes, no cleanup/refactor
- `components/BioHeader/index.tsx` if it is only used by `/work`
- generated files

## Additional class-name and custom modifier audit

The class vocabulary itself needs cleanup too. A lot of names are useful, but some are legacy, ambiguous, unused, or likely invalid Tailwind utilities.

### Current custom class inventory

Keep, but possibly rename/document:

- `.link` — heavily used and semantically useful for prose/content links.
- `.time` / `.time-lg` — used across post/photo/patent metadata. Consider renaming to `.metadata` / `.metadata-lg` if used for non-time text, but not required.
- `.badge` — used by `Badge`; should ideally become an internal `badgeClass` in `components/Badge` or a semantic component-only class.
- `.list-container`, `.list-title`, `.list-content` — useful but generic. Consider `content-list`, `content-list-term`, `content-list-detail` or move into `DefinitionList` components.
- `.material-glass` — useful, but name is visually vague. Consider `glass-panel` or `frosted-panel`.
- `.island` — only used for nav buttons. Rename to `nav-island` or fold into an `IslandButton` component.
- `.prose-custom` — keep as-is or rename to `site-prose`; this is genuinely global typography.
- `.code-input` — only login OTP. Keep or move to `LoginCodeInput` component styles.

Likely remove or fold into components:

- `.link-share` — appears defined but the React `LinkShare` component does not use it. Remove or reuse internally.
- `.link-back` — appears defined but public route back links use `LinkButton`. Remove if unused after checking `/work` is intentionally excluded.
- `.paragraph-lg` — appears unused outside its CSS definition. Remove if no MDX/content depends on it.
- `.text-shadow` — generic but overloaded. If kept, create explicit variants (`text-shadow-sm`, `text-shadow-lg`) or inline the few uses.
- `.mask-gradient` — only one public use; either keep as `mask-fade-top`/`mask-fade-bottom` or inline.

### Suspicious or probably invalid Tailwind classes/modifiers

These should be verified and either fixed or added deliberately to `tailwind.config.cjs`:

- `m:px-0` in `components/Layouts/index.tsx` — likely a typo for `sm:px-0`, `md:px-0`, or no class.
- `xs:h-[45%]` in `app/routes/photos/index.tsx` — no `xs` screen is defined in `tailwind.config.cjs`; either add an `xs` breakpoint or remove/replace.
- `duration-250` and `delay-50` in `components/Navigation/Archipelago.tsx` — not default Tailwind values and not configured. Replace with configured values or extend the theme.
- `cubic-bezier(...)` used as a class in `components/Prose.tsx` and figures — not a valid utility. Replace with an existing `ease-*` token or add a named timing function.
- `saturate-120` in `app/routes/photos/$slug/index.tsx` — default Tailwind has `saturate-100`, `saturate-150`, etc.; either use an arbitrary value (`saturate-[1.2]`) or configure it.
- `text-shadow-xs` / `text-shadow-lg` appear in components, but only `.text-shadow` is defined. Add real utilities or replace with the existing class/arbitrary CSS.
- `dark:mix-blend-darken` in `components/Counter/index.tsx` works only if Tailwind has that blend mode available; verify generated CSS.
- Arbitrary `backdrop-brightness-[.85]`, `backdrop-saturate-[1.1]`, `top-[15%]`, `z-[60]`, etc. are valid, but should be reserved for genuinely one-off layout values.

### Naming conventions to adopt

Use a small, boring naming system:

- Components: `PascalCase` React components (`PageTitle`, `Caption`, `MediaFrame`, `ActionButton`).
- Class constants: `camelCase + Class`, e.g. `pageTitleClass`, `captionClass`, `mediaBorderClass`.
- Global CSS utilities: only for truly cross-cutting styles, with names that describe the rendered primitive:
  - `glass-panel` instead of `material-glass`
  - `nav-island` instead of `island`
  - `site-prose` instead of `prose-custom` if renamed
  - `content-list*` instead of `list-*`
- Avoid component-specific global classes unless the component is third-party or selector-driven (`cmdk`, Reach Dialog, Mapbox).

### Custom modifier cleanup plan

1. Add/verify all intentional custom tokens in `tailwind.config.cjs`:
   - screens: only add `xs` if the design actually needs it.
   - durations/delays: either add `250` and `50`, or replace usages with defaults.
   - timing functions: replace raw `cubic-bezier(...)` class attempts with named `ease-*` tokens.
   - text shadows: add a `textShadow` plugin/utility only if multiple sizes are needed; otherwise keep a single `.text-shadow` utility.
2. Delete dead utilities after confirming no MDX-generated markup depends on them.
3. Rename global classes only in a single pass, with a compatibility check via `rg` after each rename.
4. Prefer component wrappers over new CSS class names for repeated React UI.
5. Keep third-party selector styling in `globals.css` (`[cmdk-*]`, `[data-reach-dialog-*]`, `.mapboxgl-*`) because those are not naturally component-scoped.

### Extra implementation step

Before starting the component DRY refactor, run a quick “class hygiene” pass:

- Fix the suspicious invalid utilities listed above.
- Remove definitely unused utilities (`link-share`, `paragraph-lg`, likely `link-back`) only after checking public routes and `/work` consumers; if `/work` uses one, either keep it or make a minimal compatibility update.
- Decide whether `material-glass`, `island`, and `list-*` should be renamed now or kept stable to reduce churn.
- Add comments in `tailwind.config.cjs` for any custom screens/timing values that stay.

## Success criteria

- No broad visual changes in light or dark mode.
- Repeated long class strings are moved into named primitives.
- Page files read like content/layout again, not walls of Tailwind.
- Shared components expose meaningful props instead of accepting full visual restyles everywhere.
- Custom class names are semantic and consistently scoped.
- Accidental/invalid Tailwind utilities are removed or explicitly configured.
- `pnpm lint` passes.
- `pnpm build` passes.
