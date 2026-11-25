# Web scraping — Digital Discourse Studies (DE0823 / legacy ETH713)

## Technical Week 5 · 25 November 2026

**Primary notebook:** [Web_Scraping_2026.ipynb](Web_Scraping_2026.ipynb) · [Open in Google Colab](https://colab.research.google.com/github/ValRCS/Digital_Discourse_ETH713_Fall_2020/blob/main/WebScraping/Web_Scraping_2026.ipynb).

90-minute sequence: HTML versus JSON (5), document structure (10), BeautifulSoup (15), HTTP and ethics (10), records (15), pandas tables (10), discourse analysis (10), exercises (15). Optional extensions cover pagination and dynamic sites.

Prerequisites: Python strings, lists/dicts, JSON, HTTP, and word frequencies. See [Week 3](../TextProcessing/CountingWords_2026.ipynb) and [Week 4](../JSON_APIs/Using_JSON_APIs_2026.ipynb).

The default run is offline after dependencies are installed (`requests beautifulsoup4 pandas lxml`). All three synthetic fixtures are embedded in the notebook and also available under [fixtures/](fixtures/). They are invented examples, not empirical observations. Optional single-page live mode uses Quotes to Scrape and explicitly labels any fallback. No SS.com live request is required. Outputs go to `outputs/web_scraping_2026/`.

## Optional browser automation · Version 3

[Selenium_2026.ipynb](Selenium_2026.ipynb) · [Colab](https://colab.research.google.com/github/ValRCS/Digital_Discourse_ETH713_Fall_2020/blob/main/WebScraping/Selenium_2026.ipynb) · [Dynamic archive sandbox](https://valrcs.github.io/Digital_Discourse_ETH713_Fall_2020/playground/dynamic-archive/index.html) · [Bonus lesson](https://valrcs.github.io/Digital_Discourse_ETH713_Fall_2020/lessons/05-web-scraping/#selenium-bonus).

Selenium 4 workflow with explicit waits, cleanup, direct and hybrid extraction, JSON comparison and exports. Local compatible browser/driver required; Colab compatibility is not guaranteed. Set ARCHIVE_URL for a local server. The archive is synthetic and public for bounded teaching practice. Historical notebook unchanged.

## Historical material (preserved)

| File | Purpose |
|---|---|
| [WebScraping.ipynb](WebScraping.ipynb) | Short conceptual introduction |
| [Web_Scraping.ipynb](Web_Scraping.ipynb) | Concise pandas example |
| [Web Scraping with Pandas.ipynb](Web%20Scraping%20with%20Pandas.ipynb) | Earlier pandas demonstration |
| [Web Scraping Apartments.ipynb](Web%20Scraping%20Apartments.ipynb) | Exploratory BeautifulSoup |
| [Web_Scraping_Apartments.ipynb](Web_Scraping_Apartments.ipynb) | Extended SS.com scraper |
| [Selenium.ipynb](Selenium.ipynb) | Historical browser automation, some deprecated syntax |

The historical [CSV](agenskalns.csv), [JSON](agenskalns.json) and [Excel](agenskalns.xlsx) exports contain apartment listing data, not current prices. Descriptions may be truncated. Live legacy code has not been revalidated; inspect site policies and layout before running. Prefer the 2026 notebook for class.
