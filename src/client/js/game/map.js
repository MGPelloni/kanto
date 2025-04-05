class Kanto_Map {
  constructor(id = null, name = 'Untitled Map', width = 5, height = 5, tiles = [], atts = [], music = 0, starting_position = {x: 0, y: 0}) {
    if (id == null) id = maps.length;

    this.id = id;
    this.name = name;
    this.x = ((width * TILE_SIZE) / 2) * -1;
    this.y = ((height * TILE_SIZE) / 2) * -1;
    this.height = height;
    this.width = width;

    this.starting_position = starting_position;
    this.tiles = tiles.length ? tiles : this.generate_tiles();
    this.atts = atts.length ? atts : this.generate_atts();
    this.music = music;
    this.items = [];
  }

  generate_tiles() {
    return Array.from({length: this.width * this.height}, () => Math.floor(Math.random() * 3) + 1);
  }

  generate_atts() {
    return Array.from({length: this.width * this.height}, () => ({type: 0}));
  }

  build_items() {
    this.items = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let index = x + this.width * y;
        
        if (this.atts[index].type == 7) {
          let item = {
            name: this.atts[index].name,
            sprite: new PIXI.Sprite.from(item_sprites[(this.atts[index].sprite)]),
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
          case 8:
            sprite.tint = '0x35530A';
            break;
          case 9:
            sprite.tint = '0x561D5E';
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
    socket.emit('map_server_sync', {lobby_id: lobby_id, map: this.id});
  }

  build() {
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