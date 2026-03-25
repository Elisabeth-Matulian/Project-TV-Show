//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();//an array of objects (73 episodes)
  makePageForEpisodes(allEpisodes); //passed the allEpisodes array further
}

//this function collects details for the future card. for example: detail-image; detail-name; detail-description and so on
function createChildElement(parentElement, tagName, textContent) {
  const element = document.createElement(tagName); //created a tag, for example <p>; then we will put everything here
  element.textContent = textContent; //put textContent inside the element, for example: <p>textContent</p>
  parentElement.append(element);//put the element inside the parentElement, for example: <section><p>textContent</p></section>
  return element; //and returned it
}

//this function collects the ready card
function createCard({image, name, season, number, summary}) {
  const card = document.createElement("card"); //this is the card container, we will return it from this function
  const img = document.createElement("img");
  img.src = image.medium;
  card.append(img);
  createChildElement(card, "h3", name);
  createChildElement(card, "p", `S${(season).toString().padStart(2, "0")}E${(number).toString().padStart(2, "0")}`);
  createChildElement(card, "p", `Summary: ${summary.slice(3, summary.length - 4)}`);
  return card;
}


function makePageForEpisodes(episodeList) { //At the very beginning, we passed the variable allEpisodes to this function, which contains an array of objects 
  const rootElem = document.getElementById("root"); //Located <div id="root"> in the HTML where we will append the created cards
  for (const episode of episodeList) { 
    //calling the function to create a card and appending the card to the end of the root tag
    rootElem.append(createCard(episode));
  }
}

window.onload = setup;

//p.s. Apologies if my comments are perhaps a bit too detailed. I need them for the time being. 
