class Editor {
    constructor() {
        this.selected_texture = 0;
        this.selected_attribute = 1;
        this.enabled = true;
        this.zoom = 100;
        this.zoom_timeout = false;
        this.palette = document.querySelector('#tile-editor img');
        this.mode = null;

        if (this.palette) {
            this.prepare_maps();
            this.prepare_palette();
            this.prepare_tiles();
            this.prepare_atts();
        }
    }

    refresh() {
        atts_container.visible = false;
        
        switch (this.mode) {
            case 'atts':
                atts_container.visible = true;
                break;
            default:
                break;
        }
    }

    prepare_palette() {
        this.palette.addEventListener('click', e => {
            let tilemap_width = Math.floor(this.palette.width / TILE_SIZE);
            let tile_editor_click = {
                x: Math.floor(e.offsetX / TILE_SIZE),
                y: Math.floor(e.offsetY / TILE_SIZE),
            }
        
            tile_editor_click.tile = tile_editor_click.x + tilemap_width * tile_editor_click.y;
            this.selected_texture = tile_editor_click.tile;
            console.log(tile_editor_click);
        });
    }

    prepare_tiles() {
        background.children.forEach(sprite => {  
            sprite.interactive = true;
            sprite.origin = {
                texture: sprite.texture
            }
        
            sprite.on('pointerdown', (e) => {
                switch (this.mode) {
                    case 'tiles':
                        this.adjust_tile(sprite);
                        break;
                    case 'atts':
                        let attribute_type = this.selected_attribute;

                        if (e.data.originalEvent.which == 3) {
                            attribute_type = 0;
                        }

                        this.adjust_attribute(sprite.game_position, attribute_type);
                    default:
                        break;
                }
            });
        
            sprite.on('mouseover', (e) => {
                if (this.mode == 'tiles') {
                    sprite.alpha = 0.8;
                    sprite.texture = tile_textures[this.selected_texture];
                }

                if (this.mode == 'atts') {
                    let targeted_attribute = map.atts[sprite.game_position.index];
                    atts_container.children[sprite.game_position.index].alpha = 0.4;

                    switch (this.selected_attribute) {
                        case 1:
                            atts_container.children[sprite.game_position.index].tint = '0xFF0000';
                            break;
                        case 2:
                            atts_container.children[sprite.game_position.index].tint = '0x0000FF';
                            break;
                        case 3:
                            atts_container.children[sprite.game_position.index].tint = '0x00FF00';
                            break;
                        case 4:
                            atts_container.children[sprite.game_position.index].tint = '0xFFA500';
                            break;
                        default:
                            break;
                    }

                }
            });
            
            sprite.on('mouseout', (e) => {
                if (this.mode == 'tiles') {
                    sprite.alpha = 1.0;
                    sprite.texture = sprite.origin.texture;
                }

                if (this.mode == 'atts') {
                    let targeted_attribute = map.atts[sprite.game_position.index];
                    atts_container.children[sprite.game_position.index].alpha = 1;

                    switch (targeted_attribute.type) {
                        case 1:
                            atts_container.children[sprite.game_position.index].tint = '0xFF0000';
                            break;
                        case 2:
                            atts_container.children[sprite.game_position.index].tint = '0x0000FF';
                            break;
                        case 3:
                            atts_container.children[sprite.game_position.index].tint = '0x00FF00';
                            break;
                        case 4:
                            atts_container.children[sprite.game_position.index].tint = '0xFFA500';
                            break;
                        default:
                            atts_container.children[sprite.game_position.index].tint = '0xEEEEEE';
                            atts_container.children[sprite.game_position.index].alpha = 0;
                            break;
                    }

                }
            });      
        });
    }

    prepare_atts() {
        set_att_editor(this.selected_attribute);
    }

    prepare_maps() {
        let editor_display = document.querySelector('#map-editor .general-editor-display');
        let map_element = document.createElement('ol');

        maps.forEach(map => {
            let map_single = document.createElement('li');
            map_single.innerHTML = map.name;
            map_single.setAttribute('data-map', map.id);
            map_element.appendChild(map_single)
        });

        editor_display.innerHTML = '';
        editor_display.appendChild(map_element);


        document.querySelectorAll('#kanto-editor [data-map]').forEach(elem => {
            elem.addEventListener('click', e => {
                let index = parseInt(elem.dataset.map);
                let selected_map = maps[index];

                player.place(selected_map.starting_position.x, selected_map.starting_position.y, selected_map.id);
            });
        });
    }

    adjust_tile(sprite) {
        sprite.texture = tile_textures[this.selected_texture];
        sprite.origin.texture = sprite.texture;

        maps[sprite.game_position.map].tiles[sprite.game_position.index] = this.selected_texture;
        map = maps[sprite.game_position.map];
        return;
    }

