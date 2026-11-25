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
- lessons/01-... through 08-...: permanent, year-independent lesson URLs; Weeks 01, 02, 04, 05, 06 and 07 are full interactive lessons; two others are outlines.
- assets/css/: responsive shared design and print styles.
- assets/js/: shared theme, local progress, code copying and formative quizzes. Weeks 01, 02, 04, 05, 06 and 07 use dedicated JavaScript and CSS.
- assets/img/: local SVG course and Week 05 illustrations and favicon; future lesson illustrations should be optimized and have appropriate alternative text.
- resources/: notebook links, getting started, research workflow.
- datasets/: catalogue of existing source files, with provenance notes.
- playground/: dynamic archive sandbox available; other tools planned.

Technical weeks 3–5 correspond to the repository's confirmed 2026 schedule (4, 11 and 25 November). Weeks 1–2 are full foundational lessons; weeks 6–8 and project timing are provisional. Original notebooks remain canonical executable Python materials. JavaScript demos must not be described as Python execution; formal assessment remains in Moodle.

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

## Week 04 Version 1 · 25 November 2026

90-minute JSON and APIs companion: JSON validator, nested tree, Python type mappings, round-trip and Unicode labs, HTTP simulator, local corpus builder and JSON/TSV exports, language-specific word frequencies and 12 formative questions. No live API calls; browser logic uses JavaScript, and Python examples run in Colab. Local synthetic fixtures mirror canonical files under JSON_APIs/fixtures/. Run `python scripts/check_docs.py`, `node --check docs/assets/js/week04-json-apis.js`, and `node scripts/test_week04.js`. Browser smoke test: serve over HTTP, test fixture loading, invalid JSON, nested selection, Unicode, HTTP status/shape failures, corpus downloads, language and field changes, quizzes, theme, keyboard and mobile layout. JSON is the canonical export with complete provenance; TSV contains selected fields and basic source metadata.

## Week 02 Version 1 · 25 November 2026

90-minute core, six JavaScript browser laboratories, 12 formative questions, troubleshooting and eight optional topics. The new `Using_Libraries_and_Notebooks_2026.ipynb` is self-contained and uses only the standard library; historical notebooks remain unchanged. Browser demos do not execute Python; Markdown preview is deliberately limited and filesystem simulation excludes symlinks/permissions. Run `python scripts/check_docs.py`, `node --check docs/assets/js/week02-notebooks.js`, `node scripts/test_week02.js`, `python scripts/test_week02_python.py`. Also restart and run all in Jupyter/Colab and smoke-test six labs, copy, quiz, theme, keyboard and narrow screens. The Python script executes code cells, not an actual graphical notebook kernel. Temporary notebook files are isolated and removable; no live network or package installation is required.

## Week 06 Version 1 · 25 November 2026

90-minute corpus analysis lesson with seven labs, 24 synthetic multilingual documents, 12 formative quizzes, six Python examples, glossary and research exercise. Shared filters apply to the corpus, KWIC, n-grams and neighbours; comparison includes both sources. Tokenization uses Unicode NFC and letter/mark/number runs. JS models do not execute Python. Notebook companion is deferred; teaching date 2 December is provisional. Run `python scripts/check_docs.py`, `node --check docs/assets/js/week06-corpus-model.js`, `node --check docs/assets/js/week06-corpus-analysis.js`, `node scripts/test_week06.js`, and `python scripts/test_week06_python.py`. Browser smoke test: serve via HTTP; test language and metadata filters, preprocessing, zero denominators, KWIC expansion, boundaries, co-occurrences, comparison, both themes, small screens and keyboard.


## Week 07 Version 1 · 25 November 2026

90-minute core and optional multilingual/LLM extensions; eight laboratories (six core, two optional), 48 synthetic annotated documents, two editable instructional lexicons, 12 formative questions, six practical exercises, glossary and exportable research results. Four reference classes (positive, neutral, negative, mixed); unclear is an abstention column included in accuracy denominators. Browser JavaScript is deterministic and not Python/VADER/LLM inference. Dedicated notebook deferred; existing OpenAI/OpenAI.ipynb linked as historical 2025 material. Proposed date 9 December. Verify with `python scripts/check_docs.py`, `node --check docs/assets/js/week07-sentiment-model.js`, `node --check docs/assets/js/week07-sentiment-analysis.js`, `node scripts/test_week07.js`, `python scripts/test_week07_python.py`. Serve over HTTP and manually smoke-test all eight labs, invalid/empty input, local fixture loading, filters, download, mobile, keyboard, themes, quiz and clipboard. Optional VADER and corpus-upload snippets have external setup and are excluded from offline Python tests.