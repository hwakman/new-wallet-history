---
name: quick-fix
description: Fast, small UI fixes — style tweaks, wording changes, adding or removing components
argument-hint: <describe the small UI fix>
model: haiku
---

Make this small UI fix directly. No plan mode, no subagents, no todo list — just do it.

Request: $ARGUMENTS

## Scope

Typical asks: tweak a style, change some wording/text, add a small component, remove a component. Edit whichever file(s) the fix actually lives in — don't restrict to one path, but don't touch anything the fix doesn't need either.

## Rules

- Smallest diff that satisfies the request. No refactors, no new abstractions, no unrelated cleanup.
- Mobile-first, light theme only — no dark mode (`dark:` variants, `prefers-color-scheme: dark`), no desktop-only layouts.
- No tests — component or e2e.
- Finish with `npm run build` as a quick compile check and report the result in one line.
