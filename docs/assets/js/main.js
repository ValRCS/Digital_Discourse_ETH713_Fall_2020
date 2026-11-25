"use strict";
(() => {
  const prefix = "digital-discourse-de0823:";
  const storage = {
    get(key) { try { return localStorage.getItem(prefix + key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(prefix + key, value); } catch { /* usable without storage */ } }
  };
  const theme = document.querySelector("[data-theme-toggle]");
  const preferred = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const saved = storage.get("theme");
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
  const effectiveTheme = () => document.documentElement.dataset.theme || preferred();
  function updateTheme() {
    if (!theme) return;
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    theme.textContent = next === "light" ? "Light theme" : "Dark theme";
    theme.setAttribute("aria-label", "Switch to " + next + " theme");
  }
  if (theme) {
    theme.hidden = false;
    updateTheme();
    theme.addEventListener("click", () => {
      const next = effectiveTheme() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      storage.set("theme", next);
      updateTheme();
    });
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    if (query.addEventListener) query.addEventListener("change", updateTheme);
  }
  const checks = [...document.querySelectorAll("[data-progress]")];
  function updateProgress() {
    const output = document.querySelector("[data-progress-count]");
    if (output) output.textContent = checks.filter(c => c.checked).length + " / " + checks.length + " items marked";
  }
  checks.forEach(c => {
    c.checked = storage.get("progress:" + c.dataset.progress) === "1";
    c.addEventListener("change", () => {
      storage.set("progress:" + c.dataset.progress, c.checked ? "1" : "0");
      updateProgress();
    });
  });
  updateProgress();
  document.querySelectorAll("[data-copy]").forEach(button => {
    const target = document.getElementById(button.dataset.copy);
    if (!target) return;
    button.hidden = false;
    const feedback = button.closest(".code-block")?.querySelector("[data-copy-feedback]");
    button.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(target.textContent);
        if (feedback) feedback.textContent = "Code copied.";
      } catch {
        const selection = window.getSelection();
        if (selection) {
          const range = document.createRange();
          range.selectNodeContents(target);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        if (feedback) feedback.textContent = "Select and copy the code manually (Ctrl+C or Command+C).";
      }
    });
  });
})();
