"""Check Week 05 examples against actual Beautiful Soup (pip install beautifulsoup4)."""
from pathlib import Path
import bs4
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "WebScraping/fixtures/sample_nested_articles.html").read_text(encoding="utf-8")
checks = {
    "#article-123 p": 4,
    "#article-123 > p": 2,
    "#article-123 > h2 + p": 1,
    "#article-123 > h2 ~ p": 2,
    "article.news": 2,
    "article .news": 1,
    ".news.culture": 1,
    'a[href$=".pdf"]': 1,
    'a[href^="/articles/"]': 2,
    '[lang="en"]': 1,
    "article:not(.advertisement)": 2,
    "li:nth-child(2)": 1,
    ".missing": 0,
    "article:has(h2)": 3,
}
soup = BeautifulSoup(html, "html.parser")
for selector, count in checks.items():
    assert len(soup.select(selector)) == count, selector
soup = BeautifulSoup('<p class="intro">Rīga</p>', "html.parser")
p = soup.p
values = [html, soup, p, p.string, p.get_text(), soup.find_all("p"),
          soup.select("p"), soup.find("h1"), p.attrs, {"text": p.get_text()}]
expected = ["str", "BeautifulSoup", "Tag", "NavigableString", "str",
            "ResultSet", "ResultSet", "NoneType", None, "dict"]
for v, name in zip(values, expected):
    if name is None:
        assert isinstance(v, dict)
    else:
        assert type(v).__name__ == name, (name, type(v).__name__)
assert p.attrs["class"] == ["intro"]
examples = [
    ("<p> Digitālās<strong>humanitārās</strong>zinātnes </p>",
     [" Digitālās", "humanitārās", "zinātnes "]),
    ("<p> biblio<em>tē</em>ka </p>", [" biblio", "tē", "ka "]),
]
for markup, nodes in examples:
    tag = BeautifulSoup(markup, "html.parser").p
    for sep in ("", " ", "\n"):
        for strip in (True, False):
            expected = sep.join([n.strip() for n in nodes if n.strip()] if strip else nodes)
            assert tag.get_text(sep, strip=strip) == expected
print(f"Beautiful Soup {bs4.__version__}: 14 selectors, 10 object types, 12 whitespace cases passed.")
