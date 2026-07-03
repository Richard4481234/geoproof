# GeoProof — Project Notes

Read this first in any new chat picking up this project — it has everything
needed to continue without re-deriving context.

## What this is

GeoProof is a static multi-page HTML/SVG/JS site of interactive geometry
explorers, stored in this folder (`E:\Geometry Visual Project`). Published
live at https://richard4481234.github.io/geoproof/ via the public GitHub
repo `Richard4481234/geoproof` (GitHub Pages, deploys from the `main`
branch root).

## Standing rule — always ask before publishing

Edit/build locally first. Never upload, commit, or push to GitHub without
asking for explicit confirmation in chat — every single time, even if a
previous chat already approved a different upload. This is a permanent
rule, not a one-time approval that carries forward.

## Conventions for tool pages

- `index.html` — landing page, CSS-grid `.panel` cards. Each active tool is
  `<a class="panel active" href="...">` with a small original SVG icon
  (`viewBox="0 0 120 120"`), an `<h2>` title, and a one-sentence `<p>`
  description. Not-yet-built topics use `<div class="panel disabled">`
  with a `.badge-soon` "Coming soon" span.
- Standalone tool pages are named `<TopicName>-Visual.html` (e.g.
  `TriangleInequality-Visual.html`). Best templates to copy conventions
  from: `TriangleInequality-Visual.html` and `LawOfCosines-Visual.html` —
  shared `<style>` block, `viewBox="0 0 680 560"` SVG canvas, `&larr;
  GeoProof` back-link, slide-out `#info-drawer` ("ⓘ About this theorem"
  button + backdrop/Escape/close), `fmt()` / `toSvgPoint()` / pointer-drag
  JS helper patterns.
- Verify any new math independently before trusting it (a small throwaway
  Python/Node fuzz-test script), and run `node --check` on the extracted
  `<script>` contents. Local `file://` preview is blocked in Claude in
  Chrome in this environment — rely on static review + math/syntax checks,
  then verify interactively on the live site after publishing.

## Publishing workflow (once explicitly approved)

Upload changed/new files via `https://github.com/Richard4481234/geoproof/upload/main`,
commit, then check the repo's Actions tab for the `pages-build-deployment`
workflow to confirm the rebuild succeeded before reporting it's live.

## Automation already running

A daily scheduled task, `geoproof-auto-builder`, researches and builds one
new visual per day, holding each as "Pending Review" in `PIPELINE-LOG.md`
(same folder) — it never auto-publishes. That log file tracks what's
published, what's pending review, and candidate/skipped theorems. Pause or
resume the automation by asking Claude to disable/enable the
`geoproof-auto-builder` scheduled task — no other setup needed.

## Bash sandbox note

If using the shell, the mounted copy of this folder can lag behind direct
file-tool (Read/Write/Edit) writes. Treat Read-tool output as the source of
truth when verifying recent edits, not `grep`/`cat` via bash.
