function create_spritesheet(asset_url) {
    spritesheet = {};

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
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h))
    ];

    spritesheet["walkSouth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 4 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 4 * h, w, h), null, null, 12),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 0, w, h)),
    ];

    spritesheet["walkWest"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 6 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 2 * h, w, h)),
    ];

    spritesheet["walkEast"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 7 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 3 * h, w, h)),
    ];

    spritesheet["walkNorth"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 5 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 5 * h, w, h), null, null, 12),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(0, 1 * h, w, h)),
    ];

    return spritesheet;
}