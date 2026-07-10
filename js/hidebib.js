function setDisclosure(card, selector, expanded) {
  const trigger = card.querySelector(selector);
  if (trigger) trigger.setAttribute("aria-expanded", String(expanded));
}

function updateCardState(card) {
  const hasOpenDetails = Array.from(card.querySelectorAll(".pub-details")).some(function (details) {
    return !details.hidden;
  });
  card.classList.toggle("is-expanded", hasOpenDetails);
}

function togglePanel(paperId, detailsSelector, triggerSelector) {
  const card = document.getElementById(paperId);
  const details = card && card.querySelector(detailsSelector);
  if (!card || !details) return;

  const willOpen = details.hidden;

  card.querySelectorAll(".pub-details").forEach(function (item) {
    item.hidden = true;
  });
  setDisclosure(card, ".toggleabs", false);
  setDisclosure(card, ".togglebib", false);

  if (willOpen) {
    details.hidden = false;
    setDisclosure(card, triggerSelector, true);
    const content = details.querySelector("pre, .blurb");
    if (typeof loadPublicationText === "function") loadPublicationText(content);
  }

  updateCardState(card);
}

function togglebib(paperId) {
  togglePanel(paperId, ".citation-details", ".togglebib");
}

function toggleabs(paperId) {
  togglePanel(paperId, ".abstract-details", ".toggleabs");
}

function hideallbibs() {
  document.querySelectorAll(".pub-card").forEach(function (card) {
    const details = card.querySelector(".citation-details");
    if (details) details.hidden = true;
    setDisclosure(card, ".togglebib", false);
    updateCardState(card);
  });
}

function hideallabs() {
  document.querySelectorAll(".pub-card").forEach(function (card) {
    const details = card.querySelector(".abstract-details");
    if (details) details.hidden = true;
    setDisclosure(card, ".toggleabs", false);
    updateCardState(card);
  });
}

function toggleblock(blockId) {
  const block = document.getElementById(blockId);
  if (block) block.hidden = !block.hidden;
}

function hideblock(blockId) {
  const block = document.getElementById(blockId);
  if (block) block.hidden = true;
}

async function copyCitation(button) {
  const target = document.getElementById(button.dataset.copyTarget);
  if (!target || !target.textContent.trim()) return;

  const text = target.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
  }

  button.textContent = "Copied";
  window.setTimeout(function () {
    button.textContent = "Copy";
  }, 1600);
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".toggleabs, .togglebib").forEach(function (trigger) {
    const isAbstract = trigger.classList.contains("toggleabs");
    const card = document.getElementById(trigger.dataset.paper);
    const details = card && card.querySelector(isAbstract ? ".abstract-details" : ".citation-details");

    trigger.setAttribute("aria-expanded", "false");
    if (details && details.id) trigger.setAttribute("aria-controls", details.id);
    trigger.addEventListener("click", function () {
      if (isAbstract) {
        toggleabs(trigger.dataset.paper);
      } else {
        togglebib(trigger.dataset.paper);
      }
    });
  });

  document.querySelectorAll(".copy-citation").forEach(function (button) {
    button.setAttribute("aria-live", "polite");
    button.addEventListener("click", function () {
      copyCitation(button);
    });
  });
});
