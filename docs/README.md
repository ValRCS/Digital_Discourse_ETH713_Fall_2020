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
- lessons/01-... through 08-...: permanent, year-independent lesson URLs; Weeks 01 and 05 are full interactive lessons; six others are outlines.
- assets/css/: responsive shared design and print styles.
- assets/js/: shared theme, local progress, code copying and formative quizzes. Week 05 uses dedicated JavaScript and CSS.
- assets/img/: local SVG course and Week 05 illustrations and favicon; future lesson illustrations should be optimized and have appropriate alternative text.
- resources/: notebook links, getting started, research workflow.
- datasets/: catalogue of existing source files, with provenance notes.
- playground/: dynamic archive sandbox available; other tools planned.

Technical weeks 3–5 correspond to the repository's confirmed 2026 schedule (4, 11 and 25 November). Week 1 is a full foundational lesson; Week 2 is a foundation outline; weeks 6–8 and project timing are provisional. Original notebooks remain canonical executable Python materials. JavaScript demos must not be described as Python execution; formal assessment remains in Moodle.

## Authoring conventions

Use relative URLs inside docs; use explicit GitHub or Colab links for canonical material outside docs. Do not use root-relative paths because the published site is a project site under a repository prefix. Keep existing notebooks and data in place. Do not duplicate large files in docs. Small curated browser datasets should include origin, license, date, language and limitations. Clearly identify synthetic examples. Never put secrets, private student data or assessed solutions on this public site.

Each full lesson should add learning objectives, conceptual explanations, interactive demonstrations, real Python examples linked to notebooks, Digital Humanities interpretation, formative self-checks, exercises and previous/next navigation. Keep incomplete sections explicitly labelled.

Shared JS conventions: data-progress attributes must have unique stable lesson-prefixed keys; data-progress-count displays the local checklist count. Code-copy controls use data-copy targeting a code element ID, with a live feedback element in .code-block. Quiz fieldsets use data-quiz, data-answer, data-explanation, unique radio names, data-check and data-feedback. Load exercises.js only where needed. Getting started contains a working example of copying and quiz feedback.

## Verification

Before release run `python scripts/check_docs.py` from the repository root. It verifies HTML parsing, duplicate IDs, local links and anchors, project-relative paths, repository links and expected lesson skeletons. For JavaScript syntax, use `node --check docs/assets/js/main.js` and `node --check docs/assets/js/exercises.js` when Node is available (not required to serve).

Manual smoke test: serve locally; navigate all lessons and resource pages; try theme switching, reload persistence, checklist, clipboard and quiz feedback; inspect at mobile and desktop widths and navigate by keyboard. Verify the deployed URL after Pages activation. Local progress is personal, device/browser-specific and not an assessment record.

## Week 05 verification

Three exact .html.txt browser fixtures are in datasets/web-scraping/. Run `python scripts/check_docs.py`, `node --check docs/assets/js/week05-web-scraping.js` and `node scripts/test_week05.js`. Serve over HTTP and smoke-test format switching, tree, selectors, record rules and downloads, HTTP, tables, corpus, quizzes, theme and mobile layout. Browser demonstrations do not execute Python. Default: 5 blocks, 4 retained, 1 skipped.

## Week 05 Version 2 · 25 November 2026

The permanent lesson URL now includes an HTML/CSS/JavaScript refresher, Beautiful Soup object and parser reference, richer CSS selector and combinator labs, whitespace model, redesign simulator, dynamic DOM demo, Developer Tools exercise and glossary. Core lecture remains 90 minutes; expandable reference material is optional. A fourth fixture `sample_nested_articles.html` is mirrored byte-for-byte under `docs/datasets/web-scraping/`. Browser DOM exercises execute JavaScript; Python object and whitespace examples are illustrative. Original three fixtures, record extraction, table and corpus labs remain unchanged. Verify `python scripts/check_docs.py`, `node --check docs/assets/js/week05-technologies.js`, `node --check docs/assets/js/week05-web-scraping.js`, `node scripts/test_week05.js`; smoke-test both fixture choices, combinators, redraw, toggles and all V1 labs in a browser.

Optional Python-level regression test: `python scripts/test_week05_bs4.py` (requires beautifulsoup4). Checks nested-fixture selectors, actual object types and whitespace combinations; attributes may be dict or a subclass depending on library version.

## Week 05 Version 3 · 25 November 2026

Optional 30–45 minute Selenium bonus after core practice, dynamic archive at playground/dynamic-archive/ and Selenium_2026.ipynb. Genuine same-origin JSON fetch, nine synthetic records, batches of three. No external service needed to serve docs. Python requires Selenium 4, Beautiful Soup, Requests and compatible browser/driver. Colab is environment dependent. Verify with python scripts/check_docs.py, node --check docs/playground/dynamic-archive/archive.js, node --check docs/assets/js/week05-selenium.js, node scripts/test_week05_v3.js and python scripts/test_week05_selenium.py (local HTTP server and Selenium). See sandbox README for stable selectors and provenance.


## Week 01 Version 1 · 25 November 2026

A 90-minute core at `lessons/01-python-introduction/` covers eight sections and seven principal labs (plus the integrated text analysis lab), 12 formative questions, five bug-fixing exercises, a glossary and six personal checklist items. The historical `Python_Introduction.ipynb` remains unchanged and executable in Colab. Browser labs are controlled JavaScript models, not Python execution; synthetic text, Python-style whitespace and code-point slicing are explicit; Unicode casing/category versions can differ across runtimes. No new dependencies. Verify `python scripts/check_docs.py`, `node --check docs/assets/js/week01-python.js`, `node scripts/test_week01.js`, and `python scripts/test_week01_python.py`. The Node test checks model results and simulated DOM event handlers; it is not a graphical browser test. Smoke-test controls, both themes, small screens, keyboard, copy and checklist. Existing Week 05 files are not changed.
