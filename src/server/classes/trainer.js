class Trainer {
    constructor(socket_id = null, name = 'RED', position = {map: 1, x: 5, y: 5}, spritesheet_id = 0) {
        this.socket_id = socket_id;
        this.name = name;
        this.position = position;
        this.spritesheet_id = spritesheet_id;
        this.facing = 'South';
        this.color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    }
}