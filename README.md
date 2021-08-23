# Kanto

## Built With

* [PIXI.js](https://www.pixijs.com/) - 2D WebGL Renderer
* [NPM](https://www.npmjs.com/get-npm) - Package Manager
* [Gulp.js](https://gulpjs.com/) - Workflow Automation

## Data Structure

A "game" is a JSON structured file:

```

meta: {
    name: "",
    game_id: "",
}
player: {
    sprite: #,
    pokemon: [{}, {}, {}],
    inventory: [#, #, #],
},
maps: [{
    name: "",
    height: #,
    width: #,
    starting_position: {
        x: #,
        y: #
    },
    tiles: [#, #, #],
    atts: [{}, {}, {}],
    music: #,
}, {}, {}],
```

Example:

```
{"meta":{"name":"Pokemart","game_id":"C8Dbec2Rf-c"},"player":{"sprite":0,"pokemon":[],"inventory":[]},"maps":[{"name":"Pokemart","height":8,"width":8,"starting_position":{"x":3,"y":7},"tiles":[763,763,803,803,803,803,763,763,778,778,818,818,818,818,778,778,772,771,771,771,771,771,771,771,806,807,771,771,804,805,804,805,756,777,771,771,819,820,819,820,772,793,771,771,771,771,771,771,834,865,771,771,771,771,771,771,772,771,771,511,511,771,771,771],"atts":[{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":1},{"type":1},{"type":1},{"type":1},{"type":1},{"type":1},{"type":1},{"type":1},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":1},{"type":1},{"type":0},{"type":0},{"type":1},{"type":1},{"type":1},{"type":1},{"type":1},{"type":1},{"type":0},{"type":0},{"type":1},{"type":1},{"type":1},{"type":1},{"type":0},{"type":1},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":1},{"type":1},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0},{"type":0}],"music":0}]}
```

## Editor

The editor comes with different tabs to create the JSON structured file:

Maps:

Tiles:

Attributes:

Properties:
    - Map Properties
    - Game Properties