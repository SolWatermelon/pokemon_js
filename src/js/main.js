import "../css/style.css";
import { fetchPokemons, fetchPokemonsImg } from "../api/index.js";
import { cardComponent } from "./card.js";

const loading = document.querySelector(".loading");
const pokemonImgWrapper = document.querySelector(".poke-img");
const titleWrapper = document.querySelector(".title-wrapper");
let allPokemonData = [];
let rawData = [];

const applyCoverEffectElement = (imgCover, imgUrl, card) => {
  // 使用遮罩圖片
  imgCover.style.backgroundImage = `url(${imgUrl})`;
  // 設置遮罩為圖片形狀
  imgCover.style.maskImage = `url(${imgUrl})`;
  imgCover.classList.add("black-cover");
  pokemonImgWrapper.appendChild(card);
};

const switchCover = (imgCover, realImg, usefulData) => {
  console.log("usefulData", usefulData);
  const pokeCard = document.querySelectorAll(".card");
  const i = usefulData.id - 1;
  const cry = new Audio(usefulData.cry);
  pokeCard[i].addEventListener("mouseover", () => {
    imgCover.style.display = "none";
    realImg.style.display = "block";
    cry.play();
  });
  pokeCard[i]?.addEventListener("mouseout", () => {
    imgCover.style.display = "block";
    realImg.style.display = "none";
    cry.pause();
  });
};

const arrangedPokemonData = (pokemon) => {
  const {
    id, name, order, height, weight, types, cries, abilities,
  } = pokemon;

  const typeArr = types
    .map((typem) => {
      const perName = typem.type.name;
      return { perName };
    })
    .map((val) => val.perName);

  const usefulData = {
    id,
    name,
    order,
    height,
    weight,
    types: typeArr,
    cry: cries.legacy ?? cries.latest,
    ability: abilities[0]?.ability?.name,
  };
  return usefulData;
};

const generatePokemonImgElement = () => {
  console.log("allPokemonData", allPokemonData);
  allPokemonData.forEach((pokemon) => {
    const imgUrl = pokemon.sprites.front_default;
    const card = cardComponent(pokemon.id, arrangedPokemonData(pokemon));
    const imgCover = card.querySelector(".img-cover");
    const realImg = card.querySelector(".img-real");

    realImg.style.background = `url(${imgUrl}) no-repeat center center / cover`;
    realImg.style.display = "none";

    applyCoverEffectElement(imgCover, imgUrl, card);
    switchCover(imgCover, realImg, arrangedPokemonData(pokemon));
  });
};

const getPokemon = async (newPokemonData, allRawPokemondata) => {
  if (allRawPokemondata.length > 1000) {
    // intersectionObserver.unobserve(loading);
    loading.style.display = "none";
    return;
  }
  try {
    const promises = newPokemonData.map(async (pokemonsData) => {
      try {
        const res = await fetchPokemonsImg(pokemonsData.name);
        return res.data;
      } catch (error) {
        // console.error("error", error);
        // 因為map需要return東西，所以這裡也需要
        return new Error(error);
      }
    });

    allPokemonData = await Promise.all(promises);
    generatePokemonImgElement();
  } catch (error) {
    console.error("error", error);
  }
};

const getData = async (limit, offset) => {
  try {
    const res = await fetchPokemons(limit, offset);
    rawData = [...rawData, ...res.data.results];
    // console.log("raw", rawData);
    getPokemon(res.data.results, rawData);
  } catch (error) {
    console.error("error", error);
  }
};

const intersectionObserver = new IntersectionObserver((items) => {
  // 為0或小於的話，觀察的element在視線外
  if (items[0].intersectionRatio <= 0) return;
  // 反之
  getData(30, rawData.length);
});
intersectionObserver.observe(loading);

const triggerWebToPlayAudio = () => {
  const allEle = document.querySelectorAll("*");
  allEle.forEach((ele) => {
    ele.style.visibility = "hidden";
  });
  const btn = document.createElement("h1");
  btn.style.visibility = "visible";
  titleWrapper.appendChild(btn);
  btn.classList.add("trigger-btn");
  btn.innerText = "點擊此處以開啟寶可夢鑑賞";
  btn.addEventListener("click", () => {
    allEle.forEach((ele) => {
      ele.style.visibility = "visible";
      btn.innerText = "";
    });
  });
};

getData();
triggerWebToPlayAudio();
