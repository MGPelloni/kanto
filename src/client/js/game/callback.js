function dialogue_cry_sfx(args) {
    console.log('callback event: dialogue_cry_sfx', args);

    if (args.id) {
        sfx.cry(args.id);
    }
}

function dialogue_battle_sfx(args) {
    console.log('callback event: dialogue_battle_sfx', args);

    if (args.name) {
        sfx.play(args.name, 'battle');
    }
}