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
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
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
let map;

// Player
app.loader
    .add('red', 'assets/images/red.png')
    .add('map_bg', 'assets/images/pallet.png')
    .add('map_fg', 'assets/images/pallet-foreground.png')
app.loader.load(doneLoading);

window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);

function doneLoading() {
    createPlayerSheet();
    createMap();
    createPlayer();
    createMap_fg();

    app.ticker.add(moveLoop);
    app.ticker.add(controlsLoop);
}

function createPlayerSheet() {
    let ssheet = new PIXI.BaseTexture.from(app.loader.resources['red'].url);
    let w = TILE_SIZE;
    let h = TILE_SIZE;

    playerSheet["standSouth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h))
    ];

    playerSheet["standNorth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h))
    ];

    playerSheet["standWest"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h))
    ];

    playerSheet["standEast"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h))
    ];

    playerSheet["walkSouth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 4 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 4 * h, w, h), null, null, 12),
    ];

    playerSheet["walkWest"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 6 * h, w, h)),
    ];

    playerSheet["walkEast"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 7 * h, w, h)),
    ];

    playerSheet["walkNorth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 5 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 5 * h, w, h), null, null, 12),
    ];
}

function createPlayer() {
    player = new PIXI.AnimatedSprite(playerSheet.standSouth);
    player.anchor.set(0.5);
    player.animationSpeed = 0.125;
    player.loop = false;
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;
    player.width = TILE_SIZE;
    player.height = TILE_SIZE;
    app.stage.addChild(player);

    player.play();
    player.game_pos = {
        x: 5,
        y: 5,
    }
    player.moving = false;
    player.current_move_ticker = 0;
    player.can_move = true;
}

function createMap() {
    map = new PIXI.Sprite.from(app.loader.resources['map_bg'].url);
    map.width = 320;
    map.height = 248;
    map.x = 22;
    map.y = 20;
    app.stage.addChild(map);
}

function createMap_fg() {
    map_fg = new PIXI.Sprite.from(app.loader.resources['map_fg'].url);
    map_fg.width = 320;
    map_fg.height = 248;
    map_fg.x = 22;
    map_fg.y = 20;
    app.stage.addChild(map_fg);
}

function keysDown(e) {
    keys[e.keyCode] = true;
}

function keysUp(e) {
    keys[e.keyCode] = false;
}

function moveLoop() {
    if (player.moving) {
        // Up
        if (player.direction == 'North') {
            map.y += 1
            map_fg.y += 1
        }

        // Down
        if (player.direction == 'South') {
            map.y -= 1
            map_fg.y -= 1
        }

        // Left
        if (player.direction == 'West') {
            map.x += 1
            map_fg.x += 1
        }

        // Right
        if (player.direction == 'East') {
            map.x -= 1
            map_fg.x -= 1
        }

        if (player.current_move_ticker >= 15) {
            player.moving = false;
            player.direction = null;
            player.can_move = false;

            setTimeout(() => {
                player.can_move = true;
                player.current_move_ticker = 0;
            }, 8)
        }
        
        player.current_move_ticker++;
    }
}

function controlsLoop() {
    if (!player.moving && player.can_move) {
        if (keys["87"] || keys["38"]) {
            if (!player.playing || player.textures !== playerSheet.walkNorth) {
                player.textures = playerSheet.walkNorth;
                player.play();
            }

            if (collision_check(player.game_pos.x, player.game_pos.y - 1) == false) {
                player.direction = 'North';
                player.moving = true;
                player.game_pos.y--;
            }
        } else if (keys["83"] || keys["40"]) {
            if (!player.playing || player.textures !== playerSheet.walkSouth) {
                player.textures = playerSheet.walkSouth;
                player.play();
            }

            if (collision_check(player.game_pos.x, player.game_pos.y + 1) == false) {
                player.direction = 'South';
                player.moving = true;
                player.game_pos.y++;
            }
        } else if (keys["65"] || keys["37"]) {
            if (!player.playing  || player.textures !== playerSheet.walkWest) {
                player.textures = playerSheet.walkWest;
                player.play();
            }

            if (collision_check(player.game_pos.x - 1, player.game_pos.y) == false) {
                player.direction = 'West';
                player.moving = true;
                player.game_pos.x--;
            }
        } else if (keys["68"]|| keys["39"]) {
            if (!player.playing || player.textures !== playerSheet.walkEast) {
                player.textures = playerSheet.walkEast;
                player.play();                
            }

            if (collision_check(player.game_pos.x + 1, player.game_pos.y) == false) {
                player.direction = 'East';
                player.moving = true;
                player.game_pos.x++;
            }
        }
    }
}

function collision_check(x, y) {
    let array_pos = x + TILE_AMOUNT_X * y;
    return collision_map[array_pos];
}
