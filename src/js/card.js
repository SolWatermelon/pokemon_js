import "../css/style.css";

export const cardComponent = (id, pokemonData) => {
  const card = document.createElement("article");
  card.classList.add("card");
  let html = "";
  html += `<div class="img-cover img-cover-${id}"></div>
  <div class="img-real"></div>
<div class="content-wrapper content-wrapper-${id}">
      <header>
        <h1 class="card-title">${pokemonData.name}</h1>
      </header>
        <div class="card-text">
          <div class="order-tag">order: ${pokemonData.order}</div>
          <div class="order-types">types: ${pokemonData.types[0]} ${pokemonData?.types[1] ? `, ${pokemonData.types[1]}` : ""}</div>
          <div class="abilty-wrapper">
            ability: ${pokemonData.ability}
          </div>
          <div class="height">height: ${pokemonData.height}</div>
          <div class="weight">weight: ${pokemonData.weight}</div>
        </div>
    </div>`;

  card.innerHTML = html;
  return card;
};
