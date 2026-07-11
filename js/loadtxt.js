const publicationFiles = {
  lumix: "LumiX",
  pointdreamer: "PointDreamer",
  most: "MoST",
  fancy123: "Fancy123",
  sasep: "SASep",
  greenplm: "GreenPLM",
  minigpt3d: "MiniGPT3D",
  mamba3d: "Mamba3D",
  patchdpcc: "patchDPCC",
};

async function loadPublicationText(panel) {
  if (!panel || panel.dataset.loadState === "loading" || panel.dataset.loadState === "loaded") return;

  const kind = panel.classList.contains("blurb") ? "abs" : "bib";
  const key = panel.id.replace(new RegExp(`${kind}$`), "");
  const file = publicationFiles[key];
  if (!file) return;

  const details = panel.closest(".pub-details");
  const copyButton = details && details.querySelector(".copy-citation");

  panel.dataset.loadState = "loading";
  panel.textContent = "Loading…";
  if (details) details.setAttribute("aria-busy", "true");
  if (copyButton) copyButton.disabled = true;

  try {
    const response = await fetch(`./${kind}/${file}.txt`);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    panel.textContent = await response.text();
    panel.dataset.loadState = "loaded";
  } catch (error) {
    panel.textContent = "This content is temporarily unavailable. Please try again.";
    panel.dataset.loadState = "error";
    console.warn(`Could not load ${kind}/${file}.txt`, error);
  } finally {
    if (details) details.removeAttribute("aria-busy");
    if (copyButton) copyButton.disabled = panel.dataset.loadState !== "loaded";
  }
}
