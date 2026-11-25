"""Independent checks for the canonical Week 03 Python policy and fixtures."""
from pathlib import Path
from collections import Counter
import json
import re
import unicodedata
import csv
import io

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / "docs/datasets/text-processing"
PATTERN = r"[^\W\d_]+(?:[’'-][^\W\d_]+)*"

def tokenize(text):
    return re.findall(PATTERN, unicodedata.normalize("NFC", text).casefold())

def main():
    data = json.loads((FOLDER / "synthetic_samples.json").read_text(encoding="utf-8"))
    assert len(data["records"]) == len(data["synthetic"]) == 2
    assert tokenize("") == tokenize("!? — 2026") == []
    assert tokenize("Ri\u0304ga RĪGA") == ["rīga", "rīga"]
    assert tokenize("“Alice’s” well-known — dzīvē, 2026") == ["alice’s", "well-known", "dzīvē"]
    assert tokenize("Straße") == ["strasse"]  # browser lowercasing differs
    assert len("Rīga") == 4 and len("Rīga".encode("utf-8")) == 5
    nfd = unicodedata.normalize("NFD", "Rīga")
    assert len(nfd) == 5 and len(nfd.encode("utf-8")) == 6
    for record in data["records"]:
        lines = (ROOT / record["source"]).read_text(encoding="utf-8").split("\n")
        for segment in record["segments"]:
            first, last = segment["lines"]
            assert "\n".join(lines[first-1:last]) == segment["text"]
        body = "\n".join(s["text"] for s in record["segments"] if s["kind"] == "body")
        raw = "\n".join(s["text"] for s in record["segments"])
        assert (FOLDER / (record["id"] + "_excerpt.txt")).read_text(encoding="utf-8") == body + "\n"
        words = tokenize(body)
        counts = {}
        for word in words:
            counts[word] = counts.get(word, 0) + 1
        assert counts == Counter(words)
        assert sum(counts.values()) == len(words) < len(tokenize(raw))
        assert tokenize("\n".join(line for line in body.splitlines() if line.strip())) == words
        stream = io.StringIO(newline="")
        writer = csv.writer(stream, delimiter="\t")
        writer.writerow(["word", "count"])
        writer.writerows(Counter(words).most_common())
        rows = list(csv.reader(io.StringIO(stream.getvalue()), delimiter="\t"))
        assert rows[0] == ["word", "count"]
        assert {w: int(n) for w, n in rows[1:]} == counts
    assert 20 / 1000 * 1000 > 50 / 5000 * 1000
    print("Week 03 canonical Python and fixture checks passed")

if __name__ == "__main__":
    main()
