# Portfolio

Personal portfolio built with Vue 3, TypeScript and Vite. Terminal-inspired design, strict types, no `any` anywhere.

> **Status:** in development. Building it in public — see [`PLAN.md`](./PLAN.md) for the full roadmap.

---

## What this is

A portfolio site that looks like a terminal and doubles as a serious TypeScript exercise. Rather than shipping a static one-pager, I'm building something with real features so the type system has to earn its place.

The centrepiece: visitors can browse my Neovim, tmux and Ghostty setup, pick the pieces they like, and download working config files generated from their selection.

---

## Features

**Projects**
Grid of work with live star counts pulled from the GitHub API. Each project has a case study page built from a typed content-block system — text, code, images and callouts render through a single component that the compiler forces me to keep exhaustive.

**Setup**
My actual dotfiles, broken down per tool. Every plugin, keybind and setting is documented, copyable, and addable to a config basket.

**Config Builder**
Pick items across Neovim, tmux and Ghostty. The app generates a real `plugins.lua`, `.tmux.conf` and `ghostty/config` from your selection, ready to copy or download. Selection persists across visits.

**Find Your Setup quiz**
Six questions about how you work. Returns a profile and a recommended starter config that drops straight into the builder.

**Uses**
Hardware and software I run, in a sortable, filterable table built as a fully generic Vue component.

**Contact**
Form validated with Zod — schema first, TypeScript types derived from it.

**Light / dark theme**
Custom palette, respects your OS preference, remembers your choice.

---

## Design

Terminal aesthetic, website behaviour. Monospace throughout, window chrome on cards, prompt-style headings, a blinking CSS cursor, code blocks that look like terminal output. It's a costume, not an emulator — everything is standard links, buttons and forms, fully keyboard accessible.

Shared colours, fonts, shadows and easing live in Tailwind’s `@theme` configuration in `src/assets/css/main.css`. Components use utility classes for layout, typography, responsive breakpoints and interaction states.

---

## Tech

|            |                                                   |
| ---------- | ------------------------------------------------- |
| Framework  | Vue 3.5 (Composition API, `<script setup>`)       |
| Language   | TypeScript 6, strict + `noUncheckedIndexedAccess` |
| Build      | Vite 8                                            |
| Routing    | vue-router 5                                      |
| State      | Pinia 4 (setup syntax)                            |
| Validation | Zod                                               |
| Runtime    | Bun                                               |
| Tooling    | oxlint, ESLint, Prettier                          |
| Styling    | Tailwind CSS 4 through the official Vite plugin   |

All pages and components use Tailwind utility classes directly in Vue templates. The stylesheet contains only the Tailwind import, theme tokens and local `@font-face` declarations. Tailwind Preflight supplies browser resets.

Use `sm:` (640px) and `md:` (768px) utilities for responsive layouts, `hover:` and `group-hover:` for interactions, and the class props on Vue’s `<Transition>` for the mobile menu. GSAP targets `data-animate` attributes for scroll and entrance animations.

---

## TypeScript approach

The project is also a study exercise. Patterns used throughout:

- **Discriminated unions** for async state, content blocks, config items and quiz questions — with `assertNever` exhaustiveness checks, so adding a variant breaks the build everywhere it isn't handled
- **Branded types** for IDs, so a `SnippetId` can't be passed where a `ProjectId` is expected
- **`as const` arrays** as the single source of truth for tags, tools and themes — types derived from data, never declared twice
- **Generic composables** — `useFetch<T>` with runtime Zod validation, `useLocalStorage<T>`
- **Generic components** — a data table typed to its rows, where a typo in a column key fails to compile
- **Zod at every boundary** — network responses, form input, localStorage reads. Nothing untrusted is cast, everything is parsed.
- **Utility types** in real use — `Extract`, `Omit`, `Partial`, `Record`, `Pick`, `ReturnType`

One rule, held for the whole project: **no `any`.** Where the type is genuinely unknown, it's `unknown` and gets narrowed.

---

## Running locally

Requires [Bun](https://bun.sh).

```sh
bun install
bun dev
```

Other commands:

```sh
bun run build       # type-check + production build
bun run type-check  # vue-tsc, no emit
bun lint            # oxlint + eslint, autofix
bun run format      # prettier
```

The GitHub API is called without authentication (60 requests/hour per IP). Responses are cached in localStorage to stay well under it.

---

## Structure

```
src/
  types/         # all shared types, one barrel export
  composables/   # useFetch, useLocalStorage, useClipboard
  stores/        # theme, config builder, toasts
  data/          # site content as typed data
  components/    # ui, layout, content, setup, quiz, table
  pages/         # one file per route
  router/
```

---

## Roadmap

See [`PLAN.md`](./PLAN.md) for the phase-by-phase build plan.

- [ ] Design system + terminal shell
- [ ] Light / dark theme
- [ ] Projects + GitHub integration
- [ ] Setup pages
- [ ] Uses table
- [ ] Quiz
- [ ] Zod validation
- [ ] Config Builder
- [ ] Accessibility, performance, deploy

---

## Licence

Code is MIT. Content and design are mine — feel free to read it, learn from it, but please don't ship it as your own portfolio.
