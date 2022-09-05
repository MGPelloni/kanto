function create_spritesheet(asset_url) {
    let spritesheet = {};
    let ssheet = new PIXI.BaseTexture.from(asset_url);
    let w = TILE_SIZE;
    let h = TILE_SIZE;

    spritesheet["standSouth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h))
    ];

    spritesheet["standNorth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h))
    ];

    spritesheet["standWest"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h))
    ];

    spritesheet["standEast"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h), null, null, 12),
    ];

    spritesheet["walkSouth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h), null, null, 12),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
    ];

    spritesheet["walkWest"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 5 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h)),
    ];

    spritesheet["walkEast"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 5 * h, w, h), null, null, 12),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h), null, null, 12),
    ];

    spritesheet["walkNorth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 4 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 4 * h, w, h), null, null, 12),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h)),
    ];

    return spritesheet;
}

function create_flower_top_spritesheet() {
    let tilemap = new PIXI.BaseTexture.from(app.loader.resources['tilemap'].url);
    let w = TILE_SIZE;
    let h = TILE_SIZE;

    let animation = [
        new PIXI.Texture(tilemap, new PIXI.Rectangle(0, 76 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 76 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(8 * w, 2 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(0, 76 * h, w, h)),
    ];

    return animation;
}

function create_flower_bottom_spritesheet() {
    let tilemap = new PIXI.BaseTexture.from(app.loader.resources['tilemap'].url);
    let w = TILE_SIZE;
    let h = TILE_SIZE;

    let animation = [
        new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 76 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 76 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(8 * w, 1 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 76 * h, w, h)),
    ];

    return animation;
}

function create_water_spritesheet() {
    let tilemap = new PIXI.BaseTexture.from(app.loader.resources['tilemap'].url);
    let w = TILE_SIZE;
    let h = TILE_SIZE;

    let animation = [
        new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 7 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(0, 77 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 77 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 77 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 77 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 77 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 77 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(0, 77 * h, w, h)),
    ];

    return animation;
}


function create_water_top_spritesheet() {
    let tilemap = new PIXI.BaseTexture.from(app.loader.resources['tilemap'].url);
    let w = TILE_SIZE;
    let h = TILE_SIZE;

    let animation = [
        new PIXI.Texture(tilemap, new PIXI.Rectangle(4 * w, 8 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(0, 78 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 78 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 78 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(3 * w, 78 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(2 * w, 78 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(1 * w, 78 * h, w, h)),
        new PIXI.Texture(tilemap, new PIXI.Rectangle(0, 78 * h, w, h)),
    ];

    return animation;
}