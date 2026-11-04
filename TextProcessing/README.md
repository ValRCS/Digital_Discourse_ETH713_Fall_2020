# Text Processing — Digital Discourse Studies (DE0823 / ETH713)

## Current Colab teaching notebook (2026)

**[CountingWords_2026.ipynb](CountingWords_2026.ipynb)** — Week 3 technical demonstration: from source text to reproducible word-form frequencies in English and Latvian.

**[Open CountingWords_2026.ipynb in Google Colab](https://colab.research.google.com/github/ValRCS/Digital_Discourse_ETH713_Fall_2020/blob/main/TextProcessing/CountingWords_2026.ipynb)**

In Colab, select **Runtime → Run all**, or execute cells sequentially during the lecture. The notebook downloads its two source files, works in the temporary Colab directory, and does **not** require Google Drive mounting, API keys, or manual uploads. The notebook uses Python's standard library and Matplotlib (available in standard Colab).

### What the demonstration covers

1. Downloading and inspecting corpus files with `urllib` and `pathlib`.
2. Identifying text boundaries and distinguishing metadata from analytical corpus text.
3. Tokenizing Unicode text with `re` and normalizing with NFC and `casefold()`.
4. Counting word-form frequencies using a basic dictionary and `collections.Counter`.
5. Comparing raw-source counts to cleaned-corpus counts.
6. Plotting word frequencies and interpreting their methodological limitations.
7. Writing and checking reproducible UTF-8 TSV exports.

### Input sources

- [Alice_Wonderland.txt](../data/Alice_Wonderland.txt): Lewis Carroll, *Alice's Adventures in Wonderland*, Project Gutenberg edition.
- [Veidenbaums.txt](../data/Veidenbaums.txt): Eduards Veidenbaums poems (marked titles are separated from poem-body text).

The notebook downloads both inputs from `main/data/`. As with all living repositories, results can change if the source files change. The original file is preserved in memory so cleaning can be inspected and explained.

**Processing decisions:** Alice's narrative begins at the Chapter I marker and ends before the final `THE END` label. Lines ending in `***` in the Veidenbaums source are treated as poem headings, excluded from counting but retained separately. Tokens consist of Unicode letter sequences with optional internal apostrophes or hyphens; punctuation and numbers are excluded. Frequencies are *surface word-form* frequencies, not lemmatized words. English and Latvian counts cannot be interpreted as directly equivalent lexical measures.

### Generated outputs

The notebook writes these files to the temporary Colab `outputs/` folder:

- `alice_word_frequencies.tsv`
- `veidenbaums_word_frequencies.tsv`

To retain them after a session, download the files using the Colab file browser (or the optional download snippet in the notebook). They are generated artifacts, not source files.

### Validation

The notebook has no saved execution state or embedded output images. Its core path includes assertions validating file existence, text markers, a manually constructed dictionary against `Counter`, token-count consistency, and the exported TSV header. Verify runtime compatibility before class by opening a fresh CPU Colab runtime and selecting **Runtime → Run all**.

## Historical material

The original 2020-era notebooks are retained for reference and backwards compatibility with old course links:

- [CountingWords_final.ipynb](CountingWords_final.ipynb) — extensive exploratory teaching notes; **not** recommended for a fresh Colab run without cleanup.
- [CountingWords.ipynb](CountingWords.ipynb) — older, shorter exercise.

Older `Alice_clean.txt`, `alice_word_count.tsv`, and `word_count.tsv` files in this folder are historical artifacts. The 2026 notebook generates its own working text and outputs instead of relying on these files.
