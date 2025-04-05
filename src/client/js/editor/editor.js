class Editor {
    constructor() {
        this.initialized = false;
        this.selected_texture = 0;
        this.selected_attribute = 1;
        this.enabled = true;
        this.zoom = 100;
        this.action_timeout = false;
        this.palette = document.querySelector('#tile-editor img');
        this.mode = null;
        this.templates = {
            games: [],
            maps: []
        };

        this.working_dialogue = [];

        if (this.palette) {
            this.prepare_maps();
            this.prepare_palette();
            this.prepare_tiles();
            this.prepare_atts();
            this.prepare_properties();
            // this.saved_games_list();
            this.log();

            editor_event_listeners();
            this.layout_listeners();

            // Async
            kanto_get_game_templates().then(data => {
                this.templates.games = data;
                editor.prepare_game_template_list(data);
            });

            kanto_get_map_templates().then(data => {
                this.templates.maps = data;
                editor.prepare_map_template_list(data);
            });
        }

        this.event_listeners();
        this.initialized = true;   
    }

    event_listeners() {
        if (!this.initialized) {            
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
                    editor.clear_working_dialogue();
                    editor.clear_working_pokemon();
                });
            });
            
            if (document.querySelector('#editor-publish-game')) {
                document.querySelector('#editor-publish-game').addEventListener('click', e => {
                    editor.publish();
                });
            }
            
            if (document.querySelector('#editor-new-map')) {
                document.querySelector('#editor-new-map').addEventListener('click', e => {
                    let name = prompt('Map name:');
                    let width = parseInt(prompt('Map width:'), 10);
                    let height = parseInt(prompt('Map height:'), 10);
                    editor.create_new_map(name, width, height);
                });
            }
            
            if (document.querySelector('#editor-delete-map')) {
                document.querySelector('#editor-delete-map').addEventListener('click', e => {
                    editor.delete_map();
                });
            }

            if (document.querySelector('#editor-add-message')) {
                document.querySelector('#editor-add-message').addEventListener('click', e => {
                    editor.add_message_to_dialogue();
                });
            }

            if (document.querySelector('#editor-message-add-option')) {
                document.querySelector('#editor-message-add-option').addEventListener('click', e => {
                    editor.add_message_field('option');
                });
            }

            if (document.querySelector('#editor-add-layout')) {
                document.querySelector('#editor-add-layout').addEventListener('click', e => {
                    editor.add_layout();
                });
            }

            if (document.querySelector('#editor-delete-layout')) {
                document.querySelector('#editor-delete-layout').addEventListener('click', e => {
                    editor.delete_layout();
                });
            }


            if (document.querySelector('#editor-message-add-conditional')) {
                document.querySelector('#editor-message-add-conditional').addEventListener('click', e => {
                    editor.add_message_field('conditional');
                });
            }

            if (document.querySelector('#editor-message-add-pre-callback')) {
                document.querySelector('#editor-message-add-pre-callback').addEventListener('click', e => {
                    editor.add_message_field('pre_callback');
                });
            }

            if (document.querySelector('#editor-message-add-post-callback')) {
                document.querySelector('#editor-message-add-post-callback').addEventListener('click', e => {
                    editor.add_message_field('post_callback');
                });
            }

            if (document.querySelector('#editor-message-add-response')) {
                document.querySelector('#editor-message-add-response').addEventListener('click', e => {
                    editor.add_message_field('response');
                });
            }

            if (document.querySelector('#editor-add-pokemon')) {
                document.querySelector('#editor-add-pokemon').addEventListener('click', e => {
                    editor.add_pokemon_to_tile();
                });
            }
        }
    }

    update() {
        this.prepare_maps();
        this.prepare_tiles();
        this.prepare_atts();
        this.prepare_properties();
        // this.saved_games_list();

        this.save();
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
            document.querySelector('#pkmn').focus();
        });
    }

    edit_tile(sprite) {
        switch (this.mode) {
            case 'tiles':
                this.adjust_tile(sprite);
                this.save();
                break;
            case 'atts':
                let attribute_type = this.selected_attribute;

                if (editor.mouse_event == 3) {
                    attribute_type = 0;
                }

                this.adjust_attribute(sprite.game_position, attribute_type);
                map.build_npcs(); // reset npcs
                map.server_sync();
                this.save();
            default:
                break;
        }
    }

    prepare_tiles() {
        background.children.forEach(sprite => {  
            if (sprite.interactive) {
                return;
            }

            sprite.interactive = true;
            sprite.origin = {
                texture: sprite.texture
            }
        
            sprite.on('pointerdown', (e) => {
                editor.pointer_down = true;
                editor.mouse_event = e.data.originalEvent.which;
                this.edit_tile(sprite);
            });

            sprite.on('pointerup', (e) => {
                editor.pointer_down = false;
                editor.mouse_event = null;
            });

        
            sprite.on('mouseover', (e) => {
                if (editor.pointer_down) {
                    this.edit_tile(sprite);
                }

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
                        case 5:
                            atts_container.children[sprite.game_position.index].tint = '0x000000';
                            break;
                        case 6:
                            atts_container.children[sprite.game_position.index].tint = '0xFFD5D5';
                            break;
                        case 7:
                            atts_container.children[sprite.game_position.index].tint = '0xDAA520';
                            break;
                        case 8:
                            atts_container.children[sprite.game_position.index].tint = '0x35530A';
                            break;
                        case 9:
                            atts_container.children[sprite.game_position.index].tint = '0x561D5E';
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
                        case 5:
                            atts_container.children[sprite.game_position.index].tint = '0x000000';
                            break;
                        case 6:
                            atts_container.children[sprite.game_position.index].tint = '0xFFD5D5';
                            break;
                        case 7:
                            atts_container.children[sprite.game_position.index].tint = '0xDAA520';
                            break;
                        case 8:
                            atts_container.children[sprite.game_position.index].tint = '0x35530A';
                            break;
                        case 9:
                            atts_container.children[sprite.game_position.index].tint = '0x561D5E';
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
        let editor_maps_list = document.querySelector('#map-editor #editor-maps-list');
        editor_maps_list.innerHTML = '';

        maps.forEach(map => {
            let map_single = document.createElement('li');
            map_single.innerHTML = `${map.id}: ${map.name}`;
            map_single.setAttribute('data-map', map.id);
            editor_maps_list.appendChild(map_single)
        });

        document.querySelectorAll('#kanto-editor [data-map]').forEach(elem => {
            elem.addEventListener('click', e => {
                let index = parseInt(elem.dataset.map);
                let selected_map = maps[index];

                player.place(selected_map.starting_position.x, selected_map.starting_position.y, selected_map.id);
                multiplayer_update_position(true);
                this.update_editor_properties();
                document.querySelector('#pkmn').focus(); // Shift focus to viewport
            });
        });

        this.update_editor_properties();
    }

    prepare_properties() {
        let editor_properties = document.querySelectorAll('[data-property]');

        editor_properties.forEach(elem => {
            elem.addEventListener('change', e => {
                this.adjust_property(elem.dataset.property, elem.value);
                this.update_editor_properties();
            });
        });

        this.update_editor_properties();
    }

    update_editor_properties() {
        let editor = document.querySelector('#kanto-editor');

        if (editor) {
            editor.querySelector('input[name=editor-map-name]').value = map.name;
            editor.querySelector('input[name=editor-map-music]').value = map.music;
            editor.querySelector('input[name=editor-start-x]').value = map.starting_position.x;
            editor.querySelector('input[name=editor-start-y]').value = map.starting_position.y;
            editor.querySelector('input[name=editor-map-width]').value = map.width;
            editor.querySelector('input[name=editor-map-height]').value = map.height;

            editor.querySelector('input[name=editor-game-name]').value = meta.name;
            editor.querySelector('input[name=editor-game-sprite]').value = player.spritesheet_id;
        }
    }

    adjust_tile(sprite) {
        tileSpritePool.empty();
        
        sprite.texture = tile_textures[this.selected_texture];
        sprite.origin.texture = sprite.texture;

        maps[sprite.game_position.map].tiles[sprite.game_position.index] = this.selected_texture;
        map = maps[sprite.game_position.map];

        socket.emit('server_adjust_tile', {lobby_id: lobby_id, game_id: game_id, tile: this.selected_texture, map: sprite.game_position.map, index: sprite.game_position.index});
        return; 
    }

    /**
     * 
     * @todo See if using build_atts function here is too costly.
     * @param {Object} sprite The PIXI Sprite we're affecting
     */
    adjust_attribute(position, type) {
        // Adjust visual
        let color = this.get_att_color(type);

        // Adjust map data
        if (type) {
            maps[position.map].atts[position.index] = this.gather_data();
        } else {
            maps[position.map].atts[position.index] = {type: 0};
        }

        map = maps[position.map];
        atts_container.children[position.index].tint = color;
        socket.emit('server_adjust_att', {lobby_id: lobby_id, game_id: game_id, att: maps[position.map].atts[position.index], map: position.map, index: position.index});
        return;
    }

    get_att_color(att_type) {
        switch (att_type) {
            case 1:
              return '0xFF0000';
              break;
            case 2: 
              return '0x0000FF';
              break;
            case 3: 
              return '0x00FF00';
              break;
            case 4:
              return '0xFFA500';
              break;
            case 5:
              return '0x000000';
              break;
            case 6:
              return '0xFFD5D5';
              break;
            case 7:
              return '0xDAA520';
              break;
            case 8:
              return '0x35530A';
              break;
            case 9:
              return '0x561D5E';
              break;
            default:
              return '0xEEEEEE';
              break;
        }
    }

    adjust_property(key, value) {
        switch (key) {
            case 'name':
                maps[map.id].name = value;
                break;
            case 'music':
                maps[map.id].music = parseInt(value);

                if (music) {
                    music.play(map.music);
                }
                break;
            case 'start_x':
                maps[map.id].starting_position.x = parseInt(value);
                break;
            case 'start_y':
                maps[map.id].starting_position.y = parseInt(value);
                break;
            case 'game_name':
                localStorage.removeItem(meta.name);
                meta.name = value;
                
                break;
            case 'game_sprite':
                player.change_spritesheet(parseInt(value));
                break;
            default:
                break;
        }

        map = maps[map.id];
        this.prepare_maps();
        this.save();
        return;
    }

    save() {
        let game_export = kanto_game_export();
        store_data(meta.name, game_export);
    }

    publish() {
        let req_body = kanto_game_export();

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
                game_id = data.game_id;
                store_data(meta.name, kanto_game_export());
            } else {
                alert('Game upload failed! Please try again later.');
            }
        });
    }

    gather_data() {
        let inputs = document.querySelectorAll('.editor.-active input, .editor.-active textarea, .editor.-active select');
        let data = {};

        // console.log(inputs);

        if (inputs) {
            inputs.forEach(input => {
                if (input.type == 'number') {
                    data[input.name] = parseInt(input.value);
                } else {
                    if (input.name == 'message') {
                        data[input.name] = input.value.split(/\r?\n/); // Split up the messages by line breaks within the textarea
                    } else {
                        data[input.name] = input.value;
                    }
                }
            });

            if (this.working_dialogue) {
                if (this.working_dialogue.length > 0) {
                    data['dialogue'] = this.prepare_dialogue_data();
                }
            }

            if (this.working_pokemon) {
                if (this.working_pokemon.length > 0) {
                    data['pokemon'] = this.working_pokemon;
                }
            }


            return data;
        }

        return false;
    }

    prepare_dialogue_data() {
        let prepared_dialogue = [];

        this.working_dialogue.forEach(message => {
            let prepared_message = {};
            prepared_message.text = message.text;

            if (message.options) {
                prepared_message.options = [];

                message.options.forEach(option => {
                    prepared_message.options.push({
                        option: option,
                        dialogue: []
                    });
                });
            }

            if (message.conditionals) {
                prepared_message.conditionals = [];

                message.conditionals.forEach(conditional => {
                    prepared_message.conditionals.push({
                        name: conditional.name,
                        key: conditional.key,
                        value: conditional.value,
                    });
                });
            }

            if (message.pre_callback) {
                prepared_message.pre_callback = {...message.pre_callback};
                prepared_message.pre_callback.args = this.prepare_callback_args(prepared_message.pre_callback.name, prepared_message.pre_callback.args);
            }

            if (message.post_callback) {
                prepared_message.post_callback = {...message.post_callback};
                prepared_message.post_callback.args = this.prepare_callback_args(prepared_message.post_callback.name, prepared_message.post_callback.args);
            }

            if (message.response) {
                let found_option = false;
                
                for (let index = prepared_dialogue.length - 1; index >= 0; index--) {
                    if (!found_option && prepared_dialogue[index].options) {
                        prepared_dialogue[index].options.forEach((option, j) => {
                            if (found_option) {
                                return;
                            }

                            if (option.dialogue) {
                                option.dialogue.forEach((inner_message, k) => {
                                    if (inner_message.options) {
                                        inner_message.options.forEach((inner_option, l) => {
                                            if (inner_option.option == message.response) {
                                                found_option = true;
                                                prepared_dialogue[index].options[j].dialogue[k].options[l].dialogue.push(prepared_message);
                                                return;
                                            }
                                        });
                                    }
                                })
                            }

                            if (option.option == message.response) {
                                found_option = true;
                                prepared_dialogue[index].options[j].dialogue.push(prepared_message);
                                return;
                            }
                        });
                    }
                }
            } else {
                prepared_dialogue.push(prepared_message);
            }            
        });

        return prepared_dialogue;
    }

    add_message_to_dialogue() {
        let inputs = document.querySelectorAll('#message-editor input, #message-editor textarea, #message-editor select');
        let data = {};

        if (inputs) {
            inputs.forEach(input => {

                if (!input.value) {
                    return;
                }

                switch (input.name) {
                    case 'option':
                        if (!data.options) {
                            data.options = [];
                        }

                        data.options.push(input.value);
                        break;
                    case 'conditional':
                        if (!data.conditionals) {
                            data.conditionals = [];
                        }

                        data.conditionals.push({name: input.value});
                        break;
                    case 'conditional_key':
                        data.conditionals[data.conditionals.length - 1].key = input.value;
                        break;
                    case 'conditional_value':
                        data.conditionals[data.conditionals.length - 1].value = input.value;
                        break;
                    case 'pre_callback':
                        if (!data.pre_callback) {
                            data.pre_callback = {name: input.options[input.selectedIndex].text};
                        } else {
                            data.pre_callback.name = input.options[input.selectedIndex].text;
                        }
                        break;
                    case 'pre_callback_args': 
                        if (!data.pre_callback) {
                            data.pre_callback = {args: input.value};
                        } else {
                            data.pre_callback.args = input.value
                        }
                        break;
                    case 'post_callback':
                        if (!data.post_callback) {
                            data.post_callback = {name: input.options[input.selectedIndex].text};
                        } else {
                            data.post_callback.name = input.options[input.selectedIndex].text;
                        }
                        break;
                    case 'post_callback_args': 
                        if (!data.post_callback) {
                            data.post_callback = {args: input.value};
                        } else {
                            data.post_callback.args = input.value
                        }
                        break;
                    default:
                        data[input.name] = input.value;
                        break;
                }
                
                input.value = '';

                if (input.name == 'type') {
                    input.value = 'Text'; // Resetting the editor select
                }
            });

            this.working_dialogue.push(data);
            this.reset_editors();

            document.querySelector('#message-editor').classList.add('_hidden');
        }

        this.update_working_dialogue_list();
    }

    add_pokemon_to_tile() {
        let inputs = document.querySelectorAll('#pokemon-editor input, #pokemon-editor textarea, #pokemon-editor select');
        let data = {};

        if (inputs) {
            inputs.forEach(input => {
                if (!input.value) {
                    return;
                }

                switch (input.name) {      
                    default:
                        data[input.name] = input.value;
                        break;
                }
            });

            this.working_pokemon.push(data);
            this.reset_editors();

            document.querySelector('#pokemon-editor').classList.add('_hidden');
        }

        this.update_working_pokemon_list();
    }

    reset_editors() {
        let message_form = document.querySelector('.editor-message-form');
        message_form.innerHTML = '<div class="editor-data-line"><span>Text:</span><textarea name="text"></textarea></div>';

        let pokemon_form = document.querySelector('.editor-pokemon-form');
        pokemon_form.innerHTML = '<div class="editor-data-line"> <span>ID:</span> <input type="number" name="id"></input> </div> <div class="editor-data-line"> <span>Level:</span> <input type="number" name="level"></input> </div>';
    }

    add_message_field(type) {
        let message_form = document.querySelector('.editor-message-form');
        
        let message_container = document.createElement('div');
        message_container.classList.add('editor-data-line');        

        switch (type) {
            case 'option':
                message_container.innerHTML = '<div><span>Option:</span><input type="text" name="option"></div>';
                break;
            case 'conditional':
                message_container.innerHTML = '<div><span>Conditional:</span>' + this.conditional_options() + '</div><div><span>Key:</span><input type="text" name="conditional_key"></div><div><span>Value:</span><input type="text" name="conditional_value"></div>';
                break;
            case 'pre_callback':
                message_container.innerHTML = '<div><span>Pre Callback:</span>' + this.callback_options('pre') + '<input type="text" name="pre_callback_args"></div>';
                break;
            case 'post_callback':
                message_container.innerHTML = '<div><span>Post Callback:</span>' + this.callback_options('post') + '<input type="text" name="post_callback_args"></div>';
                break;
            case 'response':
                message_container.innerHTML = '<div><span>Response:</span><input type="text" name="response"></div>';
            default:
                break;
        }

        message_form.appendChild(message_container);
    }

    /**
     * Gives the user the ability to stitch maps together utilizing a layout.
     * 
     * Example structure to add to game.json:
     * "layouts": {
            "overworld": {
                "name": "Overworld",
                "grid": [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
                ]
            },
            "dungeon1": {
                "name": "Dungeon 1",
                "grid": [
                [10, 11],
                [12, 13]
                ]
            }
        }
     */

    layout_listeners() {
        document.getElementById('layout-generate-grid').addEventListener('click', () => {
            const width = parseInt(document.getElementById('layout-width').value, 10);
            const height = parseInt(document.getElementById('layout-height').value, 10);
            const gridContainer = document.getElementById('layout-grid-container');
        
            if (!width || !height) return alert('Set valid width and height.');
        
            gridContainer.style.gridTemplateColumns = `repeat(${width}, 48px)`;
            gridContainer.innerHTML = '';
        
            for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const input = document.createElement('input');
                input.className = 'layout-grid-cell';
                input.type = 'text';
                input.dataset.x = x;
                input.dataset.y = y;
                gridContainer.appendChild(input);
            }
            }
        });
        
        document.getElementById('layout-save').addEventListener('click', () => {
            const name = document.getElementById('layout-name').value;
            const width = parseInt(document.getElementById('layout-width').value, 10);
            const height = parseInt(document.getElementById('layout-height').value, 10);
            const cells = document.querySelectorAll('.layout-grid-cell');
        
            if (!name || !width || !height) return alert('Name, width, height required.');
        
            const layout_grid = [];
            for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                const cell = Array.from(cells).find(c => parseInt(c.dataset.x) === x && parseInt(c.dataset.y) === y);
                row.push(cell ? cell.value.trim() : '');
            }
            layout_grid.push(row);
            }
        
            const layout = { name, grid: layout_grid };
            if (!meta.layouts) meta.layouts = [];
            meta.layouts.push(layout);
        
            alert(`Layout "${name}" saved.`);
        });
        
        document.getElementById('layout-cancel').addEventListener('click', () => {
            document.getElementById('layout-name').value = '';
            document.getElementById('layout-width').value = '';
            document.getElementById('layout-height').value = '';
            document.getElementById('layout-grid-container').innerHTML = '';
        });
        
        const widthInput = document.getElementById('layout-width');
        const heightInput = document.getElementById('layout-height');
        const gridContainer = document.getElementById('layout-grid-container');

        function updateGridSize() {
        const width = parseInt(widthInput.value, 10);
        const height = parseInt(heightInput.value, 10);
        if (!width || !height) return;

        const oldCells = Array.from(document.querySelectorAll('.layout-grid-cell'));
        const oldWidth = parseInt(gridContainer.style.gridTemplateColumns.split(' ').length || 0, 10);
        const oldHeight = oldCells.length / oldWidth || 0;

        gridContainer.style.gridTemplateColumns = `repeat(${width}, 48px)`;

        const newCells = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
            const existing = oldCells.find(c => parseInt(c.dataset.x) === x && parseInt(c.dataset.y) === y);
            if (existing) {
                newCells.push(existing);
            } else {
                const input = document.createElement('input');
                input.className = 'layout-grid-cell';
                input.type = 'text';
                input.dataset.x = x;
                input.dataset.y = y;
                newCells.push(input);
            }
            }
        }

        gridContainer.innerHTML = '';
        newCells.forEach(cell => gridContainer.appendChild(cell));
        }

        ['input', 'change'].forEach(evt => {
        widthInput.addEventListener(evt, updateGridSize);
        heightInput.addEventListener(evt, updateGridSize);
        });

        document.getElementById('layout-generate-grid').addEventListener('click', updateGridSize);

    }
    
    add_layout() {
        const name = prompt('Layout name:');
        const width = parseInt(prompt('Layout width:'), 10);
        const height = parseInt(prompt('Layout height:'), 10);
    
        if (!name || isNaN(width) || isNaN(height)) {
            alert('Invalid layout parameters.');
            return;
        }
    
        const grid = [];
    
        for (let y = 0; y < height; y++) {
            const input = prompt(`Row ${y} (comma-separated map IDs):`);
            const row = input.split(',').map(id => {
                const parsed = parseInt(id.trim(), 10);
                return isNaN(parsed) ? null : parsed;
            });
    
            if (row.length !== width) {
                alert(`Row ${y} does not match width.`);
                return;
            }
    
            grid.push(row);
        }
    
        const layout = { name, grid };
    
        if (!meta.layouts) meta.layouts = [];
        meta.layouts.push(layout);
    }

    callback_options(type = 'pre') {
        return `
        <select name="${type}_callback">
            <option>dialogue_sfx</option>
            <option>dialogue_cry_sfx</option>
            <option>dialogue_give_item</option>
            <option>dialogue_force_move_north</option>
            <option>dialogue_force_move_east</option>
            <option>dialogue_force_move_south</option>
            <option>dialogue_force_move_west</option>
            <option>dialogue_force_spin_north</option>
            <option>dialogue_force_spin_east</option>
            <option>dialogue_force_spin_south</option>
            <option>dialogue_force_spin_west</option>
            <option>dialogue_give_money</option>
            <option>dialogue_take_money</option>
            <option>dialogue_player_place</option>
            <option>dialogue_set_flag</option>
            <option>dialogue_delete_flag</option>
        </select>`;
    }

    conditional_options() {
        return `
        <select name="conditional">
            <option>has_item</option>
            <option>has_money</option>
            <option>has_pokedex</option>
            <option>has_pokemon</option>
            <option>has_flag</option>
        </select>`;
    }

    prepare_callback_args(name, args) {
        args = args.split(',');

        switch (name) {
            case 'dialogue_sfx':
            case 'dialogue_give_item':
            case 'dialogue_take_item':
                return {name: args[0]};
                break;             
            case 'dialogue_cry_sfx':
                return {id: args[0]};
                break;   
            case 'dialogue_force_move_north':
            case 'dialogue_force_move_east':
            case 'dialogue_force_move_south':
            case 'dialogue_force_move_west':
            case 'dialogue_force_spin_north':
            case 'dialogue_force_spin_east':
            case 'dialogue_force_spin_south':
            case 'dialogue_force_spin_west':                
                return {spaces: args[0]};
                break; 
            case 'dialogue_set_flag':
                return {name: args[0], value: args[1]};
                break;
            case 'dialogue_delete_flag':
                return {name: args[0]};
            case 'dialogue_give_money':
            case 'dialogue_take_money':
                return {value: args[0]};
                break;
            case 'dialogue_give_pokemon':
            case 'dialogue_take_pokemon':
                return {id: args[0], level: args[1]};
                break;
            case 'dialogue_player_place':
                return {x: args[0], y: args[1], map: args[2]};
                break;
            default:
                return {name: args[0]};
                break;
        }
    }

    update_working_dialogue_list() {
        let working_dialogue_list = document.querySelector('.editor.-active .dialogue-editor-list');

        working_dialogue_list.innerHTML = '';
        
        let depth = 0;

        this.working_dialogue.forEach((message, i) => {
            let li = document.createElement('li');
            li.setAttribute('data-index', i);
            li.setAttribute('data-depth', depth);

            if (message.options) {
                depth++;
            }

            if (message.response) {
                li.innerHTML += `${message.response}: `;
            }

            if (typeof message === 'object') {
                li.innerHTML += message.text;
            }

            // Options
            let options = document.createElement('div');

            let buttons = ['up', 'down', 'x'];

            buttons.forEach(option => {
                let button = document.createElement('button');
                button.innerText = option;
                button.classList.add(`message-option-${option}`);

                switch (option) {
                    case 'up':
                        button.addEventListener('click', e => {
                            let targeted_index = parseInt(e.target.closest('li').getAttribute('data-index'));
                            move_element_in_array(this.working_dialogue, targeted_index, targeted_index - 1);
                            editor.update_working_dialogue_list();
                        });
                        break;
                    case 'down':
                        button.addEventListener('click', e => {
                            let targeted_index = parseInt(e.target.closest('li').getAttribute('data-index'));
                            move_element_in_array(this.working_dialogue, targeted_index, targeted_index + 1);
                            editor.update_working_dialogue_list();
                        });
                        break;
                    case 'x':
                        button.addEventListener('click', e => {
                            let targeted_index = parseInt(e.target.closest('li').getAttribute('data-index'));
                            delete_element_in_array(this.working_dialogue, targeted_index);
                            editor.update_working_dialogue_list();
                        });
                        break;
                    default:
                        break;
                }

                options.appendChild(button);
            });

            li.appendChild(options);
            working_dialogue_list.appendChild(li);
        });
    }

    update_working_pokemon_list() {
        let working_pokemon_list = document.querySelector('.editor.-active .pokemon-editor-list');

        working_pokemon_list.innerHTML = '';
        
        let depth = 0;

        this.working_pokemon.forEach((pokemon, i) => {
            let li = document.createElement('li');
            li.setAttribute('data-index', i);

            if (pokemon.id) {
                li.innerHTML += `${pokemon.id}: Level ${pokemon.level}`;
            }

            // Options
            let options = document.createElement('div');

            let buttons = ['x'];

            buttons.forEach(option => {
                let button = document.createElement('button');
                button.innerText = option;
                button.classList.add(`pokemon-option-${option}`);

                switch (option) {
                    case 'x':
                        button.addEventListener('click', e => {
                            let targeted_index = parseInt(e.target.closest('li').getAttribute('data-index'));
                            delete_element_in_array(this.working_pokemon, targeted_index);
                            editor.update_working_pokemon_list();
                        });
                        break;
                    default:
                        break;
                }

                options.appendChild(button);
            });

            li.appendChild(options);
            working_pokemon_list.appendChild(li);
        });
    }

    clear_working_dialogue() {
        this.working_dialogue = [];
    }

    clear_working_pokemon() {
        this.working_pokemon = [];
    }

    create_new_map(name = "Untitled map", width = "10", height = "10") {
        let new_map = new Kanto_Map(null, name, width, height);
        maps.push(new_map);
        socket.emit('server_create_map', {lobby_id: lobby_id, game_id: game_id, map: new_map});
        player.place(new_map.starting_position.x, new_map.starting_position.y, new_map.id);
        this.update();
    }

    delete_map() {
        if (prompt(`Are you sure you want to delete ${map.name}? Type DELETE to continue:`) == 'DELETE') {
            let deleted_index = 0;

            // Find the index of the map
            maps.forEach((maps_single, i) => {
                if (maps_single.id == map.id) {
                    deleted_index = i;
                }
            });

            // Delete the map out of the maps array
            delete_element_in_array(maps, deleted_index);
            
            /**
             * IDs must be adjusted, along with exits and warp attributes.
             */
            for (let i = 0; i < maps.length; i++) {
                maps[i].id = i;

                maps[i].atts.forEach((att, j) => {
                    switch (att.type) {
                        case 2: // Warp
                        case 4: // Exit

                            // The att's map is a reference to a map greater than the deleted index
                            if (maps[i].atts[j].map > deleted_index) {
                                console.log("Bringing down the index by one:", maps[i].atts[j]);
                                console.log(maps[i].atts[j].map)
                                maps[i].atts[j].map = maps[i].atts[j].map - 1;
                                console.log(maps[i].atts[j].map);
                            } else if (maps[i].atts[j].map == deleted_index) {
                                console.log("Attribute references a deleted map:", maps[i].atts[j]);
                                console.log(maps[i].atts[j]);
                                maps[i].atts[j] = {type: 0};
                                console.log(maps[i].atts[j]);
                            }

                            break;
                        default:
                            break;
                    }
                });
            }
        
            
            player.place(maps[0].starting_position.x, maps[0].starting_position.y, 0);
            map = maps[0];
            map.build();
            this.update();
        }
    }

    log() {
        if (document.querySelector('#coords')) {
            document.querySelector('#coords').innerHTML = `{${player.position.map}, ${player.position.x}, ${player.position.y}}`
        }
    }

    prepare_game_template_list(data) {
        if (document.querySelector('#editor-game-templates')) {
            let game_templates_ul = document.querySelector('#editor-game-templates');
            game_templates_ul.innerHTML = '';

            data.forEach(row => {
                let template_single = document.createElement('li');
                template_single.innerHTML = row.meta.name;
                game_templates_ul.appendChild(template_single);
            });

            if (document.querySelector('#editor-game-templates')) {
                document.querySelectorAll('#editor-game-templates li').forEach(elem => {
                    elem.addEventListener('click', e => {
                        editor.templates.games.forEach(template => {
                            if (template.meta.name == elem.innerHTML) {
                                kanto_switch_game(JSON.stringify(template));
                            }
                        });
                    });
                }); 
            }
        }
    }

    prepare_map_template_list(data) {
        if (document.querySelector('#editor-maps-templates')) {
            let maps_templates_ul = document.querySelector('#editor-maps-templates');
            maps_templates_ul.innerHTML = '';

            data.forEach(row => {
                let template_single = document.createElement('li');
                template_single.innerHTML = row.name;
                maps_templates_ul.appendChild(template_single);
            });

            if (document.querySelector('#editor-maps-templates')) {
                document.querySelectorAll('#editor-maps-templates li').forEach(elem => {
                    elem.addEventListener('click', e => {
                        editor.templates.maps.forEach(template => {
                            if (template.name == elem.innerHTML) {
                                kanto_append_map(JSON.stringify(template));
                            }
                        });
                    });
                }); 
            }
        }
    }

    // saved_games_list() {
    //     if (document.querySelector('#editor-saved-games-list')) {
    //         let saved_games_ul = document.querySelector('#editor-saved-games-list');
    //         saved_games_ul.innerHTML = '';

    //         Object.keys(localStorage).forEach(function(key){
    //             let game_single = document.createElement('li');
    //             game_single.innerHTML = `${key}`;
    //             saved_games_ul.appendChild(game_single);
    //         });


    //         if (document.querySelector('#editor-saved-games-list')) {
    //             document.querySelectorAll('#editor-saved-games-list li').forEach(elem => {
    //                 elem.addEventListener('click', e => {
    //                     kanto_switch_game(elem.innerHTML);
    //                 });
    //             }); 
    //         }
    //     }
    // }
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

