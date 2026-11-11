# JSON APIs — Digital Discourse Studies (DE0823 / ETH713)

## Current teaching notebook (2026)

**[Using_JSON_APIs_2026.ipynb](Using_JSON_APIs_2026.ipynb)** — Week 4 of the technical Python block (approximately course week 11–12). A 90-minute Google Colab demonstration connecting structured data retrieval to the Week 3 word-counting lesson.

**[Open in Google Colab](https://colab.research.google.com/github/ValRCS/Digital_Discourse_ETH713_Fall_2020/blob/main/JSON_APIs/Using_JSON_APIs_2026.ipynb)**

### Learning objectives

- Distinguish JSON text from Python dictionaries and lists; navigate nested records.
- Use **two-way JSON ↔ Python type-mapping tables** and explain parsing, serialization, deserialization, and potentially lossy round trips (e.g. tuple → array → list).
- Compare `json.loads` / `json.load` with `json.dumps` / `json.dump`; explain JSON text versus file streams, UTF-8, and Unicode escaping.
- Serialize and deserialize UTF-8 JSON with the Python standard library.
- Distinguish `response.content` (bytes), `response.text` (string), and `response.json()` (parsed data); use `requests` with timeouts, HTTP error checks, and JSON schema checks.
- Retrieve a small, explicitly selected multilingual set of MediaWiki summaries.
- Extract text, record provenance, count Unicode word forms, and export TSV.
- Explain sampling, genre, provenance, and linguistic limitations.

### Running the notebook

Open in Colab and select **Runtime → Run all**. It uses Python's standard library and `requests` (normally available in Colab); no API key, Drive mount, or paid service is needed.

The default `USE_LIVE_API = True` attempts to retrieve four MediaWiki summaries. If retrieval fails, it switches to a clearly labeled **synthetic teaching fixture** embedded in the notebook. Set `USE_LIVE_API = False` to demonstrate without internet access. **Synthetic data must not be cited as Wikipedia or empirical discourse evidence.** The source mode is saved in the corpus metadata.

### Generated outputs

- `outputs/example_record.json` — UTF-8 JSON serialization exercise.
- `outputs/discourse_corpus.json` — records plus retrieval time, source type, selection, and limitations.
- `outputs/word_frequencies.tsv` — language, word form, count.

Outputs are generated in the temporary Colab filesystem. Download them if they must be retained. The notebook includes assertions for basic consistency; a fresh Colab **Run all** should also be tested before the live session.

### Historical notebooks and resources

- [Using_JSON_APIs.ipynb](Using_JSON_APIs.ipynb) — preserved original teaching notebook; includes outdated endpoints and historical examples, not recommended as a fresh run-all.
- [Week 3: CountingWords_2026.ipynb](../TextProcessing/CountingWords_2026.ipynb)
- [JSON specification](https://www.json.org/)
- [MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page)

### Instructor guidance

The lesson is deliberately introductory: **15 minutes JSON versus Python objects, 15 minutes parsing/serialization/deserialization, 15 minutes HTTP APIs, 20 minutes structured discourse acquisition, 15 minutes word frequencies/export, and 10 minutes exercises/interpretation**. Ask students to predict the output and inspect `type()` at each representation boundary. The Wikipedia sample is a convenience sample of encyclopedic summaries, not representative social-media data. The next logical lesson is web scraping and pandas.
