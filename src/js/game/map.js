
class Kanto_Map {
  /**
   * Map constructor.
   * 
   * @param {string} name The name of the map.
   * @param {number} width The tile width of the map.
   * @param {number} height The tile height of the map.
   * @param {array} tiles The matrix associated with the tile textures.
   * @param {array} atts The matrix associated with map tile att_sprites.
   * @param {array} npcs An array of NPC objects.
   * @param {number} music The ID number of the music to be played.
   * @param {object} starting_position The X and Y starting position of the player.
   */
  constructor(id = null, name = 'Untitled Map', width = 5, height = 5, tiles = [], atts = [], npcs = [], music = false, starting_position = {x: 0, y: 0}) {
    if (id == null) {
      return null;
    }

    this.id = id;
    this.name = name;
    this.x = ((width * TILE_SIZE) / 2) * -1;
    this.y = ((height * TILE_SIZE) / 2) * -1;
    this.height = height;
    this.width = width;

    this.starting_position = starting_position;
    this.tiles = tiles;
    this.atts = atts;
    this.npcs = npcs;
    this.music = music;

    if (this.tiles.length == 0 || !this.tiles) {
      this.generate_tiles();
    }

    if (this.atts.length == 0 || !this.atts) {
      this.generate_atts();
    }
  }

  generate_tiles() {
    this.tiles = [];

    for (let i = 0; i < (this.width * this.height); i++) {
      this.tiles.push(Math.floor(Math.random() * 3) + 1);
    }

    console.log('Generated random map: ', this.tiles);
  }

  generate_atts() {
    this.atts = [];

    for (let i = 0; i < (this.width * this.height); i++) {
      this.atts.push({type: 0});
    }

    console.log('Generated random atts: ', this.atts);
  }

  build_tiles() {
    background.removeChildren();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let index = x + this.width * y;
        let tile = this.tiles[index];
        let sprite = new PIXI.Sprite(tile_textures[tile]);
        sprite.x = x * TILE_SIZE;
        sprite.y = y * TILE_SIZE;
        sprite.game_position = {map: this.id, x: x, y: y, index: index}; 
        background.addChild(sprite);
      }
    }
  }

  build_atts() { // Editor view
    atts_container.removeChildren();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let index = x + this.width * y;
        let att = this.atts[index];
        let sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

        sprite.width = 10;
        sprite.height = 10;
        sprite.x = (x * TILE_SIZE) + 3;
        sprite.y = (y * TILE_SIZE) + 3;

        switch (att.type) {
          case 1:
            sprite.tint = '0xFF0000';
            break;
          case 2: 
            sprite.tint = '0x0000FF';
            break;
          case 3: 
            sprite.tint = '0x00FF00';
            break;
          case 4: 
            sprite.tint = '0xFFA500';
            break;
          default:
            sprite.tint = '0xEEEEEE';
            sprite.alpha = 0;
            break;
        }

        atts_container.addChild(sprite);
      }
    }
  }

  build() {
    this.build_tiles();
    this.build_atts();
    
    if (music) {
      music.play(this.music);
    }

    player.place(this.starting_position.x, this.starting_position.y, this.id);
  }
}

function check_sprite_tile_actions(tile) {
  console.log('check_sprite_tile_actions:', tile);

  switch (tile) {
    case 448:
      dialogue.add_message('A TOWN MAP.');
      break;
    case 975:
    case 976:
      dialogue.add_message('Crammed full of POKéMON books!');
      break;
    default:
      break;
  }
}