//You can edit ALL of the code here
// adds veriadles needed in the global scope
let allEpisodes = [];
let episodeCountFromSearch = document.getElementById("episodeCountFromSearch");


function setup() {
  allEpisodes = getAllEpisodes(); //an array of objects (73 episodes)
  makePageForEpisodes(allEpisodes);
  episodeCountFromSearch.innerHTML = `${allEpisodes.length} Episodes`//adds the message for the search result

  return allEpisodes; //passed the allEpisodes array further
}


// gets the data from the serch bar and updates live
function searchBarSetUp() {
  let searchInput = document.getElementById("search"); //gets the search input
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase(); // adds the listener to the function
    const searchResults = []; //an array to store the search results
    for (const episode of allEpisodes) {
      const { name, summary } = episode; // extracts the name and summery
      const resultsOfSearchName = name.toLowerCase().includes(searchTerm); // evaluates the search
      const resultsOfSearchSummery = summary.toLowerCase().includes(searchTerm);
      if (resultsOfSearchName || resultsOfSearchSummery ) {
        searchResults.push(episode);
      } //if the search term is found in either name or summery, the episode is added to the searchResults array
    }
    makePageForEpisodes(searchResults); //and the page is updated with the search results
   if (searchResults.length != 0) {
    episodeCountFromSearch.innerHTML=`${searchResults.length} Episodes`}// adds the appropriat message after the search 
  else {episodeCountFromSearch.innerHTML=`No episodes found`}
  });
}
//this function collects details for the future card. for example: detail-image; detail-name; detail-description and so on
function createChildElement(parentElement, tagName, textContent) {
  const element = document.createElement(tagName); //created a tag, for example <p>; then we will put everything here
  element.textContent = textContent; //put textContent inside the element, for example: <p>textContent</p>
  parentElement.append(element); //put the element inside the parentElement, for example: <section><p>textContent</p></section>
  return element; //and returned it
}
searchBarSetUp();
//this function collects the ready card
function createCard({ image, name, season, number, summary }) {
  const card = document.createElement("card"); //this is the card container, we will return it from this function
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

function makePageForEpisodes(episodeList) {
  //At the very beginning, we passed the variable allEpisodes to this function, which contains an array of objects
  const rootElem = document.getElementById("root"); //Located <div id="root"> in the HTML where we will append the created cards
  while (rootElem.firstChild) {
    rootElem.removeChild(rootElem.firstChild);
  }
  //removes the first child of the root element, which is the default text "Select an episode to see more details." This is done to clear the page before adding new cards.
  for (const episode of episodeList) {
    //calling the function to create a card and appending the card to the end of the root tag
    rootElem.append(createCard(episode));
  }
  searchResults = [];
}

window.onload = setup;

//p.s. Apologies if my comments are perhaps a bit too detailed. I need them for the time being.
