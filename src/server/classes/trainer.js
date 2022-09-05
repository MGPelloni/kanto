class Trainer {
    constructor(socket_id = null, position = {map: 1, x: 5, y: 5}, spritesheet_id = 0) {
        this.socket_id = socket_id;
        this.position = position;
        this.spritesheet_id = spritesheet_id;
        this.facing = 'South';
    }
}