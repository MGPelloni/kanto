/**
 * Initializes the application.
 */
function kanto_load() {
    kanto_console('https://github.com/MGPelloni/kanto');
    kanto_load_assets();
}

/**
 * Loads the game assets.
 */
function kanto_load_assets() {
    // Sprites
    let sprite_path = 'assets/graphics/sprites/';
    for (let i = 0; i < ss_amount; i++) {
        app.loader.add(`mobile-sprite-${i}`, sprite_path + `${i}.png`);
    }

    // Items
    let item_path = 'assets/graphics/items/';
    for (let i = 1; i < item_sprite_amount; i++) {
        app.loader.add(`item-sprite-${i}`, item_path + `${i}.png`);
    }

    app.loader
        .add('tilemap', 'assets/graphics/tileset.png')
        .add('message', 'assets/graphics/message.jpg')
        .add('start-menu', 'assets/graphics/start-menu.png')
        .add('emote-shock', 'assets/graphics/emotes/shock.png')
    app.loader.load(kanto_fetch_game);
}

/**
 * Fetches the JSON formatted map data and initializes the game start when complete.
 */
function kanto_fetch_game() {
    if (game_mode == 'create' && !GAME_ID) { // No game has been selected, and we are in create mode
        kanto_new_game();
        return;
    }
    
    fetch(`${window.location.protocol}//${window.location.host}/game`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'game': GAME_ID}),
    }).then((res) => {
        return res.json();
    }).then((data) => {
        kanto_load_game(data);
    });
}

function kanto_upload_template() {
    let req_body = kanto_game_export();

    console.log(req_body);

    fetch(`${window.location.protocol}//${window.location.host}/upload`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: req_body // body data type must match "Content-Type" header
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if (data.success) {
            alert(`Game upload successful. You may now view this game at the URL: ${window.location.protocol}//${window.location.host}/play?g=${data.game_id}`);
            meta.game_id = data.game_id;
            store_data(meta.name, kanto_game_export());
        } else {
            alert('Game upload failed! Please try again later.');
        }
    });
}

function kanto_new_game() {
    meta = {
        name: ''
    };

    // Create the first map
    map = new Kanto_Map();
    maps.push(map);

    // Loading is complete, start the game
    kanto_start();
}

/**
 * Imports a JSON string and parses the data to be loaded as a game.
 * 
 * @param {string} data The JSON game string.
 */
function kanto_load_game(data) {
    // Mutate string data before parsing JSON
    data = data.replaceAll('POKeMON', 'POKéMON'); // TODO: Database doesn't save é

    // Set global import game data [meta, maps, player]
    import_data = JSON.parse(data);
    
    // Load Meta
    meta = import_data.meta;

    // Load Maps
    maps = kanto_load_maps();
    map = maps[0];

    // Loading is complete, start the game
    kanto_start();
}

function kanto_switch_game(data) {
    // Mutate string data before parsing JSON
    data = data.replaceAll('POKeMON', 'POKéMON'); // TODO: Database doesn't save é
    import_data = JSON.parse(data);
    kanto_reset();
}

function kanto_reset() {
    // Load Meta
    meta = {
        name: import_data.meta.name
    };

    // Load Maps
    maps = kanto_load_maps();
    map = maps[0];

    // Load Player
    player.current_map = map;
    player.position.map = map.id;
    player.position.x = map.starting_position.x;
    player.position.y = map.starting_position.y;
    player.change_spritesheet(import_data.player.spritesheet_id);

    // Build the new map
    map.build();

    // Create editor
    editor.prepare_maps();
}

function kanto_load_maps() {
    let res = [];
        
    // Create maps
    let maps_data = Object.entries(import_data.maps);
    maps_data.forEach(([key, map]) => {
        map.id = parseInt(key);
        kanto_map = new Kanto_Map(map.id, map.name, map.width, map.height, map.tiles, map.atts, map.music, map.starting_position);
        res.push(kanto_map);
    });

    return res;
}

function kanto_append_map(data) {
    // Create map
    let map = JSON.parse(data);
    
    map.id = maps.length;

    // Remove warps
    map.atts.forEach((att, key) => {
        if (att.type == 2 || att.type == 4) {
            map.atts[key] = {type: 0};
        }
    });

    console.log(map);

    let kanto_map = new Kanto_Map(map.id, map.name, map.width, map.height, map.tiles, map.atts, map.music, map.starting_position);
    
    console.log(kanto_map);
    maps.push(kanto_map);
    editor.update();
    
    return maps;
}

