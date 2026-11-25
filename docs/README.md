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
- lessons/01-... through 08-...: permanent, year-independent lesson URLs; all eight are outlines in this release.
- assets/css/: responsive shared design and print styles.
- assets/js/: shared theme, local progress, code copying and formative quizzes. Lesson-specific scripts can be added later.
- assets/img/: local SVG course illustration and favicon; future lesson illustrations should be optimized and have appropriate alternative text.
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
