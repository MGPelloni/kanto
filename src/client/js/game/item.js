class Item {
    constructor(name = 'Untitled Item', type = 'Special') {
        this.name = name;
        this.type = type;
    }

    use() {
        console.log(`Using ${this.name}`);

        switch (this.name) {
            case 'BICYCLE':
                player.change_spritesheet(5);
                player.speed = 2;
                music.immediate_play(33);

                menus.forEach(menu => {
                    menu.close();
                });
                break;
        
            default:
                break;
        }
    }
}

function use_item() {

}