// === ДАННЫЕ ===  // === DATA ===
let allShows = [];
let allEpisodes = [];
let episodesCache = {};

// === DOM-ЭЛЕМЕНТЫ === // === DOM ELEMENTS ===
const rootElem = document.getElementById("root");
const searchShowField = document.getElementById("searchShowField")
const searchEpisodeField = document.getElementById("searchEpisodeField");
const episodeCounter = document.getElementById("episodeCounter");
const selectShow = document.getElementById("selectShow");
const selectEpisode = document.getElementById("selectEpisode");
const showsView = document.getElementById("showsView");
const episodesView = document.getElementById("episodesView");
const backButton = document.getElementById("backButton");
const showsRoot = document.getElementById("showsRoot");



// === ТОЧКА ВХОДА === // === ENTRY POINT ===
function setup() {
  fillShowSelector();
  selectShow.addEventListener("change", () => {
    loadEpisodes(selectShow.value)
    showsView.style.display = "none";
    episodesView.style.display = "block";
  });
  
  searchShowField.addEventListener("input", filterShows);
  searchEpisodeField.addEventListener("input", filterEpisodes);

  selectEpisode.addEventListener("change", () => {
    const cardById = document.getElementById(selectEpisode.value);
    cardById.scrollIntoView();
  });

  backButton.addEventListener("click", () => {
    episodesView.style.display = "none";
    showsView.style.display = "block";
  })
}

// === ФЕТЧ ЭПИЗОДОВ === // === FETCH EPISODES ===
async function loadEpisodes(showId) {
  try {
    if (!episodesCache[showId]) { //если такого эпизода нет в кеше, то делаем запрос на сервер
      rootElem.textContent = "loading...";
      const response = await fetch(
        `https://api.tvmaze.com/shows/${showId}/episodes`,
      );
      const data = await response.json();
      episodesCache[showId] = data;//сохраняем полученные эпизоды в кеше
    }
      allEpisodes = episodesCache[showId]//получаем эпизоды из кеша
      makePageForEpisodes(allEpisodes);
      fillEpisodeSelector();
      episodeCounter.innerHTML = `Showed ${allEpisodes.length} of ${allEpisodes.length} episodes`;
  } catch (error) {
    rootElem.textContent = "...something went wrong";
  }
}

// === ФИЛЬТРАЦИЯ ШОУ === // === FILTERING SHOWS ===
// Filters shows by search input and re-renders the page
function filterShows() {
  const filteredShows = allShows.filter(
    ({ name, genres, summary }) =>
      name.toLowerCase().includes(searchShowField.value.toLowerCase()) ||
      genres.join(",").toLowerCase().includes(searchShowField.value.toLowerCase()) ||
      summary.toLowerCase().includes(searchShowField.value.toLowerCase()),
  );
  makePageForShows(filteredShows); //отправляем отфильтрованный массив  в функцию которая вставит их в html
}

// === ФИЛЬТРАЦИЯ ЭПИЗОДОВ === // === FILTERING EPISODES ===
// Filters episodes by search input and re-renders the page
function filterEpisodes() {
  const filteredEpisodes = allEpisodes.filter(
    ({ name, summary }) =>
      name.toLowerCase().includes(searchEpisodeField.value.toLowerCase()) ||
      summary.toLowerCase().includes(searchEpisodeField.value.toLowerCase()),
  );
  makePageForEpisodes(filteredEpisodes); //отправляем отфильтрованный массив  в функцию которая вставит их в html
  episodeCounter.innerHTML = `Showed ${filteredEpisodes.length} of ${allEpisodes.length} episodes`;
}

// === РЕНДЕР СПИСКА ШОУ === // === RENDERING SHOW LIST ===
function makePageForShows(showList) {
  showsRoot.innerHTML = ""
  for (const show of showList) {
    const card = makeShowCard(show);
    card.addEventListener("click", () => {
      showsView.style.display = "none"
      episodesView.style.display = "block"
      loadEpisodes(show.id);
    })
    showsRoot.append(card);
  }
}

// === РЕНДЕР СПИСКА ЭПИЗОДОВ === // === RENDERING EPISODE LIST ===
function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = ""; //очищаем html от предыдущих карточек
  for (const episode of episodeList) {
    rootElem.append(makeEpisodeCard(episode)); //отправляем итерируемый эпизод и возвращаем карточку, которую вставляем в html
  }
}

// === ФОРМАТИРОВАНИЕ КОДА ЭПИЗОДА === // === EPISODE CODE FORMATTER ===
// Например: "S02E07"
function formatEpisodeCode(season, number) {
  return `S${String(season).padStart(2, "0")}E${String(number).padStart(2, "0")}`;
}

// === СОЗДАНИЕ КАРТОЧКИ ШОУ === // === SHOW CARD BUILDER ===
function makeShowCard({ name, image, summary, genres, status, rating, runtime }) {
  const div = document.createElement("div");
  div.innerHTML = `
  <h2>${name}</h2>
  <img src="${image.medium}" alt="${name}" />
  <p>${summary}</p>
  <p>Genres: ${genres}</p>
  <p>Status: ${status}</p>
  <p>Rating: ${rating.average}</p>
  <p>Runtime: ${runtime} minutes</p>  
  `;
  return div;
}

// === СОЗДАНИЕ КАРТОЧКИ ЭПИЗОДА === // === EPISODE CARD BUILDER ===
function makeEpisodeCard({ id, name, season, number, image, summary }) {
  const div = document.createElement("div");
  div.id = id;
  div.innerHTML = `
  <h2>${name}</h2>
  <p>${formatEpisodeCode(season, number)}</p>
  <img src="${image.medium}" alt="${name}" />
  <p>${summary}</p>
  `;
  return div;
}

window.onload = setup;

// === ЗАПОЛНЕНИЕ ЭПИЗОД СЕЛЕКТОРА === // === FILLING THE EPISODE SELECTOR ===
//format S01E01 - Name
function fillEpisodeSelector() {
  selectEpisode.innerHTML = "<option value='default'>Select an episode</option>"; 
  for (const episode of allEpisodes) {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    selectEpisode.append(option);
  }
}

// === ЗАПОЛНЕНИЕ ШОУ СЕЛЕКТОРА === // === FILLING THE SHOW SELECTOR ===
async function fillShowSelector() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    const data = await response.json();
    allShows = data.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );
  makePageForShows(allShows);//выгрузить карточки на страницу
  for (const show of allShows) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selectShow.append(option);
  }
  } catch (error) {
    rootElem.textContent = "...something went wrong";
  }
  console.log(allShows[0]);
}
  
