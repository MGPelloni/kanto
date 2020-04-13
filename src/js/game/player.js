
function createPlayer(x, y) {
    player = new PIXI.AnimatedSprite(playerSheet.standSouth);
    player.anchor.set(0.5);
    player.animationSpeed = 0.125;
    player.loop = false;
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;
    player.width = TILE_SIZE;
    player.height = TILE_SIZE;
    player.game_pos = {
        x: 0,
        y: 0,
    }

    player.place = (x, y) => {
        background.x = background.x + ((x * TILE_SIZE) * -1);
        background.y = background.y + ((y * TILE_SIZE) * -1);
        player.game_pos.x = x;
        player.game_pos.y = y;
    };

    player.check_action = (direction) => {
        switch (direction) {
            case 'North':
                player.current_map.action(player.game_pos.x, player.game_pos.y - 1);
                break;
            case 'South':
                player.current_map.action(player.game_pos.x, player.game_pos.y + 1);
                break;
            case 'West':
                player.current_map.action(player.game_pos.x - 1, player.game_pos.y);
                break;
            case 'East':
                player.current_map.action(player.game_pos.x + 1, player.game_pos.y);
                break;
            default:
                break;
        }
    };

    player.facing = 'South';
    player.can_check_action = true;

    app.stage.addChild(player);

    player.play();

    
    player.moving = false;
    player.current_move_ticker = 0;
    player.can_move = true;
}



function create_player_sheet() {
    let ssheet = new PIXI.BaseTexture.from(app.loader.resources['red'].url);
    let w = TILE_SIZE;
    let h = TILE_SIZE;

    playerSheet["standSouth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h))
    ];

    playerSheet["standNorth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h))
    ];

    playerSheet["standWest"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h))
    ];

    playerSheet["standEast"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h))
    ];

    playerSheet["walkSouth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 4 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 4 * h, w, h), null, null, 12),
    ];

    playerSheet["walkWest"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 6 * h, w, h)),
    ];

    playerSheet["walkEast"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 7 * h, w, h)),
    ];

    playerSheet["walkNorth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 5 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 5 * h, w, h), null, null, 12),
    ];
}