function kanto_map_export() {
    let exported_map = map;

    // Format the data by deleting added properties
    delete exported_map.id;
    delete exported_map.x;
    delete exported_map.y;

    return saveTemplateAsFile(`kanto-map-export.json`, map);
}

function kanto_game_export() {
    let exported_meta = meta;
    delete exported_meta.lobby_id;

    let exported_maps = maps.map(object => ({ ...object })) // clone the maps data without object references
    exported_maps.forEach(exported_map => {
        // Format the data by deleting added properties
        delete exported_map.id;
        delete exported_map.x;
        delete exported_map.y;
        delete exported_map.items;
    });   

    let exported_player = {
        sprite: player.spritesheet_id,
        pokemon: player.pokemon,
        items: player.items,
    };

    let game_data = {
        meta: exported_meta,
        player: exported_player,
        maps: exported_maps
    };

    return JSON.stringify(game_data);
}


function kanto_game_json_export() {
    return saveTemplateAsFile(`kanto-game-export.json`, JSON.parse(kanto_game_export()));
}


function kanto_editor_upload() {
    console.log(kanto_game_export());
}

/**
 * Initializes the game.
 */
function kanto_start() {
    prepare_background();
    prepare_npc_container();
    prepare_multiplayer_container();
    prepare_atts_container();

    prepare_tilemap();
    prepare_spritesheets();
    prepare_audio();

    // Audio
    Howler.mute(true); // Mute the volume across the game until user enables
    
    // Create player
    player = new Player('RED', {map: map.id, x: map.starting_position.x, y: map.starting_position.y}, import_data.player.sprite);
    player.current_map = map;

    // Build the first map
    map.build();

    // Prepare animation tickers
    app.ticker.maxFPS = FPS;
    app.ticker.add(move_loop);
    app.ticker.add(controls_loop);

    // Create editor
    if (game_mode == 'create') {
        editor = new Editor();
        app.ticker.add(editor_controls_loop);
    }

    // Focus on the canvas to enable the game controls
    document.querySelector('#pkmn').focus();

    // Foreground
    prepare_menus();
    prepare_dialogue();

    // Game properties
    prepare_items();

    // Multiplayer
    prepare_multiplayer();
}

function prepare_atts_container() {
    atts_container.origin = {
        x: app.view.width / 2 - TILE_SIZE / 2,
        y: app.view.width / 2 - TILE_SIZE / 2,
    }

    atts_container.x = atts_container.origin.x;
    atts_container.y = atts_container.origin.y;
    atts_container.visible = false;

    app.stage.addChild(atts_container);
}

function prepare_npc_container() {
    npc_container.origin = {
        x: app.view.width / 2 - TILE_SIZE / 2,
        y: (app.view.width / 2 - TILE_SIZE / 2)  - 4,
    }

    npc_container.x = npc_container.origin.x;
    npc_container.y = npc_container.origin.y;
    npc_container.visible = true;

    app.stage.addChild(npc_container);
}


function prepare_multiplayer_container() {
    multiplayer_container.origin = {
        x: app.view.width / 2 - TILE_SIZE / 2,
        y: (app.view.width / 2 - TILE_SIZE / 2)  - 4,
    }

    multiplayer_container.x = multiplayer_container.origin.x;
    multiplayer_container.y = multiplayer_container.origin.y;
    multiplayer_container.visible = true;

    app.stage.addChild(multiplayer_container);
}

function prepare_background() {
    background.origin = {
        x: app.view.width / 2 - TILE_SIZE / 2,
        y: app.view.width / 2 - TILE_SIZE / 2,
    }

    background.x = background.origin.x;
    background.y = background.origin.y;

    app.stage.addChild(background);
}

function prepare_tilemap() {
    let tilemap = new PIXI.Texture.from(app.loader.resources['tilemap'].url);

    let tile_row_width = Math.floor(tilemap.width / TILE_SIZE),
        tile_row_height = Math.floor(tilemap.height / TILE_SIZE);

    for (let i = 0; i < tile_row_width * tile_row_height; i++) {
        let x = i % tile_row_width;
        let y = Math.floor(i / tile_row_width);
        tile_textures[i] = new PIXI.Texture(tilemap, new PIXI.Rectangle(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE));
    }
}

function prepare_spritesheets() {
    for (let i = 0; i < ss_amount; i++) {
        spritesheets[i] = create_spritesheet(app.loader.resources[`mobile-sprite-${i}`].url);
    }
}

function prepare_audio() {
    music = new Music();
    sfx = new Sfx();
}

