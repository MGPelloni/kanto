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
        .add('red', 'assets/graphics/red.png')
        .add('tilemap', 'assets/graphics/tileset.png')
        .add('message', 'assets/graphics/message.jpg')
    app.loader.load(kanto_load_maps);
}

/**
 * Fetches the JSON formatted map data and initializes the game start when complete.
 */
function kanto_load_maps() {
    let game_json = retrieve_data(selected_game);

    if (!game_json) { // The data is not on the player's machine and we must retrieve it
        let map_url = `${window.location.protocol}//${window.location.host}/src/js/maps/${selected_game}.json`;

        fetch(map_url).then((res) => {
            return res.text();
        }).then((data) => {
            game_json = data;
            store_data(selected_game, game_json);
            maps = kanto_game_import(game_json);
            map = maps[0];
            kanto_start();
        });
    } else { // Loading the data from localStorage
        maps = kanto_game_import(game_json);
        map = maps[0];
        kanto_start();
    }
}

function kanto_game_export() {
    let exported_data = maps.map(object => ({ ...object })) // clone the maps data without object references
    exported_data.forEach(exported_map => {
        // Format the data by deleting added properties
        delete exported_map.id;
        delete exported_map.x;
        delete exported_map.y;
    });   

    return JSON.stringify(exported_data);
}

function kanto_game_import(game_json) {
    let data = JSON.parse(game_json),
        res = [],
        maps_data = Object.entries(data);

    maps_data.forEach(([key, map]) => {
        map.id = parseInt(key);
        kanto_map = new Kanto_Map(map.id, map.name, map.width, map.height, map.tiles, map.atts, map.music, map.starting_position);
        res.push(kanto_map);
    });

    return res;
}

function kanto_editor_upload() {
    console.log(kanto_game_export());
}

/**
 * Initializes the game.
 */
function kanto_start() {
    prepare_background();
    prepare_atts_container();

    prepare_tilemap();
    prepare_spritesheets();
    prepare_audio();

    // Audio
    Howler.mute(true); // Mute the volume across the game until user enables
    
    player = new Player('RED', {map: map.id, x: map.starting_position.x, y: map.starting_position.y}, spritesheets.red);
    player.current_map = map;

    map.build();
    app.ticker.add(move_loop);
    app.ticker.add(controls_loop);

    if (game_mode == 'Creative') {
        editor = new Editor();
        app.ticker.add(editor_controls_loop);
    }

    // Focus on the canvas to enable the game controls
    document.querySelector('#pkmn').focus();

    // Foreground
    prepare_dialogue();
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
    spritesheets.red = create_spritesheet(app.loader.resources['red'].url);
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

function store_data(name, json) {
    localStorage.setItem(name, json);
}

function retrieve_data(name) {
   return localStorage.getItem(name);
}