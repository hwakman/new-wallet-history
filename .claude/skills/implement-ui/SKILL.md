---
name: implement-ui
description: Quickly add or update UI by routing the request to layout, component, or styling based on its wording
argument-hint: <describe the UI change — mention layout, component, and/or styling>
modal: sonnat
---

Make the requested UI change directly. This is a quick, single-pass edit, not a project — don't enter plan mode, don't spawn subagents, don't build a todo list for it.

Request: $ARGUMENTS

## Routing

Scan the request wording for these three cases. More than one can match — handle every case that matches, each scoped to its own file/path only:

| Wording contains | Scope of the edit |
|---|---|
| "layout" | `app/layout.tsx` only — page shell, structure, providers, nav placement |
| "component" | `app/components/ui/` only — add or update a component file there (create the directory/file if it doesn't exist yet) |
| "styling" | `app/globals.css` only — theme tokens, global rules, utility layers |

If the request doesn't clearly use any of the three words, infer the single closest match from context and proceed — don't stop to ask.

## Rules

- Stay inside the matched file/path. Don't touch other app files unless the change is genuinely impossible without it (e.g. a brand-new component needs one import added at its call site to actually render) — keep any such spillover to the minimum line needed.
- Smallest diff that satisfies the request — no new abstractions, no refactors, no unrelated cleanup.
- Mobile-first, light theme only — no dark mode (`dark:` variants, `prefers-color-scheme: dark`), no desktop-only layouts.
- Do not write tests — component or e2e — for this change.
- Finish with `npm run build` as a quick compile sanity check (not a test, just confirms it builds) and report the result in one line.
