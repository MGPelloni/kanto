// Kanto Information
const VERSION = '0.1.1';

// Game Constants
const TILE_SIZE = 16;
const GAME_WIDTH = 160;
const GAME_HEIGHT = 160;
const FPS = 60;
const canvas = document.getElementById('pkmn');

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
let game_id = url_parameter('g');
let meta = {};
let maps = [];
let player; 
let trainers = [];
let npcs = [];
let menus = [];
let items = [];
let keys = {}; 
let battle = {};
let editor = {};
let dialogue = {};
let tile_textures = [];
let spritesheets = [];
let item_sprites = [];
let message_text;
let paused = false;
let game_mode = window.location.pathname.slice(1);
let chat = null;
let socket = io();

// Animation Containers
let background = new PIXI.Container();
let atts_container = new PIXI.Container();
let npc_container = new PIXI.Container();
let player_container = new PIXI.Container();
let trainer_container = new PIXI.Container();
let message_container = new PIXI.Container();
let menu_container = new PIXI.Container();
let battle_container = new PIXI.Container();

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

kanto_load(); // game/load.js