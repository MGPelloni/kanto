// Kanto Information
const VERSION = '0.0.4';

// Game Constants
const TILE_SIZE = 16;
const GAME_WIDTH = 160;
const GAME_HEIGHT = 160;
const canvas = document.getElementById('pkmn');
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// PIXI Application
const app = new PIXI.Application({
    view: canvas,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 0x000000,
});

// Import data
let import_data = {
    maps: [],
    meta: {},
    player: {}
};

// Game Variables
let meta = {};
let maps = [];
let player; 

let initialized = false;
let keys = {}; 
let editor = {};
let dialogue = {};
let tile_textures = [];
let spritesheets = [];
let message_text;
let paused = false;
let game_mode = window.location.pathname.slice(1);

// Node.JS Variables
let ss_amount = 39 // This will check how many sprites are available through node.js FS

// Animation Containers
let background = new PIXI.Container();
let atts_container = new PIXI.Container();
let message_container = new PIXI.Container();

// Audio
let music;
let sfx;

kanto_load(); // game/load.js