class Menu {
    constructor(name, options = [], dimensions = {x:0, y:0, width:50, height:50}) {
        this.name = name;
        this.options = options;
        this.dimensions = dimensions;
        
        // Sprite
        this.sprite = this.create_sprite();
        menu_container.addChild(this.sprite);

        // Cursor
        this.cursor.initial_position = {
            x: this.cursor.x,
            y: this.cursor.y
        }
        
        this.cursor.increment = 15;
        this.cursor.index = 0; // Cursor index

        this.max_options = this.options.length - 1;
    }

    create_sprite() {
        let menu_sprite_container = new PIXI.Container();
        menu_sprite_container.visible = false;

        let menu_bg = new PIXI.Sprite(PIXI.Texture.WHITE),
            menu_margin = 17, // Starting margin for top of menu options
            menu_option_margin = 15; // Each menu option margin
        
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
            menu_text.y = menu_bg.y + (menu_option_margin * i) + menu_margin;
            menu_text.resolution = 4;
            menu_sprite_container.addChild(menu_text);
        });
        
        // create a new graphics object
        this.cursor = new PIXI.Graphics();
        this.cursor.beginFill(0x000000);
        this.cursor.moveTo(0, 0);
        this.cursor.lineTo(4, 4);
        this.cursor.lineTo(0, 9);
        this.cursor.endFill();

        this.cursor.x = menu_bg.x + 8;
        this.cursor.y = menu_bg.y + menu_margin;

        menu_sprite_container.addChild(this.cursor);
        return menu_sprite_container;
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

            this.cursor.y = (this.cursor.index * this.cursor.increment) + this.cursor.initial_position.y; 
            player.menu.cooldown = true;

            setTimeout(() => {
                player.menu.cooldown = false;
            }, 200);
        }
    }

    reset() {
        this.cursor.y = this.cursor.initial_position.y;
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