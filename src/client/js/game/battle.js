function battle_prepare(front, back) {
    let path = '../assets/graphics/pokemon';

    battle.portraits = {
        front: front,
        back: back
    };

    if (!app.loader.resources[`front_portrait_${battle.portraits.front}`]) {
        app.loader.add(`front_portrait_${front}`, `${path}/${front}.png`)
    }

    if (!app.loader.resources[`back_portrait_${battle.portraits.back}`]) {
        app.loader.add(`back_portrait_${back}`, `${path}/${back}b.png`);
    }

    music.load(14);

    app.loader.load(battle_loaded);
    battle_enter_animation();
}

function battle_enter_animation() {
    battle.animation = setInterval(() => {
        let sprite = battle_container.getChildByName('transition');

        if (sprite.alpha == 0.75) {
            sprite.alpha = 0
        } else {
            sprite.alpha = 0.75;
        }
    }, 200);

    setTimeout(() => {
        clearInterval(battle.animation);
        battle_container.getChildByName('transition').alpha = 1;
    }, 1500);

    setTimeout(() => {
        battle_start();
    }, 2000);
}

function battle_loaded() {
    if (battle_container.getChildByName('front_portrait')) {
        battle_remove_portraits();
    }

    let front_portrait = new PIXI.Sprite.from(app.loader.resources[`front_portrait_${battle.portraits.front}`].url);
    front_portrait.x = GAME_WIDTH - front_portrait.width - 5;
    front_portrait.y = 5;
    front_portrait.name = 'front_portrait';
    front_portrait.visible = false;
    battle_container.addChild(front_portrait);

    let back_portrait = new PIXI.Sprite.from(app.loader.resources[`back_portrait_${battle.portraits.back}`].url);
    back_portrait.x = 5;
    back_portrait.y = 50;
    back_portrait.width = 64;
    back_portrait.height = 64;
    back_portrait.name = 'back_portrait';
    back_portrait.visible = false;
    battle_container.addChild(back_portrait);
}

function battle_start() {
    battle_container.getChildByName('transition').alpha = 0;
    battle_container.getChildByName('background').visible = true;

    setTimeout(() => {
        battle_container.getChildByName('front_portrait').visible = true;
        battle_container.getChildByName('back_portrait').visible = true;
        dialogue.queue_messages([`Wild ${battle.portraits.front.toUpperCase()} appeared!`, `Go! ${player.pokemon[0].name.toUpperCase()}!`]);
        sfx.cry(battle.pokemon.id);
    }, 2000)

    setTimeout(() => {
        sfx.cry(player.pokemon[0].id);
    }, 5000)

    setTimeout(() => {
        battle_end();
    }, 10000);
}

function battle_end() {
    music.immediate_play(14);
    dialogue.queue_messages([`Enemy ${battle.portraits.front.toUpperCase()} fainted!`, `${player.pokemon[0].name.toUpperCase()} gained 117 EXP. Points!`]);

    setTimeout(() => {
        battle_remove_portraits();
        message_container.visible = false;
        music.stop();
    }, 9000)

    setTimeout(() => {
        battle_container.getChildByName('background').visible = false;
        player.frozen = false;
        player.in_battle = false;
        player.emote.visible = false;
        player.controls = 'walking';
        music.immediate_play(music.get_context());
        socket.emit('trainer_exiting_battle', {lobby_id: meta.lobby_id});
    }, 9500)
}

function battle_remove_portraits() {
    battle_container.removeChild(battle_container.getChildByName('front_portrait'));
    battle_container.removeChild(battle_container.getChildByName('back_portrait'));
}