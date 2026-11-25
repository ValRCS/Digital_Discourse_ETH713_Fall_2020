"""Independent Python parity checks against the browser fixture."""
import json
import unicodedata
import math
from pathlib import Path
from collections import Counter

def tokenize(text):
    result, current = [], []
    for char in unicodedata.normalize("NFC", text):
        if unicodedata.category(char)[0] in "LMN":
            current.append(char)
        elif current:
            result.append("".join(current).lower())
            current = []
    if current:
        result.append("".join(current).lower())
    return result

def ranked(values):
    return [[w,n] for w,n in sorted(Counter(values).items(),key=lambda x:(-x[1],x[0]))]

def main():
    folder = Path(__file__).resolve().parents[1] / "docs/datasets/corpus-analysis"
    ds = json.loads((folder/"sample_media_corpus.json").read_text(encoding="utf-8"))["records"]
    expected = json.loads((folder/"expected_results.json").read_text(encoding="utf-8"))
    assert len(ds) == len({d["id"] for d in ds}) == 24
    assert tokenize("Ri\u0304ga, ĀB!") == ["rīga","āb"]
    for lang,q in [("en","climate"),("lv","klimata")]:
        docs = [d for d in ds if d["language"] == lang]
        ts = [tokenize(d["text"]) for d in docs]
        e = expected[lang]
        assert sum(map(len,ts)) == e["tokens"]
        assert sum(t.count(q) for t in ts) == e["kwic"]
        assert ranked(" ".join(t[i:i+2]) for t in ts for i in range(len(t)-1)) == e["bigrams"]
        assert ranked(w for t in ts for i,word in enumerate(t) if word == q for j,w in enumerate(t) if 0 < abs(j-i) <= 3) == e["neighbours"]
        for i,source in enumerate(["Environmental bulletin","Business bulletin"]):
            corpus = [w for d in docs if d["metadata"]["source"] == source for w in tokenize(d["text"])]
            row = e["comparison"]["rows"][0]
            assert len(corpus) == e["comparison"]["totals"][i]
            assert corpus.count(q) == row["counts"][i]
            assert math.isclose(corpus.count(q)/len(corpus)*1000,row["rates"][i])
    print("Week 06 Python parity checks passed")

if __name__ == "__main__":
    main()
