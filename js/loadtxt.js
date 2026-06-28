const papers = [
  "LumiX",
  "PointDreamer",
  "MoST",
  "Fancy123",
  "SASep",
  "GreenPLM",
  "MiniGPT3D",
  "Mamba3D",
  "patchDPCC",
];

$(function () {
  papers.forEach(function (paper) {
    const target = paper.toLowerCase();

    $.get("./abs/" + paper + ".txt", function (data) {
      $("#" + target + "abs").html(data);
    });

    $.get("./bib/" + paper + ".txt", function (data) {
      $("#" + target + "bib").html(data);
    });
  });
});
