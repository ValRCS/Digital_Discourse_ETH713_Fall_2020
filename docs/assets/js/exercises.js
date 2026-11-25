"use strict";
(() => {
  document.querySelectorAll("[data-quiz]").forEach(quiz => {
    const button = quiz.querySelector("[data-check]");
    const output = quiz.querySelector("[data-feedback]");
    if (!button || !output) return;
    button.hidden = false;
    button.addEventListener("click", () => {
      const selected = quiz.querySelector('input[type="radio"]:checked');
      if (!selected) {
        output.textContent = "Choose an answer first.";
        output.className = "feedback-try";
        return;
      }
      const correct = selected.value === quiz.dataset.answer;
      output.textContent = correct ? "Correct. " + quiz.dataset.explanation : "Not quite. " + quiz.dataset.explanation;
      output.className = correct ? "feedback-good" : "feedback-try";
    });
  });
})();
