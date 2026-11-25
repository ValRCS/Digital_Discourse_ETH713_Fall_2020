"""Verify the actual Week 01 displayed Python snippets and edge cases using CPython."""
from html.parser import HTMLParser
from pathlib import Path
from contextlib import redirect_stdout
from io import StringIO
import unicodedata
class Snippets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current = None
        self.snippets = {}
    def handle_starttag(self, tag, attrs):
        key = dict(attrs).get("id", "")
        if tag == "code" and key.startswith("w01-code-"):
            self.current = key
            self.snippets[key] = ""
    def handle_endtag(self, tag):
        if tag == "code":
            self.current = None
    def handle_data(self, data):
        if self.current:
            self.snippets[self.current] += data

page = Path(__file__).resolve().parents[1] / "docs/lessons/01-python-introduction/index.html"
parser = Snippets()
parser.feed(page.read_text(encoding="utf-8"))
expected = {
    "hello": "Hello, Digital Humanities!\nSveika, Rīga!\n5\n",
    "types": "<class 'int'>\n<class 'str'>\n",
    "arith": "14\n20\n2.5 2 2\n23\n5\n4\n",
    "strings": "4\nR a Rī\nRĪGA\nRīga\nCity: Rīga\n",
    "methods": "  rīga ir skaista. rīga lasa.  \nRīga ir skaista. Rīga lasa.\n['Rīga', 'ir', 'skaista.', 'Rīga', 'lasa.']\n2\n  Jelgava ir skaista. Jelgava lasa.  \n",
    "if": "Include in corpus\n",
    "collections": "rīga 1937\n3\n",
    "loop": "rīga\nlasīt\nrīga\nbibliotēka\n",
    "fn": "3\n",
    "research": "Character count: 56\nWhitespace tokens: 9\nUnique tokens: 5\n",
}
assert set(parser.snippets) == {"w01-code-" + key for key in expected}
for key, want in expected.items():
    code = parser.snippets["w01-code-" + key]
    stdout = StringIO()
    with redirect_stdout(stdout):
        exec(compile(code, key, "exec"), {})
    assert stdout.getvalue() == want, (key, stdout.getvalue(), want)
assert len("Rīga") == 4 and len("e\u0304") == 2 and len("😀") == 1
assert "Rīga"[-2:4] == "ga"
assert " \u0085Rīga\u001clasa\u00a0".split() == ["Rīga", "lasa"]
assert "\ufeff".split() == ["\ufeff"]
assert bool("False") and not bool("")
assert int(4.75) == 4
for fn, value, error in [(int, "Rīga", ValueError), (float, "", ValueError), (int, None, TypeError)]:
    try:
        fn(value)
    except error:
        pass
    else:
        raise AssertionError((fn, value, error))
assert "".join(" " if unicodedata.category(c).startswith("P") else c for c in "a,b").split() == ["a", "b"]
print(f"Week 01: {len(expected)} displayed Python snippets and semantic edge cases passed.")
