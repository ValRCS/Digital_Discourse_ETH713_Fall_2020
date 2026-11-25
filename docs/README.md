# Digital Discourse Studies — static course companion

DE0823 (legacy ETH713), Riga Technical University. English-language computational teaching materials for Digital Humanities. Infrastructure release: 25 November 2026.

## Serve locally / publish

From the repository root:

```sh
python -m http.server 8000 --directory docs
```

Open http://localhost:8000/. No Node.js, framework, package installation or build step required.

GitHub Settings → Pages → Deploy from a branch → main → /docs. Expected URL once enabled: https://valrcs.github.io/Digital_Discourse_ETH713_Fall_2020/. The .nojekyll file enables direct static serving. Repository settings are separate from this commit.

## Structure and status

- index.html: course landing page and technical lesson index.
- lessons/01-... through 08-...: permanent, year-independent lesson URLs; Week 05 is a full interactive lesson; seven others are outlines.
- assets/css/: responsive shared design and print styles.
- assets/js/: shared theme, local progress, code copying and formative quizzes. Week 05 uses dedicated JavaScript and CSS.
- assets/img/: local SVG course and Week 05 illustrations and favicon; future lesson illustrations should be optimized and have appropriate alternative text.
- resources/: notebook links, getting started, research workflow.
- datasets/: catalogue of existing source files, with provenance notes.
- playground/: roadmap; no analytical tools released yet.

Technical weeks 3–5 correspond to the repository's confirmed 2026 schedule (4, 11 and 25 November). Weeks 1–2 are foundation outlines; weeks 6–8 and project timing are provisional. Original notebooks remain canonical executable Python materials. JavaScript demos must not be described as Python execution; formal assessment remains in Moodle.

## Authoring conventions

Use relative URLs inside docs; use explicit GitHub or Colab links for canonical material outside docs. Do not use root-relative paths because the published site is a project site under a repository prefix. Keep existing notebooks and data in place. Do not duplicate large files in docs. Small curated browser datasets should include origin, license, date, language and limitations. Clearly identify synthetic examples. Never put secrets, private student data or assessed solutions on this public site.

Each full lesson should add learning objectives, conceptual explanations, interactive demonstrations, real Python examples linked to notebooks, Digital Humanities interpretation, formative self-checks, exercises and previous/next navigation. Keep incomplete sections explicitly labelled.

Shared JS conventions: data-progress attributes must have unique stable lesson-prefixed keys; data-progress-count displays the local checklist count. Code-copy controls use data-copy targeting a code element ID, with a live feedback element in .code-block. Quiz fieldsets use data-quiz, data-answer, data-explanation, unique radio names, data-check and data-feedback. Load exercises.js only where needed. Getting started contains a working example of copying and quiz feedback.

## Verification

Before release run `python scripts/check_docs.py` from the repository root. It verifies HTML parsing, duplicate IDs, local links and anchors, project-relative paths, repository links and expected lesson skeletons. For JavaScript syntax, use `node --check docs/assets/js/main.js` and `node --check docs/assets/js/exercises.js` when Node is available (not required to serve).

Manual smoke test: serve locally; navigate all lessons and resource pages; try theme switching, reload persistence, checklist, clipboard and quiz feedback; inspect at mobile and desktop widths and navigate by keyboard. Verify the deployed URL after Pages activation. Local progress is personal, device/browser-specific and not an assessment record.

## Week 05 verification

Three exact .html.txt browser fixtures are in datasets/web-scraping/. Run `python scripts/check_docs.py`, `node --check docs/assets/js/week05-web-scraping.js` and `node scripts/test_week05.js`. Serve over HTTP and smoke-test format switching, tree, selectors, record rules and downloads, HTTP, tables, corpus, quizzes, theme and mobile layout. Browser demonstrations do not execute Python. Default: 5 blocks, 4 retained, 1 skipped.