function expand_map(direction) {
    if (!direction) {
        return;
    }

    let new_width,
        new_height,
        splice_index;
        
    switch (direction) {
        case 'North':
            new_width = map.width;
            new_height = map.height + 1;
            splice_index = 0;
            break;
        case 'South':
            new_width = map.width;
            new_height = map.height + 1;
            splice_index = new_height - 1;
            break;
        case 'West':
            new_width = map.width + 1;
            new_height = map.height;
            splice_index = 0;
            break;
        case 'East':
            new_width = map.width + 1;
            new_height = map.height;
            splice_index = new_width - 1;
            break;
        default:
            break;
    }

    if (direction == 'North' || direction == 'South') {
        for (let y = 0; y < new_height; y++) {
            for (let x = 0; x < new_width; x++) {
                let index = x + new_width * y;
                
                if (y == splice_index) {
                    map.tiles.splice(index, 0, 0);
                    map.atts.splice(index, 0, {type: 0});
                }
            }
        }
    } else {
        for (let y = 0; y < new_height; y++) {
            for (let x = 0; x < new_width; x++) {
                let index = x + new_width * y;
                
                if (x == splice_index) {
                    map.tiles.splice(index, 0, 0);
                    map.atts.splice(index, 0, {type: 0});
                }
            }
        }
    }

    map.width = new_width;
    map.height = new_height;
    map.build_atts();
    map.build_items();
    maps[map.id] = map;
    editor.update();

    // Adjusting the player's position to work with the new boundaries
    switch (direction) {
        case 'North':
            player.place(player.position.x, player.position.y + 1);
            trainers.forEach(trainer => {
                if (trainer.position.map == player.position.map) {
                    trainer.place(trainer.position.map, trainer.position.x, trainer.position.y + 1);
                }                
            });
            break;
        case 'West':
            player.place(player.position.x + 1, player.position.y);
            trainers.forEach(trainer => {
                if (trainer.position.map == player.position.map) {
                    trainer.place(trainer.position.map, trainer.position.x + 1, trainer.position.y);
                }                
            });
            break;
        default:
            break;
    }
}


