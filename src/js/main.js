const TILE_AMOUNT_X = 20;
const TILE_AMOUNT_Y = 15;
const TILE_SIZE = 16;

const canvas = document.getElementById('pkmn');
const app = new PIXI.Application({
    view: canvas,
    width: 220,
    height: 220,
    transparent: true,
});

let collision_map = [
    0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,            
    1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1,   
    1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,    
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,    
    1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,    
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,   
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,   
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,  
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,   
    1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,   
    1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,   
    1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,   
]

let keys = {};
let playerSheet = {};
let speed = 1;
let player;
let tilemap;
let tile_textures = [];

let background = new PIXI.Container();
background.x = app.view.width / 2 - TILE_SIZE / 2;
background.y = app.view.height / 2 - TILE_SIZE / 2;

// Player
app.loader
    .add('red', 'assets/images/red.png')
    .add('tilemap', 'assets/images/tiles.png')
app.loader.load(doneLoading);

window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

function doneLoading() {
    create_player_sheet();
    prepare_tilemap();
    app.stage.addChild(background);

    let map_width = 20;
        map_height = 18;
       
    // Map
    let pallet = new Map('Pallet Town', map_width, map_height, pallet_tiles, pallet_atts);
    pallet.build();

    // Player
    createPlayer();
    // player.place(Math.floor(map_width / 2), Math.floor(map_height / 2));
    player.current_map = pallet;
    player.place(5, 6);

    app.ticker.add(move_loop);
    app.ticker.add(controls_loop);
}

function prepare_tilemap() {
    tilemap = new PIXI.Texture.from(app.loader.resources['tilemap'].url);

    let tile_row_width = Math.floor(tilemap.width / TILE_SIZE),
        tile_row_height = Math.floor(tilemap.height / TILE_SIZE);

    for (let i = 0; i < tile_row_width * tile_row_height; i++) {
        let x = i % tile_row_width;
        let y = Math.floor(i / tile_row_width);
        tile_textures[i] = new PIXI.Texture(tilemap, new PIXI.Rectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE));
    }
}