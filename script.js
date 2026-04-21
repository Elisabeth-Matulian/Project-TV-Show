// === STATE ===
const allShows = [];
let allEpisodes = [];
const episodeCache = {};

// === DOM REFERENCES ===
const root = document.getElementById("root");
const episodeCounter = document.getElementById("episodeCounter");
const selectedShow = document.getElementById("selectedShow");
const selectedEpisode = document.getElementById("selectedEpisode");
const searchInput = document.getElementById("search");

// === INITIAL PAGE MESSAGE ===
root.textContent = "Select a show to get started";

// === DATA FETCHING ===
async function getAllShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");

    const data = await response.json();

    for (const show of data) {
      allShows.push(show);
    }
    allShows.sort((a, b) => a.name.localeCompare(b.name));
    selectShow();
  } catch (error) {
    root.textContent =
      "Something went wrong loading shows. Please try again.";
  }
}

const fetchEpisodes = async (showID) => {
  const response = await fetch(`https://api.tvmaze.com/shows/${showID}/episodes`);
  return await response.json();
};

// === RENDER ===
function renderEpisodes(episodeList) {
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  for (const episode of episodeList) {
    root.append(createEpisodeCard(episode));
  }
}

// === CARD BUILDER ===
function createChildElement(parentElement, tagName, textContent) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  parentElement.append(element);
  return element;
}

function createEpisodeCard({ image, name, season, number, summary }) {
  const card = document.createElement("card"); 
  const img = document.createElement("img");
  img.src = image.medium;
  card.append(img);
  createChildElement(card, "h3", name);
  createChildElement(
    card,
    "p",
    `S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`,
  );
  createChildElement(
    card,
    "p",
    `Summary: ${summary.slice(3, summary.length - 4)}`,
  );
  return card;
}

// === SELECTORS ===
function selectShow() {
  selectedShow.innerHTML = '<option value="value1" selected>Select a show</option>';
  for (const shows of allShows) {
    const { name, id } = shows;

    let option = document.createElement("option");
    option.text = name;
    option.value = id;
    selectedShow.add(option);
  }
}

function selectEpisodes() {
  let selectedEpisode = document.getElementById("selectedEpisode");
  selectedEpisode.innerHTML = "";
  let option = document.createElement("option");
  option.text = "All Episodes";
  option.value = "all";
  selectedEpisode.add(option);

  for (const episode of allEpisodes) {
    const { name, season, number } = episode;
    let option = document.createElement("option");
    option.text = `S${season.toString().padStart(2, "0")}E${number
      .toString()
      .padStart(2, "0")} - ${name}`;
    option.value = name;
    selectedEpisode.add(option);
  }
}

// === EVENT HANDLERS ===
function handleShowSelection() {
  selectedShow.addEventListener("change", () => {
    const id = selectedShow.value;
    if (episodeCache[id]) {
      allEpisodes = episodeCache[id];
      renderEpisodes(allEpisodes);
      episodeCounter.innerHTML = `${allEpisodes.length} Episodes`;
      selectEpisodes();
    } else {
      fetchEpisodes(id).then((episodes) => {
        episodeCache[id] = episodes;
        allEpisodes = episodes;
        renderEpisodes(allEpisodes);
        episodeCounter.innerHTML = `${allEpisodes.length} Episodes`;
        selectEpisodes();
      });
    }
  });
}

function handleEpisodeSelection() {
  const selectedEpisode = document.getElementById("selectedEpisode");

  selectedEpisode.addEventListener("change", () => {
    const ep = selectedEpisode.value;

    if (ep === "all") {
      renderEpisodes(allEpisodes);
      episodeCounter.innerHTML = `${allEpisodes.length} Episodes`;
      return;
    }

    const filtered = allEpisodes.filter((episode) => {
      return episode.name === ep;
    });

    renderEpisodes(filtered);
    episodeCounter.innerHTML = `1 Episode`;
  });
}

function handleSearch() {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase(); 
    const searchResults = []; 
    for (const episode of allEpisodes) {
      const { name, summary } = episode;
      const resultsOfSearchName = name.toLowerCase().includes(searchTerm); 
      const resultsOfSearchSummery = summary.toLowerCase().includes(searchTerm);
      if (resultsOfSearchName || resultsOfSearchSummery) {
        searchResults.push(episode);
      } 
    }

    renderEpisodes(searchResults);
    if (searchResults.length != 0) {
      episodeCounter.innerHTML = `${searchResults.length} Episodes`;
    } 
    else {
      episodeCounter.innerHTML = `No episodes found`;
    }
  });
}

// === SETUP ===
function setup() {
  getAllShows();
  handleShowSelection();
  handleEpisodeSelection();
  handleSearch();
}

window.onload = setup;