// Kanto Information
const VERSION = '0.0.2';

// Game Constants
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

// Game Variables
let maps = [];
let selected_game = 'pallet';
let keys = {};
let player;  
let editor = {};
let dialogue = {};
let tile_textures = [];
let spritesheets = {};
let message_text;
let paused = false;
let game_mode = 'Creative';

// Animation Containers
let background = new PIXI.Container();
let atts_container = new PIXI.Container();
let message_container = new PIXI.Container();

// Audio
let music;
let sfx;

kanto_load(); // game/load.js