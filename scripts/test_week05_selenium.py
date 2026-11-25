"""Local end-to-end smoke test. Requires selenium, requests, bs4 and Chrome/driver."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import threading
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

ROOT = Path(__file__).resolve().parents[1]
server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT / "docs")))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_port}/playground/dynamic-archive/index.html"
driver = None
selector = "article.archive-record"
try:
    initial = requests.get(url, timeout=10)
    initial.raise_for_status()
    assert not BeautifulSoup(initial.text, "html.parser").select(selector)
    api = requests.get(url.replace("index.html", "archive.json"), timeout=10)
    api.raise_for_status()
    expected = api.json()
    assert len(expected) == 9
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    if os.environ.get("CHROME_BINARY"):
        options.binary_location = os.environ["CHROME_BINARY"]
    if os.environ.get("SELENIUM_ISOLATED_NO_SANDBOX") == "1":
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(os.environ["CHROMEDRIVER"]), options=options) if os.environ.get("CHROMEDRIVER") else webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 15)
    def click(id):
        wait.until(EC.element_to_be_clickable((By.ID, id))).click()
    def count(n):
        wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, selector)) == n and d.find_element(By.ID, "archive-status").get_dom_attribute("data-state") in ("ready", "idle"))
    driver.get(url)
    count(0)
    click("load-collection")
    count(3)
    click("load-more")
    count(6)
    click("load-more")
    count(9)
    assert not driver.find_element(By.ID, "load-more").is_enabled()
    soup = BeautifulSoup(driver.page_source, "html.parser")
    actual = [{"id": a["data-id"], "title": a.h2.get_text(strip=True), "year": int(a["data-year"]), "category": a["data-category"]} for a in soup.select(selector)]
    assert actual == expected
    Select(driver.find_element(By.ID, "archive-category")).select_by_visible_text("Research")
    count(3)
    Select(driver.find_element(By.ID, "archive-category")).select_by_visible_text("All")
    count(9)
    driver.find_element(By.ID, "archive-search").send_keys("Rīg")
    count(2)
    click("archive-reset")
    count(0)
    print("Selenium test passed: 0, 3/6/9, JSON equality, filters, search, reset.")
finally:
    try:
        if driver is not None:
            driver.quit()
    finally:
        server.shutdown()
        server.server_close()
