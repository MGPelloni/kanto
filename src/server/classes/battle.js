// A class that represents a battle in the game, calculating damage and handling moves. It uses socket.io to communicate with the client and server. It should let the client know when the battle starts, and when the player wins or loses.

const { name } = require("ejs");

// All calculations are done server-side, and the client only receives the results.
class Battle {
    constructor(lobby_id, socket_id, player, opponent, type = 'wild') {
        this.lobby_id = lobby_id;
        this.socket_id = socket_id;
        this.player = player;
        this.opponent = opponent;

        console.log('Battle created:', this.lobby_id, this.socket_id, this.player.pokemon, this.opponent.pokemon);

        console.log("IDs", this.player.pokemon[0].id, this.opponent.pokemon[0].id);

        this.battling_pokemon_player = player.pokemon[0];
        this.battling_pokemon_opponent = opponent.pokemon[0];

        console.log('Battling Pokemon:', this.battling_pokemon_player, this.battling_pokemon_opponent);
    }

    calculateDamage(attacker, defender, move) {
        const power = move.power || 0;
        const attackStat = move.category === 'Physical' ? attacker.stats.atk : attacker.stats.sp_atk;
        const defenseStat = move.category === 'Physical' ? defender.stats.def : defender.stats.sp_def;

        const damage = Math.floor(
            (((2 * attacker.level / 5 + 2) * power * attackStat / defenseStat) / 50 + 2) *
            (Math.random() * (1 - 0.85) + 0.85) // Random factor between 0.85 and 1
        );

        return damage;
    }

    calculateEXP(winner, loser) {
        const baseEXP = loser.baseEXP || 64;
        const exp = Math.floor((baseEXP * loser.level) / 7);
        return exp > 0 ? exp : 0;
    }

    handleMove(moveName, target) {
        console.log('Handling move:', moveName, 'on', target);
        const move = MOVES.find(m => m.name === moveName);
        if (!move) return { error: 'Invalid move' };

        const attacker = target === 'opponent' ? this.battling_pokemon_player : this.battling_pokemon_opponent;
        const defender = target === 'opponent' ? this.battling_pokemon_opponent : this.battling_pokemon_player;

        console.log('Attacker:', attacker, 'Defender:', defender, 'Move:', move);

        const damage = this.calculateDamage(attacker, defender, move);
        defender.currentHP = Math.max(0, defender.currentHP - damage);

        console.log('Damage dealt:', damage, 'Remaining HP:', defender.currentHP);

        return {
            moveName,
            attacker: attacker.name,
            defender: defender.name,
            damage,
            target,
            remainingHP: defender.currentHP,
            winner: defender.currentHP === 0 ? (target === 'opponent' ? 'player' : 'opponent') : null,
        };
    }

    sendResult(result) {
        console.log('Sending result:', result);
        io.to(this.lobby_id).emit('battle_result', result);
    }

    /**
     * Update the user's pokemon with the new stats and HP.
     */
    endBattle(winner) {
        // Calculate the EXP the user should get
        if (winner === 'player') {
            const exp = this.calculateEXP(this.battling_pokemon_player, this.battling_pokemon_opponent);
            this.player.pokemon[0].currentHP = this.battling_pokemon_player.currentHP;
            this.player.pokemon[0].maxHP = this.battling_pokemon_player.maxHP;
            this.player.pokemon[0].exp += exp;

            if (this.player.pokemon[0].exp >= this.player.pokemon[0].exp_needed) {
                this.player.pokemon[0].level += 1;
                this.player.pokemon[0].exp = 0;

                // Adjust stats
                this.player.pokemon[0].stats.atk = Math.floor((2 * this.player.pokemon[0].base.atk * this.player.pokemon[0].level) / 100) + 5;
                this.player.pokemon[0].stats.def = Math.floor((2 * this.player.pokemon[0].base.def * this.player.pokemon[0].level) / 100) + 5;
                this.player.pokemon[0].stats.sp_atk = Math.floor((2 * this.player.pokemon[0].base.sp_atk * this.player.pokemon[0].level) / 100) + 5;
                this.player.pokemon[0].stats.sp_def = Math.floor((2 * this.player.pokemon[0].base.sp_def * this.player.pokemon[0].level) / 100) + 5;
                this.player.pokemon[0].stats.speed = Math.floor((2 * this.player.pokemon[0].base.speed * this.player.pokemon[0].level) / 100) + 5;
                this.player.pokemon[0].stats.hp = Math.floor((2 * this.player.pokemon[0].base.hp * this.player.pokemon[0].level) / 100) + this.player.pokemon[0].level + 10;
                this.player.pokemon[0].maxHP = this.player.pokemon[0].stats.hp;
                this.player.pokemon[0].currentHP = this.player.pokemon[0].maxHP;
                this.player.pokemon[0].exp_needed = Math.floor((Math.pow(this.player.pokemon[0].level + 1, 3) - Math.pow(this.player.pokemon[0].level, 3)) * 0.8);
            }

            // Emit the new stats to the user
            io.to(this.socket_id).emit('player_sync', {
                pokemon: this.player.pokemon,
                money: this.player.money,
            });
        } else {
            // Player lost, reset the pokemon to 0 HP
            this.player.pokemon[0].currentHP = this.player.pokemon[0].maxHP;

            // Set player's position to pokecenter, loop through maps
            const lobby = lobbies[this.lobby_id];
            console.log('Lobby maps:', lobby.game.maps);

            const pokecenterMap = lobby.game.maps.find(m => m.name === 'Pokecenter');

            if (pokecenterMap) {
                this.player.position = {
                    map: pokecenterMap.id,
                    x: pokecenterMap.starting_position.x,
                    y: pokecenterMap.starting_position.y,
                }
            }

            this.player.in_battle = false;

            // Emit the new stats to the user
            io.to(this.socket_id).emit('player_sync', {
                pokemon: this.player.pokemon,
                money: this.player.money,
            });
        }


        // Delete battle
        const battleIndex = lobbies[this.lobby_id].battles.findIndex(b => b.socket_id === this.socket_id);
        if (battleIndex !== -1) {
            lobbies[this.lobby_id].battles.splice(battleIndex, 1);
        }
    }

}   