function condense_map(direction) {
    if (!direction) {
        return;
    }

    let new_width,
        new_height,
        splice_index;
        
    switch (direction) {
        case 'North':
            new_width = map.width;
            new_height = map.height - 1;
            splice_index = 0;
            break;
        case 'South':
            new_width = map.width;
            new_height = map.height - 1;
            splice_index = new_height + 1;
            break;
        case 'West':
            new_width = map.width - 1;
            new_height = map.height;
            splice_index = 0;
            break;
        case 'East':
            new_width = map.width - 1;
            new_height = map.height;
            splice_index = new_width;
            break;
        default:
            break;
    }

    let offset = 0;

    if (direction == 'North' || direction == 'South') {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let index = x + map.width * y;
                
                if (y == splice_index) {
                    map.tiles.splice(index + offset, 1);
                    map.atts.splice(index + offset, 1);
                    offset--;
                }
            }
        }
    } else {
        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                let index = x + map.width * y;
                
                if (x == splice_index) {
                    map.tiles.splice(index + offset, 1);
                    map.atts.splice(index + offset, 1);
                    offset--;
                }
            }
        }
    }

    map.width = new_width;
    map.height = new_height;
    map.build_atts();
    map.build_items();
    maps[map.id] = map;
    editor.update();

    // Adjusting the player's position to work with the new boundaries
    switch (direction) {
        case 'North':
            player.place(player.position.x, player.position.y - 1);
            trainers.forEach(trainer => {
                if (trainer.position.map == player.position.map) {
                    trainer.place(trainer.position.map, trainer.position.x, trainer.position.y - 1);
                }                
            });
            break;
        case 'West':
            player.place(player.position.x - 1, player.position.y);
            trainers.forEach(trainer => {
                if (trainer.position.map == player.position.map) {
                    trainer.place(trainer.position.map, trainer.position.x - 1, trainer.position.y);
                }                
            });
            break;
        default:
            break;
    }
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