function prepare_dialogue() {
    let message_texture = new PIXI.Texture.from(app.loader.resources['message'].url);
        message_bg = new PIXI.Sprite(message_texture);

    // Message background
    message_bg.width = app.view.width;
    message_bg.aspect = message_texture.baseTexture.resource.width / message_texture.baseTexture.resource.height;
    message_bg.height = 1 / message_bg.aspect * message_bg.width;
    
    // Message container
    message_container.y = app.view.height - message_bg.height;
    message_container.visible = true;

    message_bounds = {
        width: app.view.width - 20
    };

    // Message text
    message_text = new PIXI.Text('', {fontFamily: 'pokemon_gbregular', fontSize: 16, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: message_bounds.width * 2});
    message_text.x = 8;
    message_text.y = 18;
    message_text.style.lineHeight = 30;
    message_text.scale.x = 0.5;
    message_text.scale.y = 0.5;
    message_text.resolution = 4;

    // Hiding arrow
    let message_arrow_hide = new PIXI.Sprite(PIXI.Texture.WHITE);
    message_arrow_hide.name = "message_arrow";
    message_arrow_hide.tint = '0xFFFBFF';
    message_arrow_hide.x = message_bg.width - 16; //
    message_arrow_hide.y = message_bg.height - 18;
    message_arrow_hide.width = 7;
    message_arrow_hide.height = 6;
    

    // Adding to the stage
    app.stage.addChild(message_container);
    message_container.addChild(message_bg);
    message_container.addChild(message_text);
    message_container.addChild(message_arrow_hide);

    message_container.visible = false;

    dialogue = new Dialogue();
}

function prepare_items() {
    items = [
        new Item('POKé BALL', 'Ball'),
        new Item('GREAT BALL', 'Ball'),
        new Item('POTION', 'Restore'),
        new Item('SUPER POTION', 'Restore'),
        new Item('ANTIDOTE', 'Status'),
        new Item('BICYCLE', 'Special'),
    ];
}

function prepare_menus() {
    menu_container.visible = false;
    app.stage.addChild(menu_container);

    // Start Menu
    menus.push(new Menu('Start', [
        {
            name: 'POKéDEX',
            type: 'menu',
            callback: () => {
                dialogue.queue_messages(["Your POKéDEX doesn't seem to be working.."]);
            }
        }, 
        {
            name: 'POKéMON',
            type: 'menu',
            open_menu: 'Pokemon'
        }, 
        {
            name: 'ITEM',
            type: 'menu',
            open_menu: 'Items'
        }, 
        { 
            name: 'RED',
            type: 'menu',
            callback: () => {
                dialogue.queue_messages(["You have no badges or money!", "Embarrassing!"]);
            },
        }, 
        {
            name: 'SPRITE',
            type: 'menu',
            callback: () => {
                player.change_spritesheet();
            }
        }, 
        {
            name: 'OPTION',
            type: 'menu'
        }, 
        {
            name: 'EXIT',
            type: 'menu',
            callback: () => {
                menus[player.menu.current].close();
            }
        }
    ], {
        width: 80,
        height: 128,
        x: 80,
        y: 0
    }));

    // Items
    menus.push(new Menu('Items', [
        {
            name: 'Cancel',
            type: 'menu',
            callback: () => {
                menus[player.menu.current].close();
            }
        }
    ], {
        width: 96,
        height: 64,
        x: 32,
        y: 48
    }));

    // Pokemon
    menus.push(new Menu('Pokemon', [
        {
            name: 'Squirtle',
            type: 'Pokemon'
        }, 
        {
            name: 'Bulbasaur',
            type: 'Pokemon'
        }, 
        {
            name: 'Pikachu',
            type: 'Pokemon'
        }, 
        {
            name: 'Pidgey',
            type: 'Pokemon'
        }, 
        {
            name: 'Wartortle',
            type: 'Pokemon'
        }, 
    ], {
        width: 160,
        height: 160,
        x: 0,
        y: 0
    }));
}

function prepare_multiplayer() {
    let lobby_id = url_parameter('l');

    // Auto join lobby
    if (!lobby_id) {
        lobby_id = GAME_ID;
    }

    if (lobby_id) {
        multiplayer.enabled = true;
        meta.lobby_id = lobby_id;

        multiplayer_join_lobby(lobby_id);
    }
}

function store_data(name, json) {
    localStorage.setItem(name, json);
}

function retrieve_data(name) {
   return localStorage.getItem(name);
}

function url_parameter(name) {
    let query_string = parse_query_string();
    return query_string.get(name);
}