class Renderer {
    constructor() {
        this.tilemap = PIXI.BaseTexture.from(app.loader.resources['tilemap'].url);
        this.tileSize = TILE_SIZE;
        this.viewport = 6;
        this.pool = new SpritePool();
    }
    
    render() {
        const currentMap = maps.find(m => m.id === player.position.map);
        if (!currentMap) return;
        
        const px = player.position.x;
        const py = player.position.y;
        
        const startX = Math.max(0, px - this.viewport);
        const startY = Math.max(0, py - this.viewport);
        const endX = Math.min(currentMap.width, px + this.viewport + 1);
        const endY = Math.min(currentMap.height, py + this.viewport + 1);
        
        this.pool.releaseAll();
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const index = y * currentMap.width + x;
                const tileId = currentMap.tiles[index];
                if (tileId == null) continue;
                
                const sprite = this.pool.get(`tile_${tileId}`, () => getSpriteForTile(tileId, this.tilemap));
                sprite.x = x * this.tileSize;
                sprite.y = y * this.tileSize;
                sprite.game_position = { map: currentMap.id, x, y, index };
                
                background.addChild(sprite);
            }
        }
    }
}


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
    
    empty() {
        this.pool = [];
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