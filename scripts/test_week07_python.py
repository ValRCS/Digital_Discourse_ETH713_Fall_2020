"""Execute the offline Python examples extracted from the Week 07 HTML."""
from html.parser import HTMLParser
from pathlib import Path
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "docs/lessons/07-sentiment-analysis/index.html"
DATA = ROOT / "docs/datasets/sentiment-analysis"

class Examples(HTMLParser):
    def __init__(self):
        super().__init__()
        self.code = {}
        self.current = None
    def handle_starttag(self, tag, attrs):
        if tag == "code" and dict(attrs).get("id", "").startswith("py-"):
            self.current = dict(attrs)["id"]
            self.code[self.current] = ""
    def handle_endtag(self, tag):
        if tag == "code":
            self.current = None
    def handle_data(self, data):
        if self.current:
            self.code[self.current] += data

class TestWeek07(unittest.TestCase):
    def test_examples(self):
        p = Examples()
        p.feed(PAGE.read_text(encoding="utf-8"))
        scope = {}
        for key in ("py-token", "py-score", "py-negation", "py-metrics"):
            exec(compile(p.code[key], key, "exec"), scope)
        self.assertEqual(scope["tokenize"]("Ri\u0304ga"), ["rīga"])
        self.assertIsNone(scope["score_text"]("", {})["coverage"])
        expected = json.loads((DATA / "expected_results.json").read_text(encoding="utf-8"))
        for lang in ("en", "lv"):
            lex = json.loads((DATA / f"lexicon_{lang}.json").read_text(encoding="utf-8"))["weights"]
            for case in expected["cases"]:
                if case["lang"] == lang and not case["options"]:
                    r = scope["score_text"](case["text"], lex)
                    self.assertEqual((r["net"], r["label"]), (case["net"], case["label"]))
            corpus = json.loads((DATA / "sample_sentiment_corpus.json").read_text(encoding="utf-8"))
            labels = ["positive","neutral","negative","mixed","unclear"]
            matrix = [[0]*5 for _ in range(4)]
            for row in corpus["records"]:
                if row["language"] == lang:
                    pred = scope["score_text"](row["text"], lex)["label"]
                    matrix[labels.index(row["annotation"]["label"])][labels.index(pred)] += 1
            self.assertEqual(matrix, expected["corpusResults"][lang+"-baseline"]["matrix"])
        self.assertEqual(scope["evaluate"]([[0]*5 for _ in range(4)]), {"accuracy": None, "macro_f1": None})

if __name__ == "__main__":
    unittest.main()
