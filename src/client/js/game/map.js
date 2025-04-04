class SpritePool {
  constructor() {
    this.pool = [];
  }

  get(type, factoryFn) {
    let sprite = this.pool.find(s => !s.inUse && s.poolType === type);
    if (!sprite) {
      sprite = factoryFn();
      sprite.poolType = type;
      this.pool.push(sprite);
    }
    sprite.inUse = true;
    sprite.visible = true;
    return sprite;
  }

  releaseAll() {
    for (const sprite of this.pool) {
      sprite.inUse = false;
      sprite.visible = false;
    }
  }

  updateAnimationFrames(frame) {
    for (const sprite of this.pool) {
      if (sprite instanceof PIXI.AnimatedSprite && sprite.inUse) {
        sprite.gotoAndStop(frame);
      }
    }
  }
}

const tileSpritePool = new SpritePool();

function getSpriteForTile(tile, tilemap) {
  const w = TILE_SIZE, h = TILE_SIZE;
  const key = `tile_${tile}`;

  return tileSpritePool.get(key, () => {
    if (tile === 38) return createSyncedAnim(create_flower_top_spritesheet());
    if (tile === 23) return createSyncedAnim(create_flower_bottom_spritesheet());

    if (tile === 109) {
      const frames = [0,1,2,3,4,3,2,1].map(i => new PIXI.Texture(tilemap, new PIXI.Rectangle(i * w, 77 * h, w, h)));
      return createSyncedAnim(frames);
    }

    if (tile === 124) {
      const frames = [0,1,2,3,4,3,2,1].map(i => new PIXI.Texture(tilemap, new PIXI.Rectangle(i * w, 78 * h, w, h)));
      return createSyncedAnim(frames);
    }

    if (tile === 95) {
      const frames = [0,1,2,3,4,3,2,1].map(i => new PIXI.Texture(tilemap, new PIXI.Rectangle(i * w, 79 * h, w, h)));
      return createSyncedAnim(frames);
    }

    if (tile === 110) {
      const frames = [0,1,2,3,4,3,2,1].map(i => new PIXI.Texture(tilemap, new PIXI.Rectangle(i * w, 80 * h, w, h)));
      return createSyncedAnim(frames);
    }

    if (tile === 125) {
      const frames = [0,1,2,3,4,3,2,1].map(i => new PIXI.Texture(tilemap, new PIXI.Rectangle(i * w, 81 * h, w, h)));
      return createSyncedAnim(frames);
    }

    if (tile === 93) {
      const frames = [0,1,2,3,4,3,2,1].map(i => new PIXI.Texture(tilemap, new PIXI.Rectangle(i * w, 82 * h, w, h)));
      return createSyncedAnim(frames);
    }

    if (tile === 108) {
      const frames = [0,1,2,3,4,3,2,1].map(i => new PIXI.Texture(tilemap, new PIXI.Rectangle(i * w, 83 * h, w, h)));
      return createSyncedAnim(frames);
    }

    if (tile === 123) {
      const frames = [0,1,2,3,4,3,2,1].map(i => new PIXI.Texture(tilemap, new PIXI.Rectangle(i * w, 84 * h, w, h)));
      return createSyncedAnim(frames);
    }

    return new PIXI.Sprite(tile_textures[tile]);
  });
}

function createSyncedAnim(frames) {
  const sprite = new PIXI.AnimatedSprite(frames);
  sprite.animationSpeed = 0;
  sprite.gotoAndStop(global_animation_frame);
  return sprite;
}

let animationCounter = 0;
let global_animation_frame = 0;
const ANIM_FRAME_INTERVAL = 20; // higher = slower (e.g. 8 = ~7.5 FPS)

app.ticker.add(() => {
  animationCounter++;
  if (animationCounter % ANIM_FRAME_INTERVAL === 0) {
    global_animation_frame = (global_animation_frame + 1) % 8; // assuming 8-frame loop
    tileSpritePool.updateAnimationFrames(global_animation_frame);
  }
});


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
  render_tiles() {
    const tilemap = PIXI.BaseTexture.from(app.loader.resources['tilemap'].url);
    const viewport = 6;
    const player_x = player.position.x;
    const player_y = player.position.y;
  
    const start_x = Math.max(0, Math.floor(player_x - viewport));
    const start_y = Math.max(0, Math.floor(player_y - viewport));
    const end_x = Math.min(this.width, Math.floor(player_x + viewport)) + 1;
    const end_y = Math.min(this.height, Math.floor(player_y + viewport)) + 1;
  
    tileSpritePool.releaseAll();
  
    // Clear just tile sprites, not entire background container (preserve persistent children if any)
    for (let i = background.children.length - 1; i >= 0; i--) {
      const sprite = background.children[i];
      if (sprite.game_position && sprite.game_position.map === this.id) {
        background.removeChild(sprite);
      }
    }
  
    for (let y = start_y; y < end_y; y++) {
      for (let x = start_x; x < end_x; x++) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;
  
        const index = x + this.width * y;
        if (index < 0 || index >= this.tiles.length) continue;
  
        const tile = this.tiles[index];
        const sprite = getSpriteForTile(tile, tilemap);
  
        sprite.x = x * TILE_SIZE;
        sprite.y = y * TILE_SIZE;
        sprite.game_position = { map: this.id, x, y, index };
  
        background.addChild(sprite);
      }
    }

    // Items
    for (const item of this.items) {
      if (item.position.map === this.id) {
        const { x, y } = item.position;
        if (x >= start_x && x < end_x && y >= start_y && y < end_y) { // Check if item is in viewport
          item.sprite.x = x * TILE_SIZE;
          item.sprite.y = y * TILE_SIZE;
          background.addChild(item.sprite);
        }
      }
    }
  }
  server_sync() {
    socket.emit('map_server_sync', {lobby_id: lobby_id, map: this.id});
  }

  build() {
    this.render_tiles();
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
    this.render_tiles();
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