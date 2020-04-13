let tile_editor = document.querySelector('#tile-editor img');

tile_editor.addEventListener('click', e => {
    let tile_editor_width = tile_editor.width;
    let tilemap_width = Math.floor(tile_editor_width / TILE_SIZE);

    let tile_editor_click = {
        x: Math.floor(e.offsetX / TILE_SIZE),
        y: Math.floor(e.offsetY / TILE_SIZE),
    }

    tile_editor_click.tile = tile_editor_click.x + tilemap_width * tile_editor_click.y;
    console.log(tile_editor_click);
});