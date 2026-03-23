//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();//здесь массив из 73 объектов
  makePageForEpisodes(allEpisodes); //передали массив allEpisodes дальше
}

//эта функция собирает детали для будущей карточки. например: деталь-картинка; деталь-название;деталь-описание итд
function createChildElement(parentElement, tagName, textContent) {
  const element = document.createElement(tagName); //создали тэг, например <p>;дальше все сюда вложим
  element.textContent = textContent; //положили в этот тэг (<p>) текст связали с element
  parentElement.append(element);// добавили element внутрь родителя
  return element; //и вернули его
}

//эта функция собирает готовую карточку
function createCard({image, name, season, number, summary}) {
  const card = document.createElement("section"); //это контейнер карточки, ее мы и вернем из этой функции
  createChildElement(card, "img", image.medium);
  createChildElement(card, "h3", name);
  createChildElement(card, "p", `S${(season).toString().padStart(2, "0")}E${(number).toString().padStart(2, "0")}`);
  createChildElement(card, "p", `Summary: ${summary.slice(3, summary.length - 4)}`);
  return card;
}


function makePageForEpisodes(episodeList) { //в эту функцию в самом начале мы передали переменную allEpisodes которая содержит в себе массив из множества объектов
  const rootElem = document.getElementById("root"); //нашли <div id="root"> в HTML куда будем аппэндить созданные карточки
  for (const episode of episodeList) { 
    //вызов функции по созданию карточки и помещение карточки в конец тэга root
    rootElem.append(createCard(episode));
  }
}

window.onload = setup;
