
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
  constructor(id = null, name = 'Untitled Map', width = 5, height = 5, tiles = [], atts = [], music = 0, starting_position = {x: 0, y: 0}) {
    if (id == null) {
      id = maps.length;
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
    this.music = music;
    this.items = [];

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

  build_items() {
    this.items = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let index = x + this.width * y;
        
        if (this.atts[index].type == 7) {
          let item = {
            name: this.atts[index].name,
            sprite: new PIXI.Sprite.from(item_sprites[(this.atts[index].sprite - 1)]),
            position: {map: this.id, x: x, y: y, index: index},
            available: true
          }

          item.sprite.game_position = {map: this.id, x: x, y: y, index: index};
          item.sprite.x = x * TILE_SIZE;
          item.sprite.y = y * TILE_SIZE;

          this.items.push(item);
          background.addChild(item.sprite);
        }
      }
    }
  }

  build_tiles() {
    background.removeChildren();
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let index = x + this.width * y;
        let tile = this.tiles[index];
        let sprite;

        let tilemap = new PIXI.BaseTexture.from(app.loader.resources['tilemap'].url);
        let w = TILE_SIZE;
        let h = TILE_SIZE;
        let spritesheet = null;

        switch (tile) {
          case 38: // Top Flower
            sprite = new PIXI.AnimatedSprite(create_flower_top_spritesheet());
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 23: // Bottom Flower
            sprite = new PIXI.AnimatedSprite(create_flower_bottom_spritesheet());
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 109: // Water
            spritesheet = [
              new PIXI.Texture(tilemap, new PIXI.Rectangle(0 * w, 77 * h, w, h)),
              new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 77 * h, w, h)),
              new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 77 * h, w, h)),
              new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 77 * h, w, h)),
              new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 77 * h, w, h)),
              new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 77 * h, w, h)),
              new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 77 * h, w, h)),
              new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 77 * h, w, h)),
            ];

            sprite = new PIXI.AnimatedSprite(spritesheet);
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 124: // Water [Top]
            spritesheet = [
                new PIXI.Texture(tilemap, new PIXI.Rectangle(0 * w, 78 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 78 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 78 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 78 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 78 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 78 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 78 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 78 * h, w, h)),
            ];

            sprite = new PIXI.AnimatedSprite(spritesheet);
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 95: // Water [Top Left]
            spritesheet = [
                new PIXI.Texture(tilemap, new PIXI.Rectangle(0 * w, 79 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 79 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 79 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 79 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 79 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 79 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 79 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 79 * h, w, h)),
            ];

            sprite = new PIXI.AnimatedSprite(spritesheet);
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 110: // Water [Left]
            spritesheet = [
                new PIXI.Texture(tilemap, new PIXI.Rectangle(0 * w, 80 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 80 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 80 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 80 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 80 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 80 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 80 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 80 * h, w, h)),
            ];

            sprite = new PIXI.AnimatedSprite(spritesheet);
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 125: // Water [Bottom Left]
            spritesheet = [
                new PIXI.Texture(tilemap, new PIXI.Rectangle(0 * w, 81 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 81 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 81 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 81 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 81 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 81 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 81 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 81 * h, w, h)),
            ];

            sprite = new PIXI.AnimatedSprite(spritesheet);
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 93: // Water [Top Right Border]
            spritesheet = [
                new PIXI.Texture(tilemap, new PIXI.Rectangle(0 * w, 82 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 82 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 82 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 82 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 82 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 82 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 82 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 82 * h, w, h)),
            ];

            sprite = new PIXI.AnimatedSprite(spritesheet);
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 108: // Water [Right Border]
            spritesheet = [
                new PIXI.Texture(tilemap, new PIXI.Rectangle(0 * w, 83 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 83 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 83 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 83 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 83 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 83 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 83 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 83 * h, w, h)),
            ];


            sprite = new PIXI.AnimatedSprite(spritesheet);
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          case 123: // Water [Corner Right Border]
            spritesheet = [
                new PIXI.Texture(tilemap, new PIXI.Rectangle(0 * w, 84 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 84 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 84 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 84 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 84 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 84 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 84 * h, w, h)),
                new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 84 * h, w, h)),
            ];


            sprite = new PIXI.AnimatedSprite(spritesheet);
            sprite.animationSpeed = 0.05;
            sprite.play();
            break;
          default: // Non-animated
            sprite = new PIXI.Sprite(tile_textures[tile]);
            break;
        }

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
          case 5: 
            sprite.tint = '0x000000';
            sprite.alpha = 0.5;
            break;
          case 6: 
            sprite.tint = '0xFFD5D5';
            break;
          case 7: 
            sprite.tint = '0xDAA520';
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

  build_npcs() { // Editor view
    // Remove intervals
    npcs.forEach(npc => {
      clearInterval(npc.wander_interval);
    });

    npcs = []; // clear array
    npc_container.removeChildren();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let index = x + this.width * y;
        let att = this.atts[index];
        
        switch (att.type) {
          case 5: 
            let npc = new Npc({map: this.id, x: x, y: y}, att.sprite, att.dialogue, att.facing, att.movement_state, npcs.length); // npc.js
            npcs.push(npc);
            break;
          default:
            break;
        }
      }
    }
  }

  server_sync() {
    socket.emit('map_server_sync', {lobby_id: GAME_ID, map: this.id});
  }

  build() {
    this.build_tiles();
    this.build_npcs();
    this.build_atts();
    this.build_items();
    this.server_sync();
    
    if (music) {
      music.play(this.music);
    }

    player.place(this.starting_position.x, this.starting_position.y, this.id);
  }

  refresh() {
    this.build_tiles();
    this.build_npcs();
    this.build_atts();
    this.build_items(); 
    this.server_sync();
  }
}

function check_sprite_tile_actions(tile) {
  switch (tile) {
    case 448:
      dialogue.add_message('A TOWN MAP.');
      break;
    case 975:
    case 976:
      dialogue.add_message('Crammed full of POKéMON books!');
      break;
    case 819:
    case 820:
      dialogue.add_message('Wow! Tons of POKéMON stuff!');
      break;
    case 808:
    case 977:
      sfx.play('turn-on-pc');

      dialogue.queue_messages(["RED turned on the PC.", "...", "It doesn't seem to be working.."]);
      break;
    default:
      break;
  }
}