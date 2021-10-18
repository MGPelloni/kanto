// Kanto Information
const VERSION = '0.1.1';

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
let npcs = [];
let menus = [];
let initialized = false;
let keys = {}; 
let editor = {};
let dialogue = {};
let tile_textures = [];
let spritesheets = [];
let message_text;
let paused = false;
let game_mode = window.location.pathname.slice(1);

// Multiplayer
let multiplayer = {
    enabled: false,
    trainers: []
};

let socket = io();

// Node.JS Variables
let ss_amount = 42 // This will check how many sprites are available through node.js FS

// Animation Containers
let background = new PIXI.Container();
let atts_container = new PIXI.Container();
let npc_container = new PIXI.Container();
let multiplayer_container = new PIXI.Container();
let message_container = new PIXI.Container();
let menu_container = new PIXI.Container();

// Audio
let music;
let sfx;

// Gamepad
let kanto_gamepad = {
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
    back: false
}

window.addEventListener('contextmenu', e => {
    e.preventDefault();
});

document.getElementsByTagName("body")[0].addEventListener("touchstart",
 function(e) { e.returnValue = false });

kanto_load(); // game/load.js