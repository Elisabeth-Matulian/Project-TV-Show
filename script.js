// === ДАННЫЕ ===  // === DATA ===
let allShows = [];
let allEpisodes = [];
let episodesCache = {};

// === DOM-ЭЛЕМЕНТЫ === // === DOM ELEMENTS ===
const rootElem = document.getElementById("root");
const searchField = document.getElementById("searchField");
const episodeCounter = document.getElementById("episodeCounter");
const selectShow = document.getElementById("selectShow");
const selectEpisode = document.getElementById("selectEpisode");

// === ТОЧКА ВХОДА === // === ENTRY POINT ===
// Вызывается когда страница загружена // Called when the page is loaded
// Инициализирует страницу и все обработчики событий // Initializes the page and all event listeners
function setup() {
  fillShowSelector();
  selectShow.addEventListener("change", () => {
    loadEpisodes(selectShow.value)
  });

  searchField.addEventListener("input", filterEpisodes);

  selectEpisode.addEventListener("change", () => {
    const cardById = document.getElementById(selectEpisode.value);
    cardById.scrollIntoView();
  });
}

// === ФЕТЧ ЭПИЗОДОВ === // === FETCH EPISODES ===
async function loadEpisodes(showId) {
  try {
    if (!episodesCache[showId]) {
      rootElem.textContent = "loading...";
      const response = await fetch(
        `https://api.tvmaze.com/shows/${showId}/episodes`,
      );
      const data = await response.json();
      allEpisodes = data;
      episodesCache[showId] = data;
    }
      allEpisodes = episodesCache[showId]
      makePageForEpisodes(allEpisodes);
      fillEpisodeSelector()
      episodeCounter.innerHTML = `Showed ${allEpisodes.length} of ${allEpisodes.length} episodes`;
  } catch (error) {
    rootElem.textContent = "...something went wrong";
  }
}

// === ФИЛЬТРАЦИЯ === // === FILTERING ===
// Фильтрует эпизоды по введённому тексту и перерисовывает страницу
// Filters episodes by search input and re-renders the page
function filterEpisodes() {
  const filteredEpisodes = allEpisodes.filter(
    ({ name, summary }) =>
      name.toLowerCase().includes(searchField.value.toLowerCase()) ||
      summary.toLowerCase().includes(searchField.value.toLowerCase()),
  );
  makePageForEpisodes(filteredEpisodes); //отправляем отфильтрованный массив  в функцию которая вставит их в html
  episodeCounter.innerHTML = `Showed ${filteredEpisodes.length} of ${allEpisodes.length} episodes`;
}

// === РЕНДЕР СПИСКА ЭПИЗОДОВ === // === RENDERING EPISODE LIST ===
// Очищает страницу и вставляет карточки для каждого эпизода
// Clears the page and inserts cards for each episode
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

// === СОЗДАНИЕ КАРТОЧКИ ЭПИЗОДА === // === EPISODE CARD BUILDER ===
// Принимает объект эпизода, возвращает div с HTML
// Takes an episode object, returns a div with HTML
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
// Заполняет выпадающий список всеми эпизодами в формате S01E01 - Name
// Populates the dropdown with all episodes in format S01E01 - Name
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
  for (const show of allShows) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    selectShow.append(option);
  }
  } catch (error) {
    rootElem.textContent = "...something went wrong";
  }
}
  