// Handle socket events
io.on('connection', (socket) => {
    socket.on('battle_move', (data) => {
        const battle = lobbies[data.lobby_id].battles.find(b => b.socket_id === socket.id);
        let messages = [];

        if (!battle) {
            console.log('Battle not found for socket:', socket.id);
            return;
        }

    
        console.log('Handling move:', data.move, 'on', data.target);
        const moveResult = battle.handleMove(data.move, data.target);
        console.log('Move result:', moveResult);

        messages.push(
            {
                text: `${moveResult.attacker.toUpperCase()} used ${moveResult.moveName}!`,
                pre_callback: {
                    name: 'update_battle_hp',
                    args: {
                        currentHP: moveResult.remainingHP,
                        maxHP: battle.battling_pokemon_opponent.maxHP,
                        target: moveResult.target
                    }
                }
            },
        );
        
        if (moveResult.remainingHP <= 0) {
            messages.push({
                text: `${moveResult.defender.toUpperCase()} fainted!`,
                pre_callback: {
                    name: 'dialogue_sfx',
                    args: {
                        name: 'faint'
                    }
                }
            });
        };

        if (!moveResult.winner) {
            // // Opponent's turn
            console.log('Opponent\'s turn', battle.battling_pokemon_opponent);
            const opponentMove = battle.battling_pokemon_opponent.moves[Math.floor(Math.random() * battle.battling_pokemon_opponent.moves.length)];
            const opponentMoveResult = battle.handleMove(opponentMove.name, 'player');
            console.log('Opponent move result:', opponentMoveResult);

            messages.push(
                {
                    text: `${opponentMoveResult.attacker.toUpperCase()} used ${opponentMoveResult.moveName}!`,
                    pre_callback: {
                        name: 'update_battle_hp',
                        args: {
                            currentHP: opponentMoveResult.remainingHP,
                            maxHP: battle.battling_pokemon_player.maxHP,
                            target: opponentMoveResult.target
                        }
                    }
                },
            );

            if (opponentMoveResult.remainingHP <= 0) {
                messages.push({
                    text: `${opponentMoveResult.defender.toUpperCase()} fainted!`,
                    pre_callback: {
                        name: 'dialogue_sfx',
                        args: {
                            name: 'faint'
                        }
                    }
                })
            }

            if (opponentMoveResult.winner) {
                // Opponent wins, player whites out
                messages.push(
                    {
                        text: `RED whited out!`,
                        post_callback: {
                            name: 'battle_end',
                            args: {
                                winner: opponentMoveResult.winner,
                            }
                        }
                    }
                );

                battle.endBattle(opponentMoveResult.winner);
            } else {
                // No winners
                // Add post callback to open battle screens for the last message
                messages[messages.length - 1].post_callback = {
                    name: 'battle_screens_open'
                };
            }
        } else {
            let exp = battle.calculateEXP(battle.battling_pokemon_player, battle.battling_pokemon_opponent);

            messages.push(
                {
                    text: `${moveResult.attacker.toUpperCase()} gained ${exp} EXP!`,
                    pre_callback: {
                        name: 'dialogue_play_music',
                        args: {
                            id: 14
                        },
                    },
                }
            );

            // Check if the player leveled up
            if (battle.battling_pokemon_player.exp + exp >= battle.battling_pokemon_player.exp_needed) {
                messages.push(
                    {
                        text: `${moveResult.attacker.toUpperCase()} grew to level ${battle.battling_pokemon_player.level + 1}!`,
                        pre_callback: {
                            name: 'dialogue_sfx',
                            args: {
                                name: 'item-key'
                            },
                        },
                    }
                );
            }

            messages[messages.length - 1].post_callback = {
                name: 'battle_end',
                args: {
                    winner: moveResult.winner,
                }
            };

            battle.endBattle(moveResult.winner);;
        }

        battle.sendResult({
            messages: messages,
        });
    });

    // socket.on('battle_message', (data) => {
    //     const battle = lobbies[data.lobby_id].battles.find(b => b.socket_id === socket.id);
        
    //     if (!battle) {
    //         console.log('Battle not found for socket:', socket.id);
    //         return;
    //     }

    //     battle.sendMessage(data.message);
    // });


    // socket.on('battle_start', (data) => {
    //     const lobby = lobbies[data.lobby_id];
    //     if (!lobby) {
    //         console.log('Lobby not found:', data.lobby_id);
    //         return;
    //     }

    //     const player = lobby.players.find(p => p.socket_id === socket.id);
    //     const opponent = lobby.opponents.find(o => o.socket_id === data.opponent_id);

    //     if (!player || !opponent) {
    //         console.log('Player or opponent not found:', player, opponent);
    //         return;
    //     }

    //     const battle = new Battle(data.lobby_id, socket.id, player, opponent);
    //     lobby.battles.push(battle);
    // });
});