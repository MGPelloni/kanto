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
    app.loader
        .add('tilemap', 'assets/graphics/tiles.png')
        .add('sprites', 'assets/graphics/sprites.png')
        .add('items', 'assets/graphics/items.png')
        .add('message', 'assets/graphics/message.jpg')
        .add('emote-shock', 'assets/graphics/emotes/shock.png')
    app.loader.load(kanto_fetch_game);
}

/**
 * Fetches the JSON formatted map data and initializes the game start when complete.
 */
function kanto_fetch_game() {
    if (!game_id && !lobby_id && game_mode == 'play') { // No game or lobby has been provided, return user to homepage
        window.location = `${window.location.protocol}//${window.location.host}/`;
        return;
    }

    if (lobby_id) {
        fetch(`${window.location.protocol}//${window.location.host}/lobby-game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'lobby': lobby_id, 'game': game_id}),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.message) {
                kanto_new_game();
            } else {
                kanto_load_game(data);
            }
        });
    } else if (game_id) {
        fetch(`${window.location.protocol}//${window.location.host}/game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({'game': game_id}),
        }).then((res) => {
            return res.json();
        }).then((data) => {
            kanto_load_game(data);
        });
    } else if (game_mode == 'create' && !game_id) { // No game has been selected, and we are in create mode
        kanto_new_game();
        return;
    }
}

function kanto_new_game() {
    meta = {
        name: 'Untitled Game'
    };

    // Create the first map
    map = new Kanto_Map();
    maps.push(map);

    // Loading is complete, start the game
    kanto_prepare();
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
    kanto_prepare();
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

    let kanto_map = new Kanto_Map(map.id, map.name, map.width, map.height, map.tiles, map.atts, map.music, map.starting_position);
    
    maps.push(kanto_map);
    socket.emit('server_create_map', {lobby_id: lobby_id, game_id: game_id, map: kanto_map});
    editor.update();
    
    return maps;
}

function kanto_map_export() {
    let exported_map = map;

    // Format the data by deleting added properties
    delete exported_map.id;
    delete exported_map.x;
    delete exported_map.y;
    delete exported_map.items;
    
    return JSON.stringify(map);
}

function kanto_game_export() {
    let exported_meta = meta;
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
        game_id: game_id,
        meta: exported_meta,
        player: exported_player,
        maps: exported_maps
    };

    return JSON.stringify(game_data);
}

function kanto_json_map_export() {
    return saveTemplateAsFile(`kanto-map-export.json`, JSON.parse(kanto_map_export()));
}

function kanto_json_game_export() {
    return saveTemplateAsFile(`kanto-game-export.json`, JSON.parse(kanto_game_export()));
}

function kanto_prepare() {
    prepare_background();
    prepare_npc_container();
    prepare_player_container();
    prepare_trainer_container();
    prepare_atts_container();

    prepare_tilemap();
    prepare_spritesheets();
    prepare_item_sprites();
    prepare_audio();
}

/**
 * Initializes the game.
 */
function kanto_start() {
    let sprite = Math.floor(Math.random() * 40); // Mobile spritesheets
    
    if (import_data.player) {
        if (import_data.player.sprite) {
            sprite = import_data.player.sprite;
        }  
    }

    player = new Player({map: map.id, x: map.starting_position.x, y: map.starting_position.y, f: 2}, sprite);
    player.current_map = map;

    // Build the first map
    map.build();

    // Prepare animation tickers
    app.ticker.maxFPS = FPS;
    app.ticker.add(move_loop);
    app.ticker.add(controls_loop);

    // Create editor
    if (game_mode == 'create') {
        prepare_editor();
    }

    // Foreground
    prepare_battle_container();
    prepare_menus();
    prepare_dialogue();

    // Game properties
    prepare_items();

    // Multiplayer
    prepare_multiplayer();

    // Browser elements
    prepare_browser();
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

function prepare_battle_container() {
    battle_container.x = 0
    battle_container.y = 0
    battle_container.width = GAME_WIDTH;
    battle_container.height = GAME_HEIGHT;
    battle_container.visible = true;

    let battle_bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    battle_bg.x = 0
    battle_bg.y = 0
    battle_bg.width = GAME_WIDTH;
    battle_bg.height = GAME_HEIGHT;
    battle_bg.name = 'background';
    battle_bg.visible = false;

    let battle_transition = new PIXI.Sprite(PIXI.Texture.WHITE);
    battle_transition.width = GAME_WIDTH;
    battle_transition.height = GAME_HEIGHT;
    battle_transition.tint = 0x000000;
    battle_transition.name = 'transition';
    battle_transition.visible = true;
    battle_transition.alpha = 0;

    app.stage.addChild(battle_container);
    battle_container.addChild(battle_bg);
    battle_container.addChild(battle_transition);
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

function prepare_player_container() {
    player_container.origin = {
        x: 0,
        y: 0
    }

    player_container.width = GAME_WIDTH;
    player_container.height = GAME_HEIGHT;

    player_container.x = player_container.origin.x;
    player_container.y = player_container.origin.y;

    app.stage.addChild(player_container);
}

function prepare_trainer_container() {
    trainer_container.origin = {
        x: app.view.width / 2 - TILE_SIZE / 2,
        y: (app.view.width / 2 - TILE_SIZE / 2)  - 4,
    }

    trainer_container.x = trainer_container.origin.x;
    trainer_container.y = trainer_container.origin.y;
    trainer_container.visible = true;

    app.stage.addChild(trainer_container);
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

function prepare_item_sprites() {
    let ssheet = new PIXI.Texture.from(app.loader.resources['items'].url);

    for (let i = 0; i < ssheet.width / TILE_SIZE; i++) {
        item_sprites.push(new PIXI.Texture(ssheet, new PIXI.Rectangle(i * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)));
    }
}


function prepare_spritesheets() {
    let ssheet = new PIXI.Texture.from(app.loader.resources['sprites'].url);

    let sprite_width = TILE_SIZE,
        sprite_amount = ssheet.width / TILE_SIZE;

    for (let i = 0; i < sprite_amount; i++) {
        let spritesheet = {};
        let x = i * sprite_width;
        let w = TILE_SIZE;
        let h = TILE_SIZE;

        spritesheet["standSouth"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 0, w, h))
        ];
    
        spritesheet["standNorth"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 1 * h, w, h))
        ];
    
        spritesheet["standWest"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 2 * h, w, h))
        ];
    
        spritesheet["standEast"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 2 * h, w, h), null, null, 12),
        ];
    
        spritesheet["walkSouth"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 3 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 0, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 3 * h, w, h), null, null, 12),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 0, w, h)),
        ];
    
        spritesheet["walkWest"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 5 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 2 * h, w, h)),
        ];
    
        spritesheet["walkEast"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 5 * h, w, h), null, null, 12),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 2 * h, w, h), null, null, 12),
        ];
    
        spritesheet["walkNorth"] = [
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 4 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 1 * h, w, h)),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 4 * h, w, h), null, null, 12),
            new PIXI.Texture(ssheet, new PIXI.Rectangle(x, 1 * h, w, h)),
        ];

        spritesheets.push(spritesheet);
    }
}

