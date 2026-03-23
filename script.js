//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

// ШАГ-3.  итерируем массив из объектов и вставляем карточки в html
function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (const episode of episodeList) {
    rootElem.append(makeEpisodeCard(episode)) //отправляем итерируемый эпизод и возвращаем карточку, которую вставляем в html
  }
}

//ШАГ-1.   например: S02E01
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`
}

//ШАГ-2.   собираем карту
function makeEpisodeCard({name, season, number, image, summary}) {
  let div = document.createElement("div");
  div.innerHTML = `
  <h2>${name}</h2>
  <p>${formatEpisodeCode(season, number)}</p>
  <img src="${image.medium}" alt="${name}" />
  <p>${summary}</p>
  `
  return div
}

window.onload = setup;