function set_att_editor(type) {
    let att_editor = document.querySelector('#att-editor');
    let display_editor = att_editor.querySelector('.general-editor-display');
    display_editor.innerHTML = '';

    switch (type) {
        case 1:
            display_editor.innerHTML += '<h5>Wall</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="1" disabled></div>';
            break;
        case 2:
            display_editor.innerHTML += '<h5>Warp</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="2" disabled></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Map:</label><input name="map" type="number"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>X:</label><input name="x" type="number"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Y:</label><input name="y" type="number"></div>';
            break;
        case 3:
            display_editor.innerHTML += '<h5>Action</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="3" disabled></div>';
            display_editor.innerHTML += '<ol class="dialogue-editor-list"></ol>';
            display_editor.innerHTML += '<div class="dialogue-editor-options"><button class="dialogue-editor-add">Add to Dialogue</button></div>';
            break;
        case 4:
            display_editor.innerHTML += '<h5>Exit</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="4" disabled></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Map:</label><input name="map" type="number"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>X:</label><input name="x" type="number"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Y:</label><input name="y" type="number"></div>';
            break;
        case 5:
            display_editor.innerHTML += '<h5>NPC</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="5" disabled></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Sprite:</label><input name="sprite" type="number" min="0" value="0"><div class="sprite-preview" style="background-image: url(/assets/graphics/sprites.png)"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Facing:</label><select name="facing"><option>North</option><option>South</option><option>West</option><option>East</option></select></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Movement State:</label><select name="movement_state"><option>Active</option><option>Static</option><option>Frozen</option></select></div>';
            display_editor.innerHTML += '<ol class="dialogue-editor-list"></ol>';
            display_editor.innerHTML += '<div class="dialogue-editor-options"><button class="dialogue-editor-add">Add to Dialogue</button></div>';
            break;
        case 6:
            display_editor.innerHTML += '<h5>NPC Wall</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="6" disabled></div>';
            break;
        case 7:
            display_editor.innerHTML += '<h5>Item</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="7" disabled></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Name:</label><input name="name" type="text"></div>';
            display_editor.innerHTML += '<div class="editor-data-line"><label>Sprite:</label><input name="sprite" type="number" min="0" value="0"><div class="sprite-preview" style="background-image: url(/assets/graphics/items.png)"></div></div>';
            break;
        case 8:
            display_editor.innerHTML += '<h5>Wild Battle</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="8" disabled></div>';
            display_editor.innerHTML += '<ol class="pokemon-editor-list"></ol>';
            display_editor.innerHTML += '<div class="pokemon-editor-options"><button class="pokemon-editor-add">Add Pokemon</button></div>';
            break;
        case 9:
            display_editor.innerHTML += '<h5>Tile Event</h5>';
            display_editor.innerHTML += '<div class="editor-data-line _hidden"><label>Type:</label><input name="type" type="number" value="9" disabled></div>';
            display_editor.innerHTML += '<ol class="dialogue-editor-list"></ol>';
            display_editor.innerHTML += '<div class="dialogue-editor-options"><button class="dialogue-editor-add">Add to Dialogue</button></div>';
            break;
        default:
            break;
    }

    editor_event_listeners();
}

