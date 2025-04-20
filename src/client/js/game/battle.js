function battle_prepare(front, back) {
    let path = '../assets/graphics/pokemon';

    battle.portraits = {
        front: front.toLowerCase(),
        back: back.toLowerCase()
    };

    if (!app.loader.resources[`front_portrait_${battle.portraits.front}`]) {
        app.loader.add(`front_portrait_${battle.portraits.front}`, `${path}/${battle.portraits.front}.png`)
    }

    if (!app.loader.resources[`back_portrait_${battle.portraits.back}`]) {
        app.loader.add(`back_portrait_${battle.portraits.back}`, `${path}/${battle.portraits.back}b.png`);
    }

    // music.load(14);

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

let front_name = null;
let front_level = null;
let back_name = null;
let back_level = null;
// hp
let front_hp = null;
let back_hp = null;
let front_hp_bar = null;
let back_hp_bar = null;
let front_hp_bar_bg = null;
let back_hp_bar_bg = null;

function battle_start() {
    battle_container.getChildByName('transition').alpha = 0;
    battle_container.getChildByName('background').visible = true;

    // Add pokemon name text
    front_name = new PIXI.Text(battle.portraits.front.toUpperCase(), {
        fontFamily: 'pokemon_gbregular', 
        fontSize: 16, 
        fill : 0x000000,
        align : 'left',
        wordWrap: true, 
        wordWrapWidth: message_bounds.width * 2
    });

    front_name.scale.x = 0.5;
    front_name.scale.y = 0.5;
    front_name.resolution = 4;

    front_name.x = 10;
    front_name.y = 0;
    front_name.visible = true;
    battle_container.addChild(front_name);

    // Add pokemon level text
    front_level = new PIXI.Text(`:L${battle.pokemon.level}`, {
        fontFamily: 'pokemon_gbregular', 
        fontSize: 16, 
        fill : 0x000000,
        align : 'left',
        wordWrap: true, 
        wordWrapWidth: message_bounds.width * 2
    });

    front_level.scale.x = 0.5;
    front_level.scale.y = 0.5;
    front_level.resolution = 4;
    front_level.x = 25;
    front_level.y = 10;
    front_level.visible = true;
    battle_container.addChild(front_level);

    // Add trainer name text
    back_name = new PIXI.Text(battle.portraits.back.toUpperCase(), {
        fontFamily: 'pokemon_gbregular', 
        fontSize: 16, 
        fill : 0x000000,
        align : 'left',
    });
    back_name.scale.x = 0.5;
    back_name.scale.y = 0.5;
    back_name.resolution = 4;
    back_name.x = GAME_WIDTH - 80;
    back_name.y = 60;
    back_name.visible = true;
    battle_container.addChild(back_name);

    // Add trainer level text
    back_level = new PIXI.Text(`:L${player.pokemon[0].level}`, {
        fontFamily: 'pokemon_gbregular', 
        fontSize: 16, 
        fill : 0x000000,
        align : 'right'
    });
    back_level.scale.x = 0.5;
    back_level.scale.y = 0.5;
    back_level.resolution = 4;
    back_level.x = GAME_WIDTH - back_level.width - 10;
    back_level.y = 70;
    back_level.visible = true;
    battle_container.addChild(back_level);
    
    // Add pokemon hp text
    // front_hp = new PIXI.Text(`HP: ${battle.pokemon.currentHP}/${battle.pokemon.maxHP}`, {
    //     fontFamily: 'pokemon_gbregular', 
    //     fontSize: 16, 
    //     fill : 0x000000,
    //     align : 'left',
    //     wordWrap: true, 
    //     wordWrapWidth: message_bounds.width * 2
    // });
    // front_hp.scale.x = 0.5;
    // front_hp.scale.y = 0.5;
    // front_hp.resolution = 4;
    // front_hp.x = 10;
    // front_hp.y = 20;
    // front_hp.visible = true;
    // battle_container.addChild(front_hp);
    // // Add trainer hp text
    back_hp = new PIXI.Text(`${player.pokemon[0].currentHP}/${player.pokemon[0].maxHP}`, {
        fontFamily: 'pokemon_gbregular', 
        fontSize: 16, 
        fill : 0x000000,
        align : 'right',
    });
    back_hp.scale.x = 0.5;

    back_hp.scale.y = 0.5;
    back_hp.resolution = 4;
    back_hp.x = GAME_WIDTH - 10;
    back_hp.y = 88;
    back_hp.anchor.set(1, 0);
    back_hp.visible = true;
    battle_container.addChild(back_hp);

    // Add hp bar
    front_hp_bar_bg = new PIXI.Graphics();
    front_hp_bar_bg.lineStyle(1, 0x000000, 1, 1); // Set a 2-pixel black border
    front_hp_bar_bg.drawRoundedRect(25, 22, 50, 2, 1);
    front_hp_bar_bg.visible = true;
    battle_container.addChild(front_hp_bar_bg);

    front_hp_bar = new PIXI.Graphics();
    front_hp_bar.beginFill(0x333333);
    front_hp_bar.drawRoundedRect(25, 22, (battle.pokemon.currentHP / battle.pokemon.maxHP) * 50, 2, 5);
    front_hp_bar.endFill();
    front_hp_bar.visible = true;
    battle_container.addChild(front_hp_bar);

    back_hp_bar_bg = new PIXI.Graphics();
    back_hp_bar_bg.lineStyle(1, 0x000000, 1, 1); // Set a 2-pixel black border
    back_hp_bar_bg.drawRoundedRect(GAME_WIDTH - 60, 83, 50, 2, 1);
    back_hp_bar_bg.visible = true;
    battle_container.addChild(back_hp_bar_bg);

    back_hp_bar = new PIXI.Graphics();
    back_hp_bar.beginFill(0x333333);
    back_hp_bar.drawRoundedRect(GAME_WIDTH - 60, 83, (player.pokemon[0].currentHP / player.pokemon[0].maxHP) * 50, 2, 5);
    back_hp_bar.endFill();
    back_hp_bar.visible = true;
    battle_container.addChild(back_hp_bar);
    

    setTimeout(() => {
        battle_container.getChildByName('front_portrait').visible = true;
        battle_container.getChildByName('back_portrait').visible = true;
        dialogue.queue_messages([{
            text: `Wild ${battle.portraits.front.toUpperCase()} appeared!`,
            pre_callback: {
                name: 'dialogue_cry_sfx',
                args: {
                    id: battle.pokemon.id
                }
            }
        }, {
            text: `Go! ${player.pokemon[0].name.toUpperCase()}!`,
            pre_callback: {
                name: 'dialogue_cry_sfx',
                args: {
                    id: player.pokemon[0].id
                }
            },
            post_callback: {
                name: 'battle_screens_open'
            }
        }]);
    }, 2000)
}

function update_battle_hp(args) {
    console.log('[update_battle_hp]', args);
    if (args.target == 'opponent') {
        front_hp_bar.clear();
        front_hp_bar.beginFill(0x333333);
        front_hp_bar.drawRoundedRect(25, 22, (args.currentHP / args.maxHP) * 50, 2, 5);
        front_hp_bar.endFill();

    } else {
        back_hp.text = `${args.currentHP}/${args.maxHP}`;
        back_hp_bar.clear();
        back_hp_bar.beginFill(0x333333);
        back_hp_bar.drawRoundedRect(GAME_WIDTH - 60, 83, (args.currentHP / args.maxHP) * 50, 2, 5);
        back_hp_bar.endFill();
    }
}

function battle_screens_open() {
    menus.forEach((menu, i) => {
        if (menu.name == 'Battle') {
            battle.menu = menu;
            menu_index = i;
        }
    });

    if (battle.menu) {
        // hide dialogue
        message_container.visible = false;
        menu_container.visible = true;
        battle.menu.reset();
        battle.menu.open();
        player.menu.history.push(menu_index); 
        player.menu.current = menu_index;
        player.menu.active = true;
        player.controls = 'menu';
    }

    // Moves menu
    let moves_menu = kanto_get_menu('Moves');
    let moves_options = [];

    player.pokemon[0].moves.forEach((move, i) => {
        moves_options.push({
            name: move.name.toUpperCase(),
            type: 'move',
            callback: () => {
                battle_move(move.name.toUpperCase());
            },
        });
    });

    moves_menu.update_options(moves_options);

    // setTimeout(() => {
    //     if (battle.menu) {
    //         battle.menu.close();    
    //     }
    //     battle_complete();
    // }, 3000)
}

function battle_complete() {
    music.immediate_play(14);
    dialogue.queue_messages([{
        text: `Enemy ${battle.portraits.front.toUpperCase()} fainted!`
    }, {
        text:`${player.pokemon[0].name.toUpperCase()} gained 117 EXP. Points!`,
        post_callback: {
            name: 'battle_end'
        }
    }]);
}

function battle_end(args) {
    battle_remove_portraits();
    kanto_close_menus();
    message_container.visible = false;
    music.stop();

    console.log('[battle_end]', args);

    setTimeout(() => {
        battle_container.getChildByName('background').visible = false;
        player.frozen = false;
        player.in_battle = false;
        player.emote.visible = false;
        player.controls = 'walking';
        player.can_move = true;
        player.menu.active = false;
        player.menu.current = 0;
        player.menu.history = [];
        socket.emit('trainer_exiting_battle', {lobby_id: lobby_id});

        if (args.winner == 'opponent') {
            const pokecenterMap = maps.find(m => m.name === 'Pokecenter');

            if (pokecenterMap) {
                player.place(pokecenterMap.starting_position.x, pokecenterMap.starting_position.y, pokecenterMap.id)
            }

            music.immediate_play(pokecenterMap.music);
        } else {
            music.immediate_play(music.get_context());
        }
    }, 500);
}

function battle_remove_portraits() {
    battle_container.removeChild(battle_container.getChildByName('front_portrait'));
    battle_container.removeChild(battle_container.getChildByName('back_portrait'));
    battle_container.removeChild(front_name);
    battle_container.removeChild(front_level);
    battle_container.removeChild(back_name);
    battle_container.removeChild(back_level);
    battle_container.removeChild(back_hp);
    battle_container.removeChild(front_hp_bar);
    battle_container.removeChild(back_hp_bar);
    battle_container.removeChild(front_hp_bar_bg);
    battle_container.removeChild(back_hp_bar_bg);
}