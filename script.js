// === ДАННЫЕ ===  // === DATA ===
const allEpisodes = getAllEpisodes();

// === DOM-ЭЛЕМЕНТЫ === // === DOM ELEMENTS ===
const rootElem = document.getElementById("root");
const searchField = document.getElementById("searchField");
const episodeCounter = document.getElementById("episodeCounter");
const selectField = document.getElementById("selectField");

// === ТОЧКА ВХОДА === // === ENTRY POINT ===
// Вызывается когда страница загружена // Called when the page is loaded
// Инициализирует страницу и все обработчики событий // Initializes the page and all event listeners
function setup() {
  makePageForEpisodes(allEpisodes);
  searchField.addEventListener("input", filterEpisodes);
  episodeCounter.innerHTML = `Showed ${allEpisodes.length} of ${allEpisodes.length} episodes`;
  fillSelector();
  selectField.addEventListener("change", () => {
    const cardById = document.getElementById(selectField.value);
    cardById.scrollIntoView();
  });
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

// === ЗАПОЛНЕНИЕ СЕЛЕКТОРА === // === FILLING THE SELECTOR ===
// Заполняет выпадающий список всеми эпизодами в формате S01E01 - Name
// Populates the dropdown with all episodes in format S01E01 - Name
function fillSelector() {
  for (const episode of allEpisodes) {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode.season, episode.number)} - ${episode.name}`;
    selectField.append(option);
  }
}
