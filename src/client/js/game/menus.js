class Menu {
    constructor(name, options, sprite, cursor) {
        this.name = name;
        this.options = options;
        this.sprite = sprite;
        this.cursor = cursor;

        this.cursor.initial_position = {
            x: cursor.x,
            y: cursor.y
        }
        
        this.cursor.increment = 15;

        this.max_options = this.options.length - 1;
        this.index = 0;
    }

    move_cursor(direction) {
        if (!player.menu_control_cooldown) {
            switch (direction) {
                case 'North':
                    this.index--;
                    break;
                case 'South':
                    this.index++;
                    break;
                case 'East':
                
                    break;            
                case 'West':
                    
                    break;
                default:
                    break;
            }

            if (this.index < 0) {
                this.index = this.max_options;
            } else if (this.index > this.max_options) {
                this.index = 0;
            }

            this.cursor.y = (this.index * this.cursor.increment) + this.cursor.initial_position.y; 
            player.menu_control_cooldown = true;

            setTimeout(() => {
                player.menu_control_cooldown = false;
            }, 200);
        }
    }

    reset() {
        this.cursor.y = this.cursor.initial_position.y;
        this.index = 0;
    }
}