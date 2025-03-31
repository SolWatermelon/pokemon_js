import axios from "axios";

const request = axios.create({ baseURL: "https://pokeapi.co/api/v2" });
request.defaults.timeout = 3000;

// all pokemon
// limit=60&offset=50 表示：
// 每頁顯示最多 60 筆資料，
// 但是這一頁從第 51 筆資料開始，顯示第 51 到第 111 筆資料
export const fetchPokemons = (limit = 30, offset = 0) => request.get(`/pokemon/?limit=${limit}&offset=${offset}`);

// pokemon imgs
export const fetchPokemonsImg = (pokemonName) => request.get(`/pokemon/${pokemonName}`);
