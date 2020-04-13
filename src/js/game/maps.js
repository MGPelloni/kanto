class Map {
    constructor(name = 'Untitled Map', width = 5, height = 5, tiles = [], atts = []) {
      this.name = name;
      this.x = ((width * TILE_SIZE) / 2) * -1;
      this.y = ((height * TILE_SIZE) / 2) * -1;
      this.height = height;
      this.width = width;
      this.tiles = tiles;
      this.atts = atts;

      if (this.tiles.length == 0) {
        this.generate_map();
      }
    }

    generate_map() {
      this.tiles = [];

      for (let i = 0; i < (this.width * this.height); i++) {
        this.tiles.push(Math.floor(Math.random() * 3) + 1);
      }

      console.log('Generated random map: ', this.tiles);
    }

    build() {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          let tile = this.tiles[x + this.width * y];
          let sprite = new PIXI.Sprite(tile_textures[tile]);
          sprite.x = x * TILE_SIZE;
          sprite.y = y * TILE_SIZE;
          background.addChild(sprite);
        }
      }
    }

    action(x, y) {
      if (x == 3 && y == 5) {
        game_chat('RED\'s house');
      }

      if (x == 11 && y == 5) {
        game_chat('BLUE\'s house');
      }

      if (x == 7 && y == 9) {
        game_chat('PALLET TOWN<br>Shades of your journey await!');
      }

      if (x == 13 && y == 13) {
        game_chat('OAK POKéMON RESEARCH LAB');
      }
    }
}