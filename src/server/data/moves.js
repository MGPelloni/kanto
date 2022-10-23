const MOVES = [{
        name: "ABSORB",
        type: "Grass",
        category: "Special",
        power: 20,
        accuracy: 1,
        pp: 20,
        effects: [
            "Absorb deals damage and the user will recover 50% of the HP drained."
        ]
    },
    {
        name: "ACID",
        type: "Poison",
        category: "Physical",
        power: 40,
        accuracy: 1,
        pp: 30,
        effect: {
            chance: 0.1,
            stat: "defense",
            stages: -1
        }
    },
    {
        name: "ACID ARMOR",
        type: "Poison",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 40,
        effect: {
            stat: "defense",
            stages: 2
        }
    },
    {
        name: "AGILITY",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        effect: {
            stat: "speed",
            stages: 2
        }
    },
    {
        name: "AMNESIA",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 20,
        effect: {
            stat: "special",
            stages: 2
        }
    },
    {
        name: "AURORA BEAM",
        type: "Ice",
        category: "Special",
        power: 65,
        accuracy: 1,
        pp: 20,
        effect: {
            chance: 0.1,
            stat: "attack",
            stages: -1
        }
    },
    {
        name: "BARRAGE",
        type: "Normal",
        category: "Physical",
        power: 15,
        accuracy: 0.85,
        pp: 20
    },
    {
        name: "BARRIER",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        effect: {
            stat: "defense",
            stages: 2
        }
    },
    {
        name: "BIDE",
        type: "Normal",
        category: "Physical",
        power: null,
        accuracy: null,
        pp: 10,
        effects: [
            "The user of Bide stores energy for 2 turns. At the end of the second turn the Pokémon unleashes energy, dealing twice the HP damage it received.",
            "Bide deals fixed, typeless damage, so will hit Ghost-type Pokémon. It also ignores changes to the Accuracy and Evasion stats and can hit Pokémon in the invulnerable stage of Bounce, Dig, Dive, Fly, Shadow Force or Sky Drop."
        ]
    },
    {
        name: "BIND",
        type: "Normal",
        category: "Physical",
        power: 15,
        accuracy: 0.85,
        pp: 20,
        effects: [
            "Bind inflicts damage on the first turn then traps the opponent, causing them to lose 1⁄16 of their maximum HP after each turn, for 4-5 turns."
        ]
    },
    {
        name: "BITE",
        type: "Normal",
        category: "Physical",
        power: 60,
        accuracy: 1,
        pp: 25,
        effect: {
            chance: 0.3,
            status_condition: "flinch"
        }
    },
    {
        name: "BLIZZARD",
        type: "Ice",
        category: "Special",
        power: 120,
        accuracy: 0.9,
        pp: 5,
        effect: {
            chance: 0.1,
            status_condition: "freeze"
        }
    },
    {
        name: "BODY SLAM",
        type: "Normal",
        category: "Physical",
        power: 85,
        accuracy: 1,
        pp: 15,
        effect: {
            chance: 0.3,
            status_condition: "paralysis"
        }
    },
    {
        name: "BONE CLUB",
        type: "Ground",
        category: "Physical",
        power: 65,
        accuracy: 0.85,
        pp: 20,
        effect: {
            chance: 0.1,
            status_condition: "flinch"
        }
    },
    {
        name: "BONEMERANG",
        type: "Ground",
        category: "Physical",
        power: 50,
        accuracy: 0.9,
        pp: 10,
        effects: [
            "Bonemerang deals damage and will strike twice (with 50 base power each time).\nEach strike of Bonemerang is treated like a separate attack"
        ]
    },
    {
        name: "BUBBLE",
        type: "Water",
        category: "Special",
        power: 20,
        accuracy: 1,
        pp: 30,
        effect: {
            chance: 0.1,
            stat: "speed",
            stages: -1
        }
    },
    {
        name: "BUBBLE BEAM",
        type: "Water",
        category: "Special",
        power: 65,
        accuracy: 1,
        pp: 20,
        effect: {
            chance: 0.1,
            stat: "speed",
            stages: -1
        }
    },
    {
        name: "CLAMP",
        type: "Water",
        category: "Physical",
        power: 35,
        accuracy: 0.85,
        pp: 10,
        effects: [
            "Clamp inflicts damage on the first turn then traps the opponent, causing them to lose 1⁄16 of their maximum HP after each turn, for 4-5 turns. If the user holds a Grip Claw then it is always 5 turns."
        ]
    },
    {
        name: "COMET PUNCH",
        type: "Normal",
        category: "Physical",
        power: 18,
        accuracy: 0.85,
        pp: 15
    },
    {
        name: "CONFUSE RAY",
        type: "Ghost",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 10,
        effect: {
            status_condition: "confused"
        }
    },
    {
        name: "CONFUSION",
        type: "Psychic",
        category: "Special",
        power: 50,
        accuracy: 1,
        pp: 25,
        effect: {
            chance: 0.1,
            status_condition: "confused"
        }
    },
    {
        name: "CONSTRICT",
        type: "Normal",
        category: "Physical",
        power: 10,
        accuracy: 1,
        pp: 35,
        effect: {
            chance: 0.1,
            stat: "speed",
            stages: -1
        }
    },
    {
        name: "CONVERSION",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30
    },
    {
        name: "COUNTER",
        type: "Fighting",
        category: "Physical",
        power: null,
        accuracy: 1,
        pp: 20,
        priority: -1,
        effects: [
            "When hit by a Physical Attack, user strikes back with 2x power."
        ]
    },
    {
        name: "CRABHAMMER",
        type: "Water",
        category: "Physical",
        power: 90,
        accuracy: 0.85,
        pp: 10,
        high_critical_hit_ratio: true
    },
    {
        name: "CUT",
        type: "Normal",
        category: "Physical",
        power: 50,
        accuracy: 0.95,
        pp: 30
    },
    {
        name: "DEFENSE CURL",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 40,
        effect: {
            stat: "defense",
            stages: 1
        }
    },
    {
        name: "DIG",
        type: "Ground",
        category: "Physical",
        power: 60,
        accuracy: 1,
        pp: 10,
        effects: [
            "The user of Dig will burrow its way underground on the first turn, disappearing from view and becoming invulnerable to most attacks. On the second turn, Dig deals damage."
        ]
    },
    {
        name: "DISABLE",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 0.55,
        pp: 20,
        effects: [
            "Disable causes the previous move the target used to be disabled for 1-8 turns, which prevents the move's use."
        ]
    },
    {
        name: "DIZZY PUNCH",
        type: "Normal",
        category: "Physical",
        power: 70,
        accuracy: 1,
        pp: 10
    },
    {
        name: "DOUBLE KICK",
        type: "Fighting",
        category: "Physical",
        power: 30,
        accuracy: 1,
        pp: 30,
        effects: [
            "Double Kick deals damage and will strike twice (with 30 base power each time).\nEach strike of Double Kick is treated like a separate attack"
        ]
    },
    {
        name: "DOUBLE SLAP",
        type: "Normal",
        category: "Physical",
        power: 15,
        accuracy: 0.85,
        pp: 10,
        effects: []
    },
    {
        name: "DOUBLE TEAM",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 15,
        effect: {
            stat: "evasiveness",
            stages: 1
        }
    },
    {
        name: "DOUBLE-EDGE",
        type: "Normal",
        category: "Physical",
        power: 100,
        accuracy: 1,
        pp: 15,
        effects: [
            "Double-Edge deals damage, but the user receives 1⁄3 of the damage it inflicted in recoil. In other words, if the attack does 90 HP damage to the opponent, the user will lose 30 HP."
        ]
    },
    {
        name: "DRAGON RAGE",
        type: "Dragon",
        category: "Special",
        power: null,
        accuracy: 1,
        pp: 10,
        effects: [
            "Dragon Rage always deals 40 HP damage to the target, regardless of typing. It has no additional effect."
        ]
    },
    {
        name: "DREAM EATER",
        type: "Psychic",
        category: "Special",
        power: 100,
        accuracy: 1,
        pp: 15,
        effects: [
            "Dream Eater deals damage only on sleeping foes and the user will recover 50% of the HP drained."
        ]
    },
    {
        name: "DRILL PECK",
        type: "Flying",
        category: "Physical",
        power: 80,
        accuracy: 1,
        pp: 20
    },
    {
        name: "EARTHQUAKE",
        type: "Ground",
        category: "Physical",
        power: 100,
        accuracy: 1,
        pp: 10
    },
    {
        name: "EGG BOMB",
        type: "Normal",
        category: "Physical",
        power: 100,
        accuracy: 0.75,
        pp: 10
    },
    {
        name: "EMBER",
        type: "Fire",
        category: "Special",
        power: 40,
        accuracy: 1,
        pp: 25,
        effect: {
            chance: 0.1,
            status_condition: "burn"
        }
    },
    {
        name: "EXPLOSION",
        type: "Normal",
        category: "Physical",
        power: 170,
        accuracy: 1,
        pp: 5,
        effects: [
            "Explosion deals high damage, but causes the user to faint."
        ]
    },
    {
        name: "FIRE BLAST",
        type: "Fire",
        category: "Special",
        power: 120,
        accuracy: 0.85,
        pp: 5,
        effect: {
            chance: 0.1,
            status_condition: "burn"
        }
    },
    {
        name: "FIRE PUNCH",
        type: "Fire",
        category: "Physical",
        power: 75,
        accuracy: 1,
        pp: 15,
        effect: {
            chance: 0.1,
            status_condition: "burn"
        }
    },
    {
        name: "FIRE SPIN",
        type: "Fire",
        category: "Special",
        power: 35,
        accuracy: 0.85,
        pp: 15,
        effects: [
            "Fire Spin inflicts damage on the first turn then traps the opponent, causing them to lose 1⁄16 of their maximum HP after each turn, for 4-5 turns. If the user holds a Grip Claw then it is always 5 turns."
        ]
    },
    {
        name: "FISSURE",
        type: "Ground",
        category: "Physical",
        power: null,
        accuracy: null,
        pp: 5,
        effects: [
            "If it hits, Fissure is guaranteed to make the opponent faint. It is more likely to hit Pokémon that are of a lower level than the user.",
            "Its accuracy (as a percentage) is calculated as below, ignoring all other accuracy and evasion modifiers:"
        ]
    },
    {
        name: "FLAMETHROWER",
        type: "Fire",
        category: "Special",
        power: 95,
        accuracy: 1,
        pp: 15,
        effect: {
            chance: 0.1,
            status_condition: "burn"
        }
    },
    {
        name: "FLASH",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 0.7,
        pp: 20,
        effect: {
            stat: "accuracy",
            stages: -1
        }
    },
    {
        name: "FLY",
        type: "Flying",
        category: "Physical",
        power: 70,
        accuracy: 0.95,
        pp: 15,
        effects: [
            "The user of Fly will fly up high on the first turn, disappearing from view and becoming invulnerable to most attacks. On the second turn, Fly deals damage.",
            "While in the air, the Pokémon can only be hit by the moves Gust, Twister, Thunder, Sky Uppercut and Smack Down, with Gust and Twister dealing twice normal damage. Moves from No Guard Pokémon, or any move following an identify move can also hit for regular power."
        ]
    },
    {
        name: "FOCUS ENERGY",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        high_critical_hit_ratio: true
    },
    {
        name: "FURY ATTACK",
        type: "Normal",
        category: "Physical",
        power: 15,
        accuracy: 0.85,
        pp: 20,
        effects: []
    },
    {
        name: "FURY SWIPES",
        type: "Normal",
        category: "Physical",
        power: 18,
        accuracy: 0.8,
        pp: 15,
        effects: []
    },
    {
        name: "GLARE",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 0.75,
        pp: 30,
        effect: {
            status_condition: "paralysis"
        }
    },
    {
        name: "GROWL",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 40,
        effect: {
            stat: "attack",
            stages: -1
        }
    },
    {
        name: "GROWTH",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 40,
        effect: {
            stat: "special",
            stages: 1
        }
    },
    {
        name: "GUILLOTINE",
        type: "Normal",
        category: "Physical",
        power: null,
        accuracy: null,
        pp: 5,
        effects: [
            "If it hits, Guillotine is guaranteed to make the opponent faint. It is more likely to hit Pokémon that are of a lower level than the user.",
            "Its accuracy (as a percentage) is calculated as below, ignoring all other accuracy and evasion modifiers:"
        ]
    },
    {
        name: "GUST",
        type: "Normal",
        category: "Special",
        power: 40,
        accuracy: 1,
        pp: 35
    },
    {
        name: "HARDEN",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        effect: {
            stat: "defense",
            stages: 1
        }
    },
    {
        name: "HAZE",
        type: "Ice",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        effects: [
            "Resets all stat changes."
        ]
    },
    {
        name: "HEADBUTT",
        type: "Normal",
        category: "Physical",
        power: 70,
        accuracy: 1,
        pp: 15,
        effect: {
            chance: 0.3,
            status_condition: "flinch"
        }
    },
    {
        name: "HIGH JUMP KICK",
        type: "Fighting",
        category: "Physical",
        power: 85,
        accuracy: 0.9,
        pp: 20,
        effects: [
            "High Jump Kick deals damage, however, if it misses the user keeps going and crashes, losing 1⁄2 of its maximum HP. High Jump Kick cannot be used if Gravity is in effect."
        ]
    },
    {
        name: "HORN ATTACK",
        type: "Normal",
        category: "Physical",
        power: 65,
        accuracy: 1,
        pp: 25
    },
    {
        name: "HORN DRILL",
        type: "Normal",
        category: "Physical",
        power: null,
        accuracy: null,
        pp: 5,
        effects: [
            "If it hits, Horn Drill is guaranteed to make the opponent faint. It is more likely to hit Pokémon that are of a lower level than the user.",
            "Its accuracy (as a percentage) is calculated as below, ignoring all other accuracy and evasion modifiers:"
        ]
    },
    {
        name: "HYDRO PUMP",
        type: "Water",
        category: "Special",
        power: 120,
        accuracy: 0.8,
        pp: 5
    },
    {
        name: "HYPER BEAM",
        type: "Normal",
        category: "Special",
        power: 150,
        accuracy: 0.9,
        pp: 5,
        effects: [
            "Hyper Beam deals damage, but the user must recharge on the next turn (bringing its effective power down to 75 per turn)."
        ]
    },
    {
        name: "HYPER FANG",
        type: "Normal",
        category: "Physical",
        power: 80,
        accuracy: 0.9,
        pp: 15,
        effect: {
            chance: 0.1,
            status_condition: "flinch"
        }
    },
    {
        name: "HYPNOSIS",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: 0.6,
        pp: 20,
        effect: {
            status_condition: "sleep"
        }
    },
    {
        name: "ICE BEAM",
        type: "Ice",
        category: "Special",
        power: 95,
        accuracy: 1,
        pp: 10,
        effect: {
            chance: 0.1,
            status_condition: "freeze"
        }
    },
    {
        name: "ICE PUNCH",
        type: "Ice",
        category: "Physical",
        power: 75,
        accuracy: 1,
        pp: 15,
        effect: {
            chance: 0.1,
            status_condition: "freeze"
        }
    },
    {
        name: "JUMP KICK",
        type: "Fighting",
        category: "Physical",
        power: 70,
        accuracy: 0.95,
        pp: 25,
        effects: [
            "Jump Kick deals damage, however, if it misses the user keeps going and crashes, losing 1⁄2 of its maximum HP. Jump Kick cannot be used if Gravity is in effect."
        ]
    },
    {
        name: "KARATE CHOP",
        type: "Normal",
        category: "Physical",
        power: 50,
        accuracy: 1,
        pp: 25,
        high_critical_hit_ratio: true
    },
    {
        name: "KINESIS",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: 0.8,
        pp: 15,
        effect: {
            stat: "accuracy",
            stages: -1
        }
    },
    {
        name: "LEECH LIFE",
        type: "Bug",
        category: "Physical",
        power: 20,
        accuracy: 1,
        pp: 15,
        effects: [
            "Leech Life deals damage and the user will recover 50% of the HP drained."
        ]
    },
    {
        name: "LEECH SEED",
        type: "Grass",
        category: "Status",
        power: null,
        accuracy: 0.9,
        pp: 10,
        effects: [
            "Leech Seed plants a seed on the target that drains 1⁄8 of its maximum HP at the end of each turn and restores it to the user, or any Pokemon that takes its place. It does not work on Grass-type Pokemon; it does technically work against Pokemon with the Magic Guard ability, but no HP will be sapped."
        ]
    },
    {
        name: "LEER",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 30,
        effect: {
            stat: "defense",
            stages: -1
        }
    },
    {
        name: "LICK",
        type: "Ghost",
        category: "Physical",
        power: 20,
        accuracy: 1,
        pp: 30,
        effect: {
            chance: 0.3,
            status_condition: "paralysis"
        }
    },
    {
        name: "LIGHT SCREEN",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        effects: [
            "Light Screen reduces damage from Special attacks by 50%, for 5 turns. Its effects apply to all Pokémon on the user's side of the field."
        ]
    },
    {
        name: "LOVELY KISS",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 0.75,
        pp: 10,
        effect: {
            status_condition: "sleep"
        }
    },
    {
        name: "LOW KICK",
        type: "Fighting",
        category: "Physical",
        power: 50,
        accuracy: 0.9,
        pp: 20,
        effect: {
            chance: 0.3,
            status_condition: "flinch"
        }
    },
    {
        name: "MEDITATE",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 40,
        effect: {
            stat: "attack",
            stages: 1
        }
    },
    {
        name: "MEGA DRAIN",
        type: "Grass",
        category: "Special",
        power: 40,
        accuracy: 1,
        pp: 10,
        effects: [
            "Mega Drain deals damage and the user will recover 50% of the HP drained.",
            "If the user is holding a Big Root, the move instead recovers 65% of the damage dealt (30% more than normal). If used on a Pokemon with the ability Liquid Ooze, the user instead loses the HP it would have otherwise gained."
        ]
    },
    {
        name: "MEGA KICK",
        type: "Normal",
        category: "Physical",
        power: 120,
        accuracy: 0.75,
        pp: 5
    },
    {
        name: "MEGA PUNCH",
        type: "Normal",
        category: "Physical",
        power: 80,
        accuracy: 0.85,
        pp: 20
    },
    {
        name: "METRONOME",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 10,
        effects: [
            "User performs any move in the game at random."
        ]
    },
    {
        name: "MIMIC",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 10,
        effects: [
            "Mimic copies the last move used by the target (replacing Mimic). The copied move always has 5 PP. The effect only lasts while the user is in battle: if the user switches out or when the battle ends, the move becomes Mimic again.",
            "Mimic cannot copy Chatter, Metronome, Sketch or Struggle."
        ]
    },
    {
        name: "MINIMIZE",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 20,
        effect: {
            stat: "evasiveness",
            stages: 1
        }
    },
    {
        name: "MIRROR MOVE",
        type: "Flying",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 20,
        effects: [
            "User performs the opponent's last move."
        ]
    },
    {
        name: "MIST",
        type: "Ice",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        effects: [
            "User's stats cannot be changed for a period of time."
        ]
    },
    {
        name: "NIGHT SHADE",
        type: "Ghost",
        category: "Special",
        power: null,
        accuracy: 1,
        pp: 15,
        effects: [
            "The damage of Night Shade is equal to the user's level. So at level 100 the Pokémon will inflict 100 HP damage."
        ]
    },
    {
        name: "PAY DAY",
        type: "Normal",
        category: "Physical",
        power: 40,
        accuracy: 1,
        pp: 20
    },
    {
        name: "PECK",
        type: "Flying",
        category: "Physical",
        power: 35,
        accuracy: 1,
        pp: 35
    },
    {
        name: "PETAL DANCE",
        type: "Grass",
        category: "Special",
        power: 120,
        accuracy: 1,
        pp: 10,
        effects: [
            "The user of Petal Dance attacks for 2-3 turns, during which it cannot switch out, and then becomes confused. Confused Pokémon have a 50% chance of hurting themselves each turn, for 1-4 turns. The damage received is as if the Pokémon attacks itself with a typeless 40 base power Physical attack.",
            "If Petal Dance is disrupted (e.g. if the move misses or the user cannot attack due to paralysis) then it will stop and not cause confusion.",
            "Pokémon with the ability Own Tempo or those behind a Substitute cannot be confused."
        ]
    },
    {
        name: "PIN MISSILE",
        type: "Bug",
        category: "Physical",
        power: 14,
        accuracy: 0.85,
        pp: 20
    },
    {
        name: "POISON GAS",
        type: "Poison",
        category: "Status",
        power: null,
        accuracy: 0.55,
        pp: 40,
        effect: {
            status_condition: "poison"
        }
    },
    {
        name: "POISON POWDER",
        type: "Poison",
        category: "Status",
        power: null,
        accuracy: 0.75,
        pp: 35,
        effect: {
            status_condition: "poison"
        }
    },
    {
        name: "POISON STING",
        type: "Poison",
        category: "Physical",
        power: 15,
        accuracy: 1,
        pp: 35,
        effect: {
            chance: 0.3,
            status_condition: "poison"
        }
    },
    {
        name: "POUND",
        type: "Normal",
        category: "Physical",
        power: 40,
        accuracy: 1,
        pp: 35
    },
    {
        name: "PSYBEAM",
        type: "Psychic",
        category: "Special",
        power: 65,
        accuracy: 1,
        pp: 20,
        effect: {
            chance: 0.1,
            status_condition: "confused"
        }
    },
    {
        name: "PSYCHIC",
        type: "Psychic",
        category: "Special",
        power: 90,
        accuracy: 1,
        pp: 10,
        effect: {
            chance: 0.3,
            stat: "special",
            stages: -1
        }
    },
    {
        name: "PSYWAVE",
        type: "Psychic",
        category: "Special",
        power: null,
        accuracy: 0.8,
        pp: 15,
        effects: [
            "Psywave inflicts a random amount of HP damage, varying between 50% and 150% of the user's level. In other words, at level 100 the damage will be 50-150 HP.",
            "The damage is typeless (not affected by type advantages/disadvantages) but it still does not affect Dark type Pokemon."
        ]
    },
    {
        name: "QUICK ATTACK",
        type: "Normal",
        category: "Physical",
        power: 40,
        accuracy: 1,
        pp: 30,
        priority: 1
    },
    {
        name: "RAGE",
        type: "Normal",
        category: "Physical",
        power: 20,
        accuracy: 1,
        pp: 20,
        effects: [
            "Rage deals damage, and if the user is hit by a direct attack - any time after Rage is first used but before a different move is used - the user's Attack is raised by one stage. The game will state the Pokemon's rage is building rather than explicitly assert the stat increase. Stats can be raised to a maximum of +6 stages each.",
            "The Attack increases will continue as long as Rage is the last move used, even if it misses, the user is incapacitated (paralyzed, sleeping, etc) or the player uses an item. The Attack increase activates for every blow of multi-hit moves such as DoubleSlap or Fury Swipes.",
            "As an example, if a Pokemon uses Rage then the opponent hits the user in the same turn, the user's Attack increases. If the user moves last it will not increase that turn, but will in the next turn if the opponent hits the user again."
        ]
    },
    {
        name: "RAZOR LEAF",
        type: "Grass",
        category: "Physical",
        power: 55,
        accuracy: 0.95,
        pp: 25,
        high_critical_hit_ratio: true
    },
    {
        name: "RAZOR WIND",
        type: "Normal",
        category: "Special",
        power: 80,
        accuracy: 0.75,
        pp: 10,
        effects: [
            "The user of Razor Wind will whip up a whirlwind on the first turn. On the second turn, Razor Wind deals damage."
        ]
    },
    {
        name: "RECOVER",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 20,
        effects: [
            "Recover restores up to 50% of the user's maximum HP."
        ]
    },
    {
        name: "REFLECT",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 20,
        effects: [
            "Reflect reduces damage from Physical attacks by 50%, for 5 turns. Its effects apply to all Pokémon on the user's side of the field."
        ]
    },
    {
        name: "REST",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 10,
        effects: [
            "User sleeps for 2 turns, but user is fully healed."
        ]
    },
    {
        name: "ROAR",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 20
    },
    {
        name: "ROCK SLIDE",
        type: "Rock",
        category: "Physical",
        power: 75,
        accuracy: 0.9,
        pp: 10,
        effect: {
            chance: 0.3,
            status_condition: "flinch"
        }
    },
    {
        name: "ROCK THROW",
        type: "Rock",
        category: "Physical",
        power: 50,
        accuracy: 0.65,
        pp: 15
    },
    {
        name: "ROLLING KICK",
        type: "Fighting",
        category: "Physical",
        power: 60,
        accuracy: 0.85,
        pp: 15,
        effect: {
            chance: 0.3,
            status_condition: "flinch"
        }
    },
    {
        name: "SAND ATTACK",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 15,
        effect: {
            stat: "accuracy",
            stages: -1
        }
    },
    {
        name: "SCRATCH",
        type: "Normal",
        category: "Physical",
        power: 40,
        accuracy: 1,
        pp: 35
    },
    {
        name: "SCREECH",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 0.85,
        pp: 40,
        effect: {
            stat: "defense",
            stages: -2
        }
    },
    {
        name: "SEISMIC TOSS",
        type: "Fighting",
        category: "Physical",
        power: null,
        accuracy: 1,
        pp: 20,
        effects: [
            "The damage of Seismic Toss is equal to the user's level. So at level 100 the Pokémon will inflict 100 HP damage."
        ]
    },
    {
        name: "SELF-DESTRUCT",
        type: "Normal",
        category: "Physical",
        power: 200,
        accuracy: 1,
        pp: 5,
        effects: [
            "Self-Destruct deals high damage, but causes the user to faint."
        ]
    },
    {
        name: "SHARPEN",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        effect: {
            stat: "attack",
            stages: 1
        }
    },
    {
        name: "SING",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 0.55,
        pp: 15,
        effect: {
            status_condition: "sleep"
        }
    },
    {
        name: "SKULL BASH",
        type: "Normal",
        category: "Physical",
        power: 100,
        accuracy: 1,
        pp: 15,
        effects: [
            "The user of Skull Bash will tuck in its head on the first turn and raise its Defense by one stage. On the second turn, Skull Bash deals damage."
        ]
    },
    {
        name: "SKY ATTACK",
        type: "Flying",
        category: "Physical",
        power: 140,
        accuracy: 0.9,
        pp: 5,
        effects: [
            "The user of Sky Attack will become cloaked in a harsh light on the first turn. On the second turn, Sky Attack deals damage."
        ]
    },
    {
        name: "SLAM",
        type: "Normal",
        category: "Physical",
        power: 80,
        accuracy: 0.75,
        pp: 20
    },
    {
        name: "SLASH",
        type: "Normal",
        category: "Physical",
        power: 70,
        accuracy: 1,
        pp: 20,
        high_critical_hit_ratio: true
    },
    {
        name: "SLEEP POWDER",
        type: "Grass",
        category: "Status",
        power: null,
        accuracy: 0.75,
        pp: 15,
        effect: {
            status_condition: "sleep"
        }
    },
    {
        name: "SLUDGE",
        type: "Poison",
        category: "Special",
        power: 65,
        accuracy: 1,
        pp: 20,
        effect: {
            chance: 0.3,
            status_condition: "poison"
        }
    },
    {
        name: "SMOG",
        type: "Poison",
        category: "Special",
        power: 20,
        accuracy: 0.7,
        pp: 20,
        effect: {
            chance: 0.4,
            status_condition: "poison"
        }
    },
    {
        name: "SMOKESCREEN",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 20,
        effect: {
            stat: "accuracy",
            stages: -1
        }
    },
    {
        name: "SOFT-BOILED",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 10,
        effects: [
            "Soft-Boiled recovers up to 50% of the user's maximum HP."
        ]
    },
    {
        name: "SOLAR BEAM",
        type: "Grass",
        category: "Special",
        power: 120,
        accuracy: 1,
        pp: 10,
        effects: [
            "The user of Solar Beam will absorb light on the first turn. On the second turn, Solar Beam deals damage."
        ]
    },
    {
        name: "SONIC BOOM",
        type: "Normal",
        category: "Special",
        power: null,
        accuracy: 0.9,
        pp: 20,
        effects: [
            "Sonic Boom always deals 20 HP damage to the target, regardless of typing (although Ghost type Pokémon are still immune). It has no additional effect."
        ]
    },
    {
        name: "SPIKE CANNON",
        type: "Normal",
        category: "Physical",
        power: 20,
        accuracy: 1,
        pp: 15,
        effects: []
    },
    {
        name: "SPLASH",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 40
    },
    {
        name: "SPORE",
        type: "Grass",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 15,
        effect: {
            status_condition: "sleep"
        }
    },
    {
        name: "STOMP",
        type: "Normal",
        category: "Physical",
        power: 65,
        accuracy: 1,
        pp: 20,
        effect: {
            chance: 0.3,
            status_condition: "flinch"
        }
    },
    {
        name: "STRENGTH",
        type: "Normal",
        category: "Physical",
        power: 80,
        accuracy: 1,
        pp: 15
    },
    {
        name: "STRING SHOT",
        type: "Bug",
        category: "Status",
        power: null,
        accuracy: 0.95,
        pp: 40,
        effect: {
            stat: "speed",
            stages: -1
        }
    },
    {
        name: "STRUGGLE",
        type: "Normal",
        category: "Physical",
        power: 50,
        accuracy: 1,
        pp: null,
        effects: [
            "Only usable when all PP are gone. Hurts the user."
        ]
    },
    {
        name: "STUN SPORE",
        type: "Grass",
        category: "Status",
        power: null,
        accuracy: 0.75,
        pp: 30,
        effect: {
            status_condition: "paralysis"
        }
    },
    {
        name: "SUBMISSION",
        type: "Fighting",
        category: "Physical",
        power: 80,
        accuracy: 0.8,
        pp: 25,
        effects: [
            "Submission deals damage, but the user receives 1⁄4 of the damage it inflicts in recoil. In other words, if the attack does 100 HP damage to the opponent, the user will lose 25 HP."
        ]
    },
    {
        name: "SUBSTITUTE",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 10,
        effects: [
            "Uses HP to creates a decoy that takes hits."
        ]
    },
    {
        name: "SUPER FANG",
        type: "Normal",
        category: "Physical",
        power: null,
        accuracy: 0.9,
        pp: 10,
        effects: [
            "Always takes off half of the opponent's HP."
        ]
    },
    {
        name: "SUPERSONIC",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 0.55,
        pp: 20,
        effect: {
            status_condition: "confused"
        }
    },
    {
        name: "SURF",
        type: "Water",
        category: "Special",
        power: 95,
        accuracy: 1,
        pp: 15
    },
    {
        name: "SWIFT",
        type: "Normal",
        category: "Special",
        power: 60,
        accuracy: null,
        pp: 20
    },
    {
        name: "SWORDS DANCE",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 30,
        effect: {
            stat: "attack",
            stages: 2
        }
    },
    {
        name: "TACKLE",
        type: "Normal",
        category: "Physical",
        power: 35,
        accuracy: 0.95,
        pp: 35
    },
    {
        name: "TAIL WHIP",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 30,
        effect: {
            stat: "defense",
            stages: -1
        }
    },
    {
        name: "TAKE DOWN",
        type: "Normal",
        category: "Physical",
        power: 90,
        accuracy: 0.85,
        pp: 20,
        effects: [
            "Take Down deals damage, but the user receives 1⁄4 of the damage it inflicted in recoil. In other words, if the attack does 100 HP damage to the opponent, the user will lose 25 HP."
        ]
    },
    {
        name: "TELEPORT",
        type: "Psychic",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 20
    },
    {
        name: "THRASH",
        type: "Normal",
        category: "Physical",
        power: 120,
        accuracy: 1,
        pp: 10,
        effects: [
            "The user of Thrash attacks for 2-3 turns, during which it cannot switch out, and then becomes confused. Confused Pokémon have a 50% chance of hurting themselves each turn, for 1-4 turns. The damage received is as if the Pokémon attacks itself with a typeless 40 base power Physical attack.",
            "If Thrash is disrupted (e.g. if the move misses or the user cannot attack due to paralysis) then it will stop and not cause confusion.",
            "Pokémon with the ability Own Tempo or those behind a Substitute cannot be confused."
        ]
    },
    {
        name: "THUNDER",
        type: "Electric",
        category: "Special",
        power: 120,
        accuracy: 0.7,
        pp: 10,
        effect: {
            chance: 0.1,
            status_condition: "paralysis"
        }
    },
    {
        name: "THUNDER PUNCH",
        type: "Electric",
        category: "Physical",
        power: 75,
        accuracy: 1,
        pp: 15,
        effect: {
            chance: 0.1,
            status_condition: "paralysis"
        }
    },
    {
        name: "THUNDER SHOCK",
        type: "Electric",
        category: "Special",
        power: 40,
        accuracy: 1,
        pp: 30,
        effect: {
            chance: 0.1,
            status_condition: "paralysis"
        }
    },
    {
        name: "THUNDER WAVE",
        type: "Electric",
        category: "Status",
        power: null,
        accuracy: 1,
        pp: 20,
        effect: {
            status_condition: "paralysis"
        }
    },
    {
        name: "THUNDERBOLT",
        type: "Electric",
        category: "Special",
        power: 95,
        accuracy: 1,
        pp: 15,
        effect: {
            chance: 0.1,
            status_condition: "paralysis"
        }
    },
    {
        name: "TOXIC",
        type: "Poison",
        category: "Status",
        power: null,
        accuracy: 0.85,
        pp: 10,
        effect: {
            status_condition: "badly poison"
        }
    },
    {
        name: "TRANSFORM",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 10,
        effects: [
            "User takes on the form and attacks of the opponent."
        ]
    },
    {
        name: "TRI ATTACK",
        type: "Normal",
        category: "Special",
        power: 80,
        accuracy: 1,
        pp: 10
    },
    {
        name: "TWINEEDLE",
        type: "Bug",
        category: "Physical",
        power: 25,
        accuracy: 1,
        pp: 20,
        effects: [
            "Twineedle deals damage and will strike twice (with 25 base power each time). It has a 20% chance of poisoning the target. Poison or Steel type Pokémon, those with the ability Immunity or those behind a Substitute cannot be poisoned.\nEach strike of Twineedle is treated like a separate attack"
        ]
    },
    {
        name: "VICE GRIP",
        type: "Normal",
        category: "Physical",
        power: 55,
        accuracy: 1,
        pp: 30
    },
    {
        name: "VINE WHIP",
        type: "Grass",
        category: "Physical",
        power: 35,
        accuracy: 1,
        pp: 10
    },
    {
        name: "WATER GUN",
        type: "Water",
        category: "Special",
        power: 40,
        accuracy: 1,
        pp: 25
    },
    {
        name: "WATERFALL",
        type: "Water",
        category: "Physical",
        power: 80,
        accuracy: 1,
        pp: 15
    },
    {
        name: "WHIRLWIND",
        type: "Normal",
        category: "Status",
        power: null,
        accuracy: 0.85,
        pp: 20
    },
    {
        name: "WING ATTACK",
        type: "Flying",
        category: "Physical",
        power: 35,
        accuracy: 1,
        pp: 35
    },
    {
        name: "WITHDRAW",
        type: "Water",
        category: "Status",
        power: null,
        accuracy: null,
        pp: 40,
        effect: {
            stat: "defense",
            stages: 1
        }
    },
    {
        name: "WRAP",
        type: "Normal",
        category: "Physical",
        power: 15,
        accuracy: 0.9,
        pp: 20,
        effects: [
            "Wrap inflicts damage on the first turn then traps the opponent, causing them to lose 1⁄16 of their maximum HP after each turn, for 4-5 turns. If the user holds a Grip Claw then it is always 5 turns."
        ]
    }
]