function prepare_audio() {
    Howler.mute(true); // Mute the volume across the game until user enables

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

    menus.push(new Menu('Battle', [
        {
            name: 'Fight',
            type: 'menu',
            callback: () => {
                menus[player.menu.current].close();
            }
        },
        {
            name: 'PKMN',
            type: 'menu',
            callback: () => {
                menus[player.menu.current].close();
            }
        },
        {
            name: 'Item',
            type: 'menu',
            callback: () => {
                menus[player.menu.current].close();
            }
        },
        {
            name: 'Run',
            type: 'menu',
            callback: () => {
                sfx.play('run')
            }
        },
    ], {
        width: 96,
        height: 64,
        x: GAME_WIDTH - 96,
        y: GAME_HEIGHT - 64
    }));

    // Pokemon
    let pokemon_options = [];

    player.pokemon.forEach(pokemon => {
        pokemon_options.push({
            name: pokemon.name,
            type: 'Pokemon'
        })
    });

    menus.push(new Menu('Pokemon', pokemon_options, {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        x: 0,
        y: 0
    }));

    // Dialogue
    menus.push(new Menu('Dialogue', [
        {
            name: 'YES',
        }, 
        {
            name: 'NO',
        } 
    ], {
        width: 48,
        height: 48,
        x: 112,
        y: 56
    }));
}

function prepare_multiplayer() {
    let lobby_id = url_parameter('l');

    // Auto join lobby
    if (!lobby_id) {
        lobby_id = game_id;
    }

    multiplayer_join_lobby(lobby_id);
    
    // Chat
    chat = new Chat();

    if (chat.enabled) {   
        if (document.querySelector('#chat-input')) {
            document.querySelector('#chat-input').addEventListener('focus', (e) => {
                paused = true;
            });
        }

        if (document.querySelector('#chat-settings')) {
            document.querySelector('#chat-settings').addEventListener('click', (e) => {
                let name = prompt('What would you like your name to be?');

                if (name) {
                    store_data('player_name', name);
                    player.name = name; 
                    multiplayer_update_name();
                }
            });
        }
    }
}

function prepare_editor() {
    editor = new Editor();
    app.ticker.add(editor_controls_loop);
}

function prepare_browser() {
    // Disabling controls when element is clicked out of
    if (game_mode == 'create') {
        document.addEventListener('click', e => {
            let game_elem = document.querySelector('#pkmn');

            if (document.activeElement === game_elem) {
                paused = false;
            } else {
                paused = true;
            }
        });
    } else {
        document.querySelector('#pkmn').addEventListener('click', e => {
            paused = false;
        });
    }

    // Mobile (Gamepad)
    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    window.addEventListener('contextmenu', e => {
        e.preventDefault();
    });
    
    document.getElementsByTagName("body")[0].addEventListener("touchstart",
        function(e) { e.returnValue = false });

    // Focus on the canvas to enable the game controls
    document.querySelector('#pkmn').focus();

    // Music
    document.querySelector('.toggle-volume').addEventListener('click', e => {
        if (!music.enabled) {
            music.enable();
            sfx.enable();
            document.querySelector('.toggle-volume').classList.remove('-muted');
        } else {
            music.disable();
            sfx.disable();
            document.querySelector('.toggle-volume').classList.add('-muted');
        }

        // Refocus on canvas
        document.querySelector('#pkmn').focus();
    });
}