    /**
     * 
     * @todo See if using build_atts function here is too costly.
     * @param {Object} sprite The PIXI Sprite we're affecting
     */
    adjust_attribute(position, type) {
        // Adjust visual
        let color = '';
        switch (type) {
            case 1:
              color = '0xFF0000';
              break;
            case 2: 
              color = '0x0000FF';
              break;
            case 3: 
              color = '0x00FF00';
              break;
            case 4:
              color = '0xFFA500';
            default:
              color = '0xEEEEEE';
              break;
        }

        // Adjust map data
        if (type) {
            maps[position.map].atts[position.index] = this.gather_data();
        } else {
            maps[position.map].atts[position.index] = {type: 0};
        }

        map = maps[position.map];
        atts_container.children[position.index].tint = color;
        return;
    }

    gather_data() {
        let inputs = document.querySelectorAll('.editor.-active input');
        let data = {};

        if (inputs) {
            inputs.forEach(input => {
                if (input.type == 'number') {
                    data[input.name] = parseInt(input.value);
                } else {
                    data[input.name] = input.value;
                }
            });

            return data;
        }

        return false;
    }
}

function map_export() {
    console.log(JSON.stringify(map.tiles));
    console.log(JSON.stringify(map.atts));
}

function add_padding() {
    let new_map = [];
    let new_atts = [];
    let new_height = map.height + 2;
    let new_width = map.width + 2;

    for (let y = 0; y < new_height; y++) {
        for (let x = 0; x < new_width; x++) {
            if (y == 0 || y == new_height - 1) {
                new_map.push(0);
                new_atts.push({type: 0});
            } else if (x == 0) {
                new_map.push(0);
                new_atts.push({type: 0});
            } else if (x == map.width + 1) {
                new_map.push(0);
                new_atts.push({type: 0});
            } else {
                new_map.push(map.tiles[(x - 1) + map.width * (y - 1)])
                new_atts.push(map.atts[(x - 1) + map.width * (y - 1)]);
            }
        }
    }

    console.log(JSON.stringify(new_map));
    console.log(JSON.stringify(new_atts));
}

function fill_map(tile) {
    background.removeChildren();
    map.tiles = [];

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        let index = x + map.width * y;
        let sprite = new PIXI.Sprite(tile_textures[tile]);
        map.tiles.push(tile);
        sprite.x = x * TILE_SIZE;
        sprite.y = y * TILE_SIZE;
        sprite.game_position = {map: map.id, x: x, y: y, index: index}; 
        background.addChild(sprite);
      }
   }
}

function center_stage_assets() {
    background.origin.x = app.screen.width / 2 - TILE_SIZE / 2;
    background.origin.y = app.screen.width / 2 - TILE_SIZE / 2; 
    
    atts_container.origin.x = app.screen.width / 2 - TILE_SIZE / 2;
    atts_container.origin.y = app.screen.width / 2 - TILE_SIZE / 2; 

    player.sprite.x = app.screen.width / 2;
    player.sprite.y = app.screen.height / 2;

    background.x = background.origin.x + ((player.position.x * TILE_SIZE) * -1);
    background.y = background.origin.y + ((player.position.y * TILE_SIZE) * -1);

    atts_container.x = atts_container.origin.x + ((player.position.x * TILE_SIZE) * -1);
    atts_container.y = atts_container.origin.y + ((player.position.y * TILE_SIZE) * -1);
}

document.querySelectorAll('#kanto-editor [data-open]').forEach(elem => {
    elem.addEventListener('click', e => {
        document.querySelectorAll('.editor').forEach(elem => {
            elem.classList.remove('-active');
        });

        document.querySelector(elem.dataset.open).classList.add('-active');
        editor.mode = elem.dataset.mode;
        editor.refresh();
    });
});

document.querySelectorAll('#kanto-editor [data-att]').forEach(elem => {
    elem.addEventListener('click', e => {
        editor.selected_attribute = parseInt(elem.dataset.att);
        set_att_editor(editor.selected_attribute);
    });
});


function set_att_editor(type) {
    let att_editor = document.querySelector('#att-editor');
    let display_editor = att_editor.querySelector('.general-editor-display');
    display_editor.innerHTML = '';

    switch (type) {
        case 1:
            display_editor.innerHTML += '<h5>Wall</h5>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Type:</label><input name="type" type="number" value="1" disabled></div>';
            break;
        case 2:
            display_editor.innerHTML += '<h5>Warp</h5>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Type:</label><input name="type" type="number" value="2" disabled></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Map:</label><input name="map" type="number"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>X:</label><input name="x" type="number"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Y:</label><input name="y" type="number"></div>';
            break;
        case 3:
            display_editor.innerHTML += '<h5>Action</h5>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Type:</label><input name="type" type="number" value="3" disabled></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Message:</label><textarea name="message" type="text"></textarea>';
            break;
        case 4:
            display_editor.innerHTML += '<h5>Exit</h5>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Type:</label><input name="type" type="number" value="4" disabled></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Map:</label><input name="map" type="number"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>X:</label><input name="x" type="number"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Y:</label><input name="y" type="number"></div>';
            break;
        default:
            break;
    }
}