async function kanto_get_game_templates() {
    let res = await fetch(`${window.location.protocol}//${window.location.host}/templates/games`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        },
    });

    let templates = await res.json();
    return templates;
}

async function kanto_get_map_templates() {
    let res = await fetch(`${window.location.protocol}//${window.location.host}/templates/maps`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        },
    });

    let maps = await res.json();
    return maps;
}

function editor_event_listeners() {
    if (document.querySelector('._modal')) {
        document.querySelectorAll('.modal-close').forEach(elem => {
            elem.addEventListener('click', e => {
                e.target.closest('._modal').classList.add('_hidden');
                editor.reset_editors();
            });
        });
    }
    
    if (document.querySelector('.dialogue-editor-add')) {
        document.querySelectorAll('.dialogue-editor-add').forEach(elem => {
            elem.addEventListener('click', e => {
                document.querySelector('#message-editor').classList.remove('_hidden');
            });
        });
    }

    if (document.querySelector('.pokemon-editor-add')) {
        document.querySelectorAll('.pokemon-editor-add').forEach(elem => {
            elem.addEventListener('click', e => {
                document.querySelector('#pokemon-editor').classList.remove('_hidden');
            });
        });
    }

    // Sprite preview
    if (document.querySelector('input[name="sprite"]')) {
        document.querySelectorAll('input[name="sprite"]').forEach(elem => {
            elem.addEventListener('change', e => {
                let offset = e.target.value * -16;
                e.target.nextElementSibling.style.backgroundPositionX = `${offset}px`;
            });
        });
    }
}
