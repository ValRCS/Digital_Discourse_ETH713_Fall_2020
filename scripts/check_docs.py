"""Dependency-free static checks for the course website. Run from any directory."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
REPO = "ValRCS/Digital_Discourse_ETH713_Fall_2020"
EXPECTED = (
    "01-python-introduction", "02-notebooks-libraries", "03-text-processing",
    "04-json-apis", "05-web-scraping", "06-corpus-analysis",
    "07-sentiment-analysis", "08-final-project",
)

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.duplicates = set()
        self.links = []
        self.main = 0
        self.h1 = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            if a["id"] in self.ids:
                self.duplicates.add(a["id"])
            self.ids.add(a["id"])
        self.main += tag == "main"
        self.h1 += tag == "h1"
        for key in ("href", "src"):
            if a.get(key):
                self.links.append(a[key])

def main():
    problems = []
    pages = {}
    for path in sorted(DOCS.rglob("*.html")):
        p = Page()
        p.feed(path.read_text(encoding="utf-8"))
        p.close()
        pages[path.resolve()] = p
        if p.duplicates:
            problems.append(f"{path}: duplicate IDs {p.duplicates}")
        if p.main != 1 or p.h1 != 1 or "main" not in p.ids:
            problems.append(f"{path}: expected one main and h1, and main ID")
    for slug in EXPECTED:
        if not (DOCS / "lessons" / slug / "index.html").is_file():
            problems.append(f"Missing lesson {slug}")
    for name in (".nojekyll", "index.html", "README.md"):
        if not (DOCS / name).is_file():
            problems.append(f"Missing docs/{name}")
    checked = 0
    for path, p in pages.items():
        for link in p.links:
            u = urlsplit(link)
            if u.scheme or u.netloc:
                prefixes = (
                    (f"https://github.com/{REPO}/blob/main/", ""),
                    (f"https://colab.research.google.com/github/{REPO}/blob/main/", ".ipynb"),
                )
                for prefix, suffix in prefixes:
                    if link.startswith(prefix):
                        target = ROOT / unquote(u.path.split("/blob/main/", 1)[1])
                        checked += 1
                        if not target.is_file() or (suffix and target.suffix != suffix):
                            problems.append(f"{path}: missing canonical target {link}")
                continue
            checked += 1
            if u.path.startswith("/"):
                problems.append(f"{path}: root-relative link {link}")
                continue
            target = (path.parent / unquote(u.path)).resolve() if u.path else path
            if target.is_dir():
                target = target / "index.html"
            if not target.is_relative_to(DOCS.resolve()) or not target.is_file():
                problems.append(f"{path}: broken or escaping link {link}")
            elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:
                problems.append(f"{path}: missing anchor {link}")
    for name in ("articles", "quotes", "table", "nested_articles"):
        canonical = ROOT / "WebScraping" / "fixtures" / f"sample_{name}.html"
        published = DOCS / "datasets" / "web-scraping" / f"sample_{name}.html.txt"
        if not published.is_file() or not canonical.is_file() or published.read_bytes() != canonical.read_bytes():
            problems.append(f"Week 05 fixture mismatch: {name}")
    if not pages:
        problems.append("No HTML pages found")
    print(f"Checked {len(pages)} HTML pages and {checked} local/canonical references.")
    if problems:
        print("\n".join(problems))
        return 1
    print("Static checks passed. External availability and browser behavior are not tested.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
