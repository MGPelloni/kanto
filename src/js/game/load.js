function kanto_load() {
    kanto_load_assets();
}

function kanto_load_assets() {
    app.loader
        .add('red', 'assets/images/red.png')
        .add('tilemap', 'assets/images/tileset.png')
    app.loader.load(kanto_load_maps);
}

function kanto_load_maps() {
    fetch('http://localhost:8000/src/js/maps/pallet.json').then((res) => {
        return res.json();
    }).then((data) => {
        map_data = Object.entries(data);
        map_data.forEach(([key, map]) => {
          map.id = parseInt(key);
          kanto_map = new Kanto_Map(map.id, map.name, map.width, map.height, map.tiles, map.atts, map.npcs, map.music, map.starting_position);
          maps.push(kanto_map);
        });
        
        map = maps[0];

        kanto_start();
    });
}

function kanto_start() {
    prepare_background();
    prepare_atts_container();
    prepare_tilemap();
    prepare_spritesheets();
    
    player = new Player('RED', {map: map.id, x: map.starting_position.x, y: map.starting_position.y}, spritesheets.red);
    player.current_map = map;

    map.build();
    app.ticker.add(move_loop);
    app.ticker.add(controls_loop);

    if (game_mode == 'Creative') {
        editor = new Editor();
        app.ticker.add(editor_controls_loop);
    }
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

function store_data(name, object) {
    localStorage.setItem(name, JSON.stringify(object));
}

function retrieve_data(name) {
   return localStorage.getItem(name);
}