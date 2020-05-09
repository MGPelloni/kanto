# Kanto

## Built With

* [PIXI.js](https://www.pixijs.com/) - 2D WebGL Renderer
* [NPM](https://www.npmjs.com/get-npm) - Package Manager
* [Gulp.js](https://gulpjs.com/) - Workflow Automation

## Data Structure

A "game" is a JSON structured file:

```
name: "",
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


## Editor

The editor comes with different tabs to create the JSON structured file:

Maps:

Tiles:

Attributes:

Properties:
    - Map Properties
    - Game Properties