const TILE_SIZE = 16;
const GAME_WIDTH = 160;
const GAME_HEIGHT = 160;
const canvas = document.getElementById('pkmn');
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
const app = new PIXI.Application({
    view: canvas,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 0x000000,
});

let maps = [];
let keys = {};
let player;  
let editor = {};
let messages = [];
let tile_textures = [];
let spritesheets = {};
let background = new PIXI.Container();
let atts_container = new PIXI.Container();
let game_mode = 'Creative';

kanto_load(); // game/load.js