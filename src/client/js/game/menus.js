class Menu {
    constructor(name, options = [], dimensions = {x:0, y:0, width:50, height:50}) {
        this.name = name;
        this.options = options;
        this.dimensions = dimensions;

        this.dimensions.menu_margin = 17;
        this.dimensions.option_margin = 15;
        
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
            let menu_text = new PIXI.Text(elem.name, {fontFamily: 'pokemon_gbregular', fontSize: 8, fill : 0x000000, align : 'left'});
            menu_text.x = menu_bg.x + 16;
            menu_text.y = menu_bg.y + (this.dimensions.option_margin * i) + this.dimensions.menu_margin;
            menu_text.resolution = 4;
            menu_sprite_container.addChild(menu_text);
        });
        
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
                    break;
                case 'South':
                    this.cursor.index++;
                    break;
                case 'East':
                
                    break;            
                case 'West':
                    
                    break;
                default:
                    break;
            }

            if (this.cursor.index < 0) {
                this.cursor.index = this.max_options;
            } else if (this.cursor.index > this.max_options) {
                this.cursor.index = 0;
            }

            this.cursor.sprite.y = (this.cursor.index * this.cursor.increment) + this.cursor.initial_position.y; 
            player.menu.cooldown = true;

            setTimeout(() => {
                player.menu.cooldown = false;
            }, 200);
        }
    }

    reset() {
        this.cursor.sprite.y = this.cursor.initial_position.y;
        this.cursor.index = 0;
    }

    open() {
        this.reset();
        this.sprite.visible = true;
    }

    close() {
        this.sprite.visible = false;
        player.menu.history.pop();
        console.log(player.menu.history);

        if (player.menu.history.length > 0) {
            console.log(player.menu.history[player.menu.history.length - 1]);
            player.menu.current = player.menu.history[player.menu.history.length - 1];
        } else {
            player.controls = 'walking';
        }
    }
}

function kanto_get_menu(menu_name) {
    let found_menu = false;

    menus.forEach(menu => {
        console.log(menu.name, menu_name);
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

    items_menu.update_options(item_options);
}