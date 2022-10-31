class Item {
    constructor(name = 'Untitled Item', type = 'Special') {
        this.name = name;
        this.type = type;
    }

    use() {
        console.log(`Using ${this.name}`);

        switch (this.name) {
            case 'BICYCLE':
            case 'BIKE':
                if (player.speed == 1) {
                    player.history.spritesheet_id = player.spritesheet_id;
                    player.change_spritesheet(4);
                    player.speed = 2;

                    if (this.name != 'BIKE') {
                        music.immediate_play(32);
                    }
                } else {
                    if (player.history.spritesheet_id) {
                        player.change_spritesheet(player.history.spritesheet_id);
                    } else {
                        player.change_spritesheet(0);
                    }
                    
                    player.speed = 1;

                    if (this.name != 'BIKE') {
                        music.immediate_play(map.music);
                    }
                }

                multiplayer_update_speed();
                kanto_close_menus();
                break;
            default:
                dialogue.queue_messages(["OAK: This isn't the time to use this!"]);
                break;
        }
    }
}