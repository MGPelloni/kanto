class Menu {
    constructor(name, options = [], dimensions = {x:0, y:0, width:50, height:50}) {
        this.name = name;
        this.options = options;
        this.dimensions = dimensions;

        this.dimensions.menu_margin = 17;
        this.dimensions.option_margin = 15;
        this.scroll = false;
        
        this.create_sprite();
        this.create_cursor();
        this.set_properties();
    }

    set_properties() {
        this.max_options = this.options.length - 1;
    }

    create_cursor() {       
        this.cursor = {
            initial_position: {
                x: this.dimensions.x + 8,
                y: this.dimensions.y + this.dimensions.menu_margin
            },
            position: 0,
            increment: 15,
            index: 0,
            sprite: null,
        }

        this.cursor.sprite = new PIXI.Graphics();
        this.cursor.sprite.beginFill(0x000000);
        this.cursor.sprite.moveTo(0, 0);
        this.cursor.sprite.lineTo(4, 4);
        this.cursor.sprite.lineTo(0, 9);
        this.cursor.sprite.endFill();
        this.cursor.sprite.x = this.cursor.initial_position.x;
        this.cursor.sprite.y = this.cursor.initial_position.y;

        this.sprite.addChild(this.cursor.sprite);
    }

    create_sprite() {
        let menu_sprite_container = new PIXI.Container();
        menu_sprite_container.visible = false;

        let menu_bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        
        // Start Menu
        menu_bg.width = this.dimensions.width;
        menu_bg.height = this.dimensions.height;
        menu_bg.x = this.dimensions.x;
        menu_bg.y = this.dimensions.y;

        // Add menu to menu container
        menu_sprite_container.addChild(menu_bg);

        // Menu items
        this.options.forEach((elem, i) => {
            this.options[i].menu_text = new PIXI.Text(elem.name, {fontFamily: 'pokemon_gbregular', fontSize: 8, fill : 0x000000, align : 'left'});
            this.options[i].menu_text.x = menu_bg.x + 16;
            this.options[i].menu_text.y = menu_bg.y + (this.dimensions.option_margin * i) + this.dimensions.menu_margin;
            this.options[i].menu_text.resolution = 4;
            menu_sprite_container.addChild(this.options[i].menu_text);
        });

        // Calculate amount of visible possible options and add that data to object
        this.dimensions.visible_options = Math.ceil((this.dimensions.height - (this.dimensions.menu_margin * 2)) / 15);
        
        // Set menu to scroll if there are more options than can be displayed
        if (this.options.length > this.dimensions.visible_options) {
            this.scroll = true;
        }

        // Enable scrolling
        if (this.scroll) {
            this.options.forEach((option, i) => {
                if (i >= this.dimensions.visible_options) {
                    this.options[i].menu_text.visible = false;
                }
            }); 
        }
        
        this.sprite = menu_sprite_container;
        menu_container.addChild(this.sprite);
    }

    update_options(new_options) {
        this.options = new_options;
        
        this.create_sprite();
        this.create_cursor();
        this.set_properties();
    }

    move_cursor(direction) {
        if (!player.menu.cooldown) {
            switch (direction) {
                case 'North':
                    this.cursor.index--;
                    this.cursor.position--;
                    break;
                case 'South':
                    this.cursor.index++;
                    this.cursor.position++;
                    break;
                case 'East':
                    break;            
                case 'West':
                    break;
                default:
                    break;
            }
            
            let bounds_hit = {
                top: false,
                bottom: false
            }

            // Loop index around
            if (this.cursor.index < 0) {
                this.cursor.index = this.max_options;
                this.cursor.position = this.dimensions.visible_options;
            } else if (this.cursor.index > this.max_options) { // Reached the bottom of the menu
                this.reset();
            }

            // Hold scroll positioning within position property separate from index
            if (this.scroll) {
                if (this.cursor.position < 0) { // Reached the top of the menu
                    this.cursor.position = 0;
                    bounds_hit.top = true;
                }

                if (this.cursor.position >= this.dimensions.visible_options - 1) { // Reached the bottom of the menu
                    this.cursor.position = this.dimensions.visible_options - 1;
                    bounds_hit.bottom = true;
                }

                // Set cursor position
                this.cursor.sprite.y = (this.cursor.position * this.cursor.increment) + this.cursor.initial_position.y; 
            } else {
                this.cursor.sprite.y = (this.cursor.index * this.cursor.increment) + this.cursor.initial_position.y; 
            }

            // Do not allow cursor's sprite to go below the bottom of the menu
            if (this.cursor.sprite.y > ((this.dimensions.visible_options - 1) * this.cursor.increment) + this.cursor.initial_position.y) {
                this.cursor.sprite.y = ((this.dimensions.visible_options - 1) * this.cursor.increment) + this.cursor.initial_position.y;
            }

            // Scroll menu if cursor's sprite is at the top
            if (bounds_hit.top) { // We've hit the top
                // Find the visible option indexes
                let visible_options = [];

                for (let i = this.cursor.index; i <= this.cursor.index + (this.dimensions.visible_options - 1); i++) {
                    visible_options.push(i);
                }   

                // Hide all options
                this.options.forEach((option, i) => {
                    this.options[i].menu_text.visible = false;
                });

                // Show only the visible options and adjust their sprite positions
                visible_options.forEach((option, i) => {
                    this.options[option].menu_text.visible = true;
                    this.options[option].menu_text.y = this.dimensions.y + (this.dimensions.option_margin * i) + this.dimensions.menu_margin;
                });
            }

            // Scroll menu if cursor's sprite is at the bottom
            if (bounds_hit.bottom) { // We've hit the bottom
                // Find the visible option indexes
                let visible_options = [];

                for (let i = this.cursor.index - (this.dimensions.visible_options - 1); i <= this.cursor.index; i++) {
                    visible_options.push(i);
                }

                // Hide all options
                this.options.forEach((option, i) => {
                    this.options[i].menu_text.visible = false;
                });

                // Show only the visible options and adjust their sprite positions
                visible_options.forEach((option, i) => {
                    this.options[option].menu_text.visible = true;
                    this.options[option].menu_text.y = this.dimensions.y + (this.dimensions.option_margin * i) + this.dimensions.menu_margin;
                });
            }

            player.menu.cooldown = true;

            setTimeout(() => {
                player.menu.cooldown = false;
            }, 200);
        }
    }

    reset() {
        this.cursor.sprite.y = this.cursor.initial_position.y;
        this.cursor.index = 0;
        this.cursor.position = 0;

        this.options.forEach((elem, i) => {
            this.options[i].menu_text.x = this.dimensions.x + 16;
            this.options[i].menu_text.y = this.dimensions.y + (this.dimensions.option_margin * i) + this.dimensions.menu_margin;
            this.options[i].menu_text.visible = true;
        });
        
        // Hideitems below the visible options
        if (this.scroll) {
            this.options.forEach((option, i) => {
                if (i >= this.dimensions.visible_options) {
                    this.options[i].menu_text.visible = false;
                }
            }); 
        }
    }

    open() {
        this.reset();
        this.sprite.visible = true;
    }

    close() {
        this.sprite.visible = false;
        player.menu.history.pop();

        if (player.menu.history.length > 0) {
            player.menu.current = player.menu.history[player.menu.history.length - 1];
        } else {
            player.controls = 'walking';
            player.menu.active = false;
            menu_container.visible = false;
        }
    }
}

function kanto_get_menu(menu_name) {
    let found_menu = false;

    menus.forEach(menu => {
        if (menu.name == menu_name) {
            found_menu = menu;
        }
    });

    return found_menu;
}

function kanto_update_menus() {
    let items_menu = kanto_get_menu('Items');
    let item_options = [];

    player.items.forEach(item => {
        item_options.push({
            name: item.name,
            type: 'Item',
        })
    });

    item_options.push(
        {
            name: 'CANCEL',
            type: 'menu',
            callback: () => {
                menus[player.menu.current].close();
            }
        }
    )

    items_menu.update_options(item_options);
}

function kanto_close_menus() {
    menus.forEach(menu => {
        menu.close();
    });
}