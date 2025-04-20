const POKEMON = [{
    id: 1,
    name: "Bulbasaur",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 49,
        def: 49,
        hp: 45,
        sp_atk: 65,
        sp_def: 65,
        speed: 45,
        exp: 64
    },
    tm: [
        'SWORDS DANCE',
    ],
    hm: [
        'CUT'
    ],
    growth: "MEDIUM_SLOW"
},
{
    id: 2,
    name: "Ivysaur",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 62,
        def: 63,
        hp: 60,
        sp_atk: 80,
        sp_def: 80,
        speed: 60
    }
},
{
    id: 3,
    name: "Venusaur",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 82,
        def: 83,
        hp: 80,
        sp_atk: 100,
        sp_def: 100,
        speed: 80
    }
},
{
    id: 4,
    name: "Charmander",
    type: [
        "Fire"
    ],
    base: {
        atk: 52,
        def: 43,
        hp: 39,
        sp_atk: 60,
        sp_def: 50,
        speed: 65
    }
},
{
    id: 5,
    name: "Charmeleon",
    type: [
        "Fire"
    ],
    base: {
        atk: 64,
        def: 58,
        hp: 58,
        sp_atk: 80,
        sp_def: 65,
        speed: 80
    }
},
{
    id: 6,
    name: "Charizard",
    type: [
        "Fire",
        "Flying"
    ],
    base: {
        atk: 84,
        def: 78,
        hp: 78,
        sp_atk: 109,
        sp_def: 85,
        speed: 100
    }
},
{
    id: 7,
    name: "Squirtle",
    type: [
        "Water"
    ],
    base: {
        atk: 48,
        def: 65,
        hp: 44,
        sp_atk: 50,
        sp_def: 64,
        speed: 43
    }
},
{
    id: 8,
    name: "Wartortle",
    type: [
        "Water"
    ],
    base: {
        atk: 63,
        def: 80,
        hp: 59,
        sp_atk: 65,
        sp_def: 80,
        speed: 58
    }
},
{
    id: 9,
    name: "Blastoise",
    type: [
        "Water"
    ],
    base: {
        atk: 83,
        def: 100,
        hp: 79,
        sp_atk: 85,
        sp_def: 105,
        speed: 78
    }
},
{
    id: 10,
    name: "Caterpie",
    type: [
        "Bug"
    ],
    base: {
        atk: 30,
        def: 35,
        hp: 45,
        sp_atk: 20,
        sp_def: 20,
        speed: 45
    }
},
{
    id: 11,
    name: "Metapod",
    type: [
        "Bug"
    ],
    base: {
        atk: 20,
        def: 55,
        hp: 50,
        sp_atk: 25,
        sp_def: 25,
        speed: 30
    }
},
{
    id: 12,
    name: "Butterfree",
    type: [
        "Bug",
        "Flying"
    ],
    base: {
        atk: 45,
        def: 50,
        hp: 60,
        sp_atk: 90,
        sp_def: 80,
        speed: 70
    }
},
{
    id: 13,
    name: "Weedle",
    type: [
        "Bug",
        "Poison"
    ],
    base: {
        atk: 35,
        def: 30,
        hp: 40,
        sp_atk: 20,
        sp_def: 20,
        speed: 50
    }
},
{
    id: 14,
    name: "Kakuna",
    type: [
        "Bug",
        "Poison"
    ],
    base: {
        atk: 25,
        def: 50,
        hp: 45,
        sp_atk: 25,
        sp_def: 25,
        speed: 35
    }
},
{
    id: 15,
    name: "Beedrill",
    type: [
        "Bug",
        "Poison"
    ],
    base: {
        atk: 90,
        def: 40,
        hp: 65,
        sp_atk: 45,
        sp_def: 80,
        speed: 75
    }
},
{
    id: 16,
    name: "Pidgey",
    type: [
        "Normal",
        "Flying"
    ],
    base: {
        atk: 45,
        def: 40,
        hp: 40,
        sp_atk: 35,
        sp_def: 35,
        speed: 56
    }
},
{
    id: 17,
    name: "Pidgeotto",
    type: [
        "Normal",
        "Flying"
    ],
    base: {
        atk: 60,
        def: 55,
        hp: 63,
        sp_atk: 50,
        sp_def: 50,
        speed: 71
    }
},
{
    id: 18,
    name: "Pidgeot",
    type: [
        "Normal",
        "Flying"
    ],
    base: {
        atk: 80,
        def: 75,
        hp: 83,
        sp_atk: 70,
        sp_def: 70,
        speed: 101
    }
},
{
    id: 19,
    name: "Rattata",
    type: [
        "Normal"
    ],
    base: {
        atk: 56,
        def: 35,
        hp: 30,
        sp_atk: 25,
        sp_def: 35,
        speed: 72
    }
},
{
    id: 20,
    name: "Raticate",
    type: [
        "Normal"
    ],
    base: {
        atk: 81,
        def: 60,
        hp: 55,
        sp_atk: 50,
        sp_def: 70,
        speed: 97
    }
},
{
    id: 21,
    name: "Spearow",
    type: [
        "Normal",
        "Flying"
    ],
    base: {
        atk: 60,
        def: 30,
        hp: 40,
        sp_atk: 31,
        sp_def: 31,
        speed: 70
    }
},
{
    id: 22,
    name: "Fearow",
    type: [
        "Normal",
        "Flying"
    ],
    base: {
        atk: 90,
        def: 65,
        hp: 65,
        sp_atk: 61,
        sp_def: 61,
        speed: 100
    }
},
{
    id: 23,
    name: "Ekans",
    type: [
        "Poison"
    ],
    base: {
        atk: 60,
        def: 44,
        hp: 35,
        sp_atk: 40,
        sp_def: 54,
        speed: 55
    }
},
{
    id: 24,
    name: "Arbok",
    type: [
        "Poison"
    ],
    base: {
        atk: 95,
        def: 69,
        hp: 60,
        sp_atk: 65,
        sp_def: 79,
        speed: 80
    }
},
{
    id: 25,
    name: "Pikachu",
    type: [
        "Electric"
    ],
    base: {
        atk: 55,
        def: 40,
        hp: 35,
        sp_atk: 50,
        sp_def: 50,
        speed: 90
    }
},
{
    id: 26,
    name: "Raichu",
    type: [
        "Electric"
    ],
    base: {
        atk: 90,
        def: 55,
        hp: 60,
        sp_atk: 90,
        sp_def: 80,
        speed: 110
    }
},
{
    id: 27,
    name: "Sandshrew",
    type: [
        "Ground"
    ],
    base: {
        atk: 75,
        def: 85,
        hp: 50,
        sp_atk: 20,
        sp_def: 30,
        speed: 40
    }
},
{
    id: 28,
    name: "Sandslash",
    type: [
        "Ground"
    ],
    base: {
        atk: 100,
        def: 110,
        hp: 75,
        sp_atk: 45,
        sp_def: 55,
        speed: 65
    }
},
{
    id: 29,
    name: "Nidoranf",
    type: [
        "Poison"
    ],
    base: {
        atk: 47,
        def: 52,
        hp: 55,
        sp_atk: 40,
        sp_def: 40,
        speed: 41
    }
},
{
    id: 30,
    name: "Nidorina",
    type: [
        "Poison"
    ],
    base: {
        atk: 62,
        def: 67,
        hp: 70,
        sp_atk: 55,
        sp_def: 55,
        speed: 56
    }
},
{
    id: 31,
    name: "Nidoqueen",
    type: [
        "Poison",
        "Ground"
    ],
    base: {
        atk: 92,
        def: 87,
        hp: 90,
        sp_atk: 75,
        sp_def: 85,
        speed: 76
    }
},
{
    id: 32,
    name: "Nidoranm",
    type: [
        "Poison"
    ],
    base: {
        atk: 57,
        def: 40,
        hp: 46,
        sp_atk: 40,
        sp_def: 40,
        speed: 50
    }
},
{
    id: 33,
    name: "Nidorino",
    type: [
        "Poison"
    ],
    base: {
        atk: 72,
        def: 57,
        hp: 61,
        sp_atk: 55,
        sp_def: 55,
        speed: 65
    }
},
{
    id: 34,
    name: "Nidoking",
    type: [
        "Poison",
        "Ground"
    ],
    base: {
        atk: 102,
        def: 77,
        hp: 81,
        sp_atk: 85,
        sp_def: 75,
        speed: 85
    }
},
{
    id: 35,
    name: "Clefairy",
    type: [
        "Fairy"
    ],
    base: {
        atk: 45,
        def: 48,
        hp: 70,
        sp_atk: 60,
        sp_def: 65,
        speed: 35
    }
},
{
    id: 36,
    name: "Clefable",
    type: [
        "Fairy"
    ],
    base: {
        atk: 70,
        def: 73,
        hp: 95,
        sp_atk: 95,
        sp_def: 90,
        speed: 60
    }
},
{
    id: 37,
    name: "Vulpix",
    type: [
        "Fire"
    ],
    base: {
        atk: 41,
        def: 40,
        hp: 38,
        sp_atk: 50,
        sp_def: 65,
        speed: 65
    }
},
{
    id: 38,
    name: "Ninetales",
    type: [
        "Fire"
    ],
    base: {
        atk: 76,
        def: 75,
        hp: 73,
        sp_atk: 81,
        sp_def: 100,
        speed: 100
    }
},
{
    id: 39,
    name: "Jigglypuff",
    type: [
        "Normal",
        "Fairy"
    ],
    base: {
        atk: 45,
        def: 20,
        hp: 115,
        sp_atk: 45,
        sp_def: 25,
        speed: 20
    }
},
{
    id: 40,
    name: "Wigglytuff",
    type: [
        "Normal",
        "Fairy"
    ],
    base: {
        atk: 70,
        def: 45,
        hp: 140,
        sp_atk: 85,
        sp_def: 50,
        speed: 45
    }
},
{
    id: 41,
    name: "Zubat",
    type: [
        "Poison",
        "Flying"
    ],
    base: {
        atk: 45,
        def: 35,
        hp: 40,
        sp_atk: 30,
        sp_def: 40,
        speed: 55
    }
},
{
    id: 42,
    name: "Golbat",
    type: [
        "Poison",
        "Flying"
    ],
    base: {
        atk: 80,
        def: 70,
        hp: 75,
        sp_atk: 65,
        sp_def: 75,
        speed: 90
    }
},
{
    id: 43,
    name: "Oddish",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 50,
        def: 55,
        hp: 45,
        sp_atk: 75,
        sp_def: 65,
        speed: 30
    }
},
{
    id: 44,
    name: "Gloom",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 65,
        def: 70,
        hp: 60,
        sp_atk: 85,
        sp_def: 75,
        speed: 40
    }
},
{
    id: 45,
    name: "Vileplume",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 80,
        def: 85,
        hp: 75,
        sp_atk: 110,
        sp_def: 90,
        speed: 50
    }
},
{
    id: 46,
    name: "Paras",
    type: [
        "Bug",
        "Grass"
    ],
    base: {
        atk: 70,
        def: 55,
        hp: 35,
        sp_atk: 45,
        sp_def: 55,
        speed: 25
    }
},
{
    id: 47,
    name: "Parasect",
    type: [
        "Bug",
        "Grass"
    ],
    base: {
        atk: 95,
        def: 80,
        hp: 60,
        sp_atk: 60,
        sp_def: 80,
        speed: 30
    }
},
{
    id: 48,
    name: "Venonat",
    type: [
        "Bug",
        "Poison"
    ],
    base: {
        atk: 55,
        def: 50,
        hp: 60,
        sp_atk: 40,
        sp_def: 55,
        speed: 45
    }
},
{
    id: 49,
    name: "Venomoth",
    type: [
        "Bug",
        "Poison"
    ],
    base: {
        atk: 65,
        def: 60,
        hp: 70,
        sp_atk: 90,
        sp_def: 75,
        speed: 90
    }
},
{
    id: 50,
    name: "Diglett",
    type: [
        "Ground"
    ],
    base: {
        atk: 55,
        def: 25,
        hp: 10,
        sp_atk: 35,
        sp_def: 45,
        speed: 95
    }
},
{
    id: 51,
    name: "Dugtrio",
    type: [
        "Ground"
    ],
    base: {
        atk: 100,
        def: 50,
        hp: 35,
        sp_atk: 50,
        sp_def: 70,
        speed: 120
    }
},
{
    id: 52,
    name: "Meowth",
    type: [
        "Normal"
    ],
    base: {
        atk: 45,
        def: 35,
        hp: 40,
        sp_atk: 40,
        sp_def: 40,
        speed: 90
    }
},
{
    id: 53,
    name: "Persian",
    type: [
        "Normal"
    ],
    base: {
        atk: 70,
        def: 60,
        hp: 65,
        sp_atk: 65,
        sp_def: 65,
        speed: 115
    }
},
{
    id: 54,
    name: "Psyduck",
    type: [
        "Water"
    ],
    base: {
        atk: 52,
        def: 48,
        hp: 50,
        sp_atk: 65,
        sp_def: 50,
        speed: 55
    }
},
{
    id: 55,
    name: "Golduck",
    type: [
        "Water"
    ],
    base: {
        atk: 82,
        def: 78,
        hp: 80,
        sp_atk: 95,
        sp_def: 80,
        speed: 85
    }
},
{
    id: 56,
    name: "Mankey",
    type: [
        "Fighting"
    ],
    base: {
        atk: 80,
        def: 35,
        hp: 40,
        sp_atk: 35,
        sp_def: 45,
        speed: 70
    }
},
{
    id: 57,
    name: "Primeape",
    type: [
        "Fighting"
    ],
    base: {
        atk: 105,
        def: 60,
        hp: 65,
        sp_atk: 60,
        sp_def: 70,
        speed: 95
    }
},
{
    id: 58,
    name: "Growlithe",
    type: [
        "Fire"
    ],
    base: {
        atk: 70,
        def: 45,
        hp: 55,
        sp_atk: 70,
        sp_def: 50,
        speed: 60
    }
},
{
    id: 59,
    name: "Arcanine",
    type: [
        "Fire"
    ],
    base: {
        atk: 110,
        def: 80,
        hp: 90,
        sp_atk: 100,
        sp_def: 80,
        speed: 95
    }
},
{
    id: 60,
    name: "Poliwag",
    type: [
        "Water"
    ],
    base: {
        atk: 50,
        def: 40,
        hp: 40,
        sp_atk: 40,
        sp_def: 40,
        speed: 90
    }
},
{
    id: 61,
    name: "Poliwhirl",
    type: [
        "Water"
    ],
    base: {
        atk: 65,
        def: 65,
        hp: 65,
        sp_atk: 50,
        sp_def: 50,
        speed: 90
    }
},
{
    id: 62,
    name: "Poliwrath",
    type: [
        "Water",
        "Fighting"
    ],
    base: {
        atk: 95,
        def: 95,
        hp: 90,
        sp_atk: 70,
        sp_def: 90,
        speed: 70
    }
},
{
    id: 63,
    name: "Abra",
    type: [
        "Psychic"
    ],
    base: {
        atk: 20,
        def: 15,
        hp: 25,
        sp_atk: 105,
        sp_def: 55,
        speed: 90
    }
},
{
    id: 64,
    name: "Kadabra",
    type: [
        "Psychic"
    ],
    base: {
        atk: 35,
        def: 30,
        hp: 40,
        sp_atk: 120,
        sp_def: 70,
        speed: 105
    }
},
{
    id: 65,
    name: "Alakazam",
    type: [
        "Psychic"
    ],
    base: {
        atk: 50,
        def: 45,
        hp: 55,
        sp_atk: 135,
        sp_def: 95,
        speed: 120
    }
},
{
    id: 66,
    name: "Machop",
    type: [
        "Fighting"
    ],
    base: {
        atk: 80,
        def: 50,
        hp: 70,
        sp_atk: 35,
        sp_def: 35,
        speed: 35
    }
},
{
    id: 67,
    name: "Machoke",
    type: [
        "Fighting"
    ],
    base: {
        atk: 100,
        def: 70,
        hp: 80,
        sp_atk: 50,
        sp_def: 60,
        speed: 45
    }
},
{
    id: 68,
    name: "Machamp",
    type: [
        "Fighting"
    ],
    base: {
        atk: 130,
        def: 80,
        hp: 90,
        sp_atk: 65,
        sp_def: 85,
        speed: 55
    }
},
{
    id: 69,
    name: "Bellsprout",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 75,
        def: 35,
        hp: 50,
        sp_atk: 70,
        sp_def: 30,
        speed: 40
    }
},
{
    id: 70,
    name: "Weepinbell",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 90,
        def: 50,
        hp: 65,
        sp_atk: 85,
        sp_def: 45,
        speed: 55
    }
},
{
    id: 71,
    name: "Victreebel",
    type: [
        "Grass",
        "Poison"
    ],
    base: {
        atk: 105,
        def: 65,
        hp: 80,
        sp_atk: 100,
        sp_def: 70,
        speed: 70
    }
},
{
    id: 72,
    name: "Tentacool",
    type: [
        "Water",
        "Poison"
    ],
    base: {
        atk: 40,
        def: 35,
        hp: 40,
        sp_atk: 50,
        sp_def: 100,
        speed: 70
    }
},
{
    id: 73,
    name: "Tentacruel",
    type: [
        "Water",
        "Poison"
    ],
    base: {
        atk: 70,
        def: 65,
        hp: 80,
        sp_atk: 80,
        sp_def: 120,
        speed: 100
    }
},
{
    id: 74,
    name: "Geodude",
    type: [
        "Rock",
        "Ground"
    ],
    base: {
        atk: 80,
        def: 100,
        hp: 40,
        sp_atk: 30,
        sp_def: 30,
        speed: 20
    }
},
{
    id: 75,
    name: "Graveler",
    type: [
        "Rock",
        "Ground"
    ],
    base: {
        atk: 95,
        def: 115,
        hp: 55,
        sp_atk: 45,
        sp_def: 45,
        speed: 35
    }
},
{
    id: 76,
    name: "Golem",
    type: [
        "Rock",
        "Ground"
    ],
    base: {
        atk: 120,
        def: 130,
        hp: 80,
        sp_atk: 55,
        sp_def: 65,
        speed: 45
    }
},
{
    id: 77,
    name: "Ponyta",
    type: [
        "Fire"
    ],
    base: {
        atk: 85,
        def: 55,
        hp: 50,
        sp_atk: 65,
        sp_def: 65,
        speed: 90
    }
},
{
    id: 78,
    name: "Rapidash",
    type: [
        "Fire"
    ],
    base: {
        atk: 100,
        def: 70,
        hp: 65,
        sp_atk: 80,
        sp_def: 80,
        speed: 105
    }
},
{
    id: 79,
    name: "Slowpoke",
    type: [
        "Water",
        "Psychic"
    ],
    base: {
        atk: 65,
        def: 65,
        hp: 90,
        sp_atk: 40,
        sp_def: 40,
        speed: 15
    }
},
{
    id: 80,
    name: "Slowbro",
    type: [
        "Water",
        "Psychic"
    ],
    base: {
        atk: 75,
        def: 110,
        hp: 95,
        sp_atk: 100,
        sp_def: 80,
        speed: 30
    }
},
{
    id: 81,
    name: "Magnemite",
    type: [
        "Electric",
        "Steel"
    ],
    base: {
        atk: 35,
        def: 70,
        hp: 25,
        sp_atk: 95,
        sp_def: 55,
        speed: 45
    }
},
{
    id: 82,
    name: "Magneton",
    type: [
        "Electric",
        "Steel"
    ],
    base: {
        atk: 60,
        def: 95,
        hp: 50,
        sp_atk: 120,
        sp_def: 70,
        speed: 70
    }
},
{
    id: 83,
    name: "Farfetch'd",
    type: [
        "Normal",
        "Flying"
    ],
    base: {
        atk: 90,
        def: 55,
        hp: 52,
        sp_atk: 58,
        sp_def: 62,
        speed: 60
    }
},
{
    id: 84,
    name: "Doduo",
    type: [
        "Normal",
        "Flying"
    ],
    base: {
        atk: 85,
        def: 45,
        hp: 35,
        sp_atk: 35,
        sp_def: 35,
        speed: 75
    }
},
{
    id: 85,
    name: "Dodrio",
    type: [
        "Normal",
        "Flying"
    ],
    base: {
        atk: 110,
        def: 70,
        hp: 60,
        sp_atk: 60,
        sp_def: 60,
        speed: 110
    }
},
{
    id: 86,
    name: "Seel",
    type: [
        "Water"
    ],
    base: {
        atk: 45,
        def: 55,
        hp: 65,
        sp_atk: 45,
        sp_def: 70,
        speed: 45
    }
},
{
    id: 87,
    name: "Dewgong",
    type: [
        "Water",
        "Ice"
    ],
    base: {
        atk: 70,
        def: 80,
        hp: 90,
        sp_atk: 70,
        sp_def: 95,
        speed: 70
    }
},
{
    id: 88,
    name: "Grimer",
    type: [
        "Poison"
    ],
    base: {
        atk: 80,
        def: 50,
        hp: 80,
        sp_atk: 40,
        sp_def: 50,
        speed: 25
    }
},
{
    id: 89,
    name: "Muk",
    type: [
        "Poison"
    ],
    base: {
        atk: 105,
        def: 75,
        hp: 105,
        sp_atk: 65,
        sp_def: 100,
        speed: 50
    }
},
{
    id: 90,
    name: "Shellder",
    type: [
        "Water"
    ],
    base: {
        atk: 65,
        def: 100,
        hp: 30,
        sp_atk: 45,
        sp_def: 25,
        speed: 40
    }
},
{
    id: 91,
    name: "Cloyster",
    type: [
        "Water",
        "Ice"
    ],
    base: {
        atk: 95,
        def: 180,
        hp: 50,
        sp_atk: 85,
        sp_def: 45,
        speed: 70
    }
},
{
    id: 92,
    name: "Gastly",
    type: [
        "Ghost",
        "Poison"
    ],
    base: {
        atk: 35,
        def: 30,
        hp: 30,
        sp_atk: 100,
        sp_def: 35,
        speed: 80
    }
},
{
    id: 93,
    name: "Haunter",
    type: [
        "Ghost",
        "Poison"
    ],
    base: {
        atk: 50,
        def: 45,
        hp: 45,
        sp_atk: 115,
        sp_def: 55,
        speed: 95
    }
},
{
    id: 94,
    name: "Gengar",
    type: [
        "Ghost",
        "Poison"
    ],
    base: {
        atk: 65,
        def: 60,
        hp: 60,
        sp_atk: 130,
        sp_def: 75,
        speed: 110
    }
},
{
    id: 95,
    name: "Onix",
    type: [
        "Rock",
        "Ground"
    ],
    base: {
        atk: 45,
        def: 160,
        hp: 35,
        sp_atk: 30,
        sp_def: 45,
        speed: 70
    }
},
{
    id: 96,
    name: "Drowzee",
    type: [
        "Psychic"
    ],
    base: {
        atk: 48,
        def: 45,
        hp: 60,
        sp_atk: 43,
        sp_def: 90,
        speed: 42
    }
},
{
    id: 97,
    name: "Hypno",
    type: [
        "Psychic"
    ],
    base: {
        atk: 73,
        def: 70,
        hp: 85,
        sp_atk: 73,
        sp_def: 115,
        speed: 67
    }
},
{
    id: 98,
    name: "Krabby",
    type: [
        "Water"
    ],
    base: {
        atk: 105,
        def: 90,
        hp: 30,
        sp_atk: 25,
        sp_def: 25,
        speed: 50
    }
},
{
    id: 99,
    name: "Kingler",
    type: [
        "Water"
    ],
    base: {
        atk: 130,
        def: 115,
        hp: 55,
        sp_atk: 50,
        sp_def: 50,
        speed: 75
    }
},
{
    id: 100,
    name: "Voltorb",
    type: [
        "Electric"
    ],
    base: {
        atk: 30,
        def: 50,
        hp: 40,
        sp_atk: 55,
        sp_def: 55,
        speed: 100
    }
},
{
    id: 101,
    name: "Electrode",
    type: [
        "Electric"
    ],
    base: {
        atk: 50,
        def: 70,
        hp: 60,
        sp_atk: 80,
        sp_def: 80,
        speed: 150
    }
},
{
    id: 102,
    name: "Exeggcute",
    type: [
        "Grass",
        "Psychic"
    ],
    base: {
        atk: 40,
        def: 80,
        hp: 60,
        sp_atk: 60,
        sp_def: 45,
        speed: 40
    }
},
{
    id: 103,
    name: "Exeggutor",
    type: [
        "Grass",
        "Psychic"
    ],
    base: {
        atk: 95,
        def: 85,
        hp: 95,
        sp_atk: 125,
        sp_def: 75,
        speed: 55
    }
},
{
    id: 104,
    name: "Cubone",
    type: [
        "Ground"
    ],
    base: {
        atk: 50,
        def: 95,
        hp: 50,
        sp_atk: 40,
        sp_def: 50,
        speed: 35
    }
},
{
    id: 105,
    name: "Marowak",
    type: [
        "Ground"
    ],
    base: {
        atk: 80,
        def: 110,
        hp: 60,
        sp_atk: 50,
        sp_def: 80,
        speed: 45
    }
},
{
    id: 106,
    name: "Hitmonlee",
    type: [
        "Fighting"
    ],
    base: {
        atk: 120,
        def: 53,
        hp: 50,
        sp_atk: 35,
        sp_def: 110,
        speed: 87
    }
},
{
    id: 107,
    name: "Hitmonchan",
    type: [
        "Fighting"
    ],
    base: {
        atk: 105,
        def: 79,
        hp: 50,
        sp_atk: 35,
        sp_def: 110,
        speed: 76
    }
},
{
    id: 108,
    name: "Lickitung",
    type: [
        "Normal"
    ],
    base: {
        atk: 55,
        def: 75,
        hp: 90,
        sp_atk: 60,
        sp_def: 75,
        speed: 30
    }
},
{
    id: 109,
    name: "Koffing",
    type: [
        "Poison"
    ],
    base: {
        atk: 65,
        def: 95,
        hp: 40,
        sp_atk: 60,
        sp_def: 45,
        speed: 35
    }
},
{
    id: 110,
    name: "Weezing",
    type: [
        "Poison"
    ],
    base: {
        atk: 90,
        def: 120,
        hp: 65,
        sp_atk: 85,
        sp_def: 70,
        speed: 60
    }
},
{
    id: 111,
    name: "Rhyhorn",
    type: [
        "Ground",
        "Rock"
    ],
    base: {
        atk: 85,
        def: 95,
        hp: 80,
        sp_atk: 30,
        sp_def: 30,
        speed: 25
    }
},
{
    id: 112,
    name: "Rhydon",
    type: [
        "Ground",
        "Rock"
    ],
    base: {
        atk: 130,
        def: 120,
        hp: 105,
        sp_atk: 45,
        sp_def: 45,
        speed: 40
    }
},
{
    id: 113,
    name: "Chansey",
    type: [
        "Normal"
    ],
    base: {
        atk: 5,
        def: 5,
        hp: 250,
        sp_atk: 35,
        sp_def: 105,
        speed: 50
    }
},
{
    id: 114,
    name: "Tangela",
    type: [
        "Grass"
    ],
    base: {
        atk: 55,
        def: 115,
        hp: 65,
        sp_atk: 100,
        sp_def: 40,
        speed: 60
    }
},
{
    id: 115,
    name: "Kangaskhan",
    type: [
        "Normal"
    ],
    base: {
        atk: 95,
        def: 80,
        hp: 105,
        sp_atk: 40,
        sp_def: 80,
        speed: 90
    }
},
{
    id: 116,
    name: "Horsea",
    type: [
        "Water"
    ],
    base: {
        atk: 40,
        def: 70,
        hp: 30,
        sp_atk: 70,
        sp_def: 25,
        speed: 60
    }
},
{
    id: 117,
    name: "Seadra",
    type: [
        "Water"
    ],
    base: {
        atk: 65,
        def: 95,
        hp: 55,
        sp_atk: 95,
        sp_def: 45,
        speed: 85
    }
},
{
    id: 118,
    name: "Goldeen",
    type: [
        "Water"
    ],
    base: {
        atk: 67,
        def: 60,
        hp: 45,
        sp_atk: 35,
        sp_def: 50,
        speed: 63
    }
},
{
    id: 119,
    name: "Seaking",
    type: [
        "Water"
    ],
    base: {
        atk: 92,
        def: 65,
        hp: 80,
        sp_atk: 65,
        sp_def: 80,
        speed: 68
    }
},
{
    id: 120,
    name: "Staryu",
    type: [
        "Water"
    ],
    base: {
        atk: 45,
        def: 55,
        hp: 30,
        sp_atk: 70,
        sp_def: 55,
        speed: 85
    }
},
{
    id: 121,
    name: "Starmie",
    type: [
        "Water",
        "Psychic"
    ],
    base: {
        atk: 75,
        def: 85,
        hp: 60,
        sp_atk: 100,
        sp_def: 85,
        speed: 115
    }
},
{
    id: 122,
    name: "Mr. Mime",
    type: [
        "Psychic",
        "Fairy"
    ],
    base: {
        atk: 45,
        def: 65,
        hp: 40,
        sp_atk: 100,
        sp_def: 120,
        speed: 90
    }
},
{
    id: 123,
    name: "Scyther",
    type: [
        "Bug",
        "Flying"
    ],
    base: {
        atk: 110,
        def: 80,
        hp: 70,
        sp_atk: 55,
        sp_def: 80,
        speed: 105
    }
},
{
    id: 124,
    name: "Jynx",
    type: [
        "Ice",
        "Psychic"
    ],
    base: {
        atk: 50,
        def: 35,
        hp: 65,
        sp_atk: 115,
        sp_def: 95,
        speed: 95
    }
},
{
    id: 125,
    name: "Electabuzz",
    type: [
        "Electric"
    ],
    base: {
        atk: 83,
        def: 57,
        hp: 65,
        sp_atk: 95,
        sp_def: 85,
        speed: 105
    }
},
{
    id: 126,
    name: "Magmar",
    type: [
        "Fire"
    ],
    base: {
        atk: 95,
        def: 57,
        hp: 65,
        sp_atk: 100,
        sp_def: 85,
        speed: 93
    }
},
{
    id: 127,
    name: "Pinsir",
    type: [
        "Bug"
    ],
    base: {
        atk: 125,
        def: 100,
        hp: 65,
        sp_atk: 55,
        sp_def: 70,
        speed: 85
    }
},
{
    id: 128,
    name: "Tauros",
    type: [
        "Normal"
    ],
    base: {
        atk: 100,
        def: 95,
        hp: 75,
        sp_atk: 40,
        sp_def: 70,
        speed: 110
    }
},
{
    id: 129,
    name: "Magikarp",
    type: [
        "Water"
    ],
    base: {
        atk: 10,
        def: 55,
        hp: 20,
        sp_atk: 15,
        sp_def: 20,
        speed: 80
    }
},
{
    id: 130,
    name: "Gyarados",
    type: [
        "Water",
        "Flying"
    ],
    base: {
        atk: 125,
        def: 79,
        hp: 95,
        sp_atk: 60,
        sp_def: 100,
        speed: 81
    }
},
{
    id: 131,
    name: "Lapras",
    type: [
        "Water",
        "Ice"
    ],
    base: {
        atk: 85,
        def: 80,
        hp: 130,
        sp_atk: 85,
        sp_def: 95,
        speed: 60
    }
},
{
    id: 132,
    name: "Ditto",
    type: [
        "Normal"
    ],
    base: {
        atk: 48,
        def: 48,
        hp: 48,
        sp_atk: 48,
        sp_def: 48,
        speed: 48
    }
},
{
    id: 133,
    name: "Eevee",
    type: [
        "Normal"
    ],
    base: {
        atk: 55,
        def: 50,
        hp: 55,
        sp_atk: 45,
        sp_def: 65,
        speed: 55
    }
},
{
    id: 134,
    name: "Vaporeon",
    type: [
        "Water"
    ],
    base: {
        atk: 65,
        def: 60,
        hp: 130,
        sp_atk: 110,
        sp_def: 95,
        speed: 65
    }
},
{
    id: 135,
    name: "Jolteon",
    type: [
        "Electric"
    ],
    base: {
        atk: 65,
        def: 60,
        hp: 65,
        sp_atk: 110,
        sp_def: 95,
        speed: 130
    }
},
{
    id: 136,
    name: "Flareon",
    type: [
        "Fire"
    ],
    base: {
        atk: 130,
        def: 60,
        hp: 65,
        sp_atk: 95,
        sp_def: 110,
        speed: 65
    }
},
{
    id: 137,
    name: "Porygon",
    type: [
        "Normal"
    ],
    base: {
        atk: 60,
        def: 70,
        hp: 65,
        sp_atk: 85,
        sp_def: 75,
        speed: 40
    }
},
{
    id: 138,
    name: "Omanyte",
    type: [
        "Rock",
        "Water"
    ],
    base: {
        atk: 40,
        def: 100,
        hp: 35,
        sp_atk: 90,
        sp_def: 55,
        speed: 35
    }
},
{
    id: 139,
    name: "Omastar",
    type: [
        "Rock",
        "Water"
    ],
    base: {
        atk: 60,
        def: 125,
        hp: 70,
        sp_atk: 115,
        sp_def: 70,
        speed: 55
    }
},
{
    id: 140,
    name: "Kabuto",
    type: [
        "Rock",
        "Water"
    ],
    base: {
        atk: 80,
        def: 90,
        hp: 30,
        sp_atk: 55,
        sp_def: 45,
        speed: 55
    }
},
{
    id: 141,
    name: "Kabutops",
    type: [
        "Rock",
        "Water"
    ],
    base: {
        atk: 115,
        def: 105,
        hp: 60,
        sp_atk: 65,
        sp_def: 70,
        speed: 80
    }
},
{
    id: 142,
    name: "Aerodactyl",
    type: [
        "Rock",
        "Flying"
    ],
    base: {
        atk: 105,
        def: 65,
        hp: 80,
        sp_atk: 60,
        sp_def: 75,
        speed: 130
    }
},
{
    id: 143,
    name: "Snorlax",
    type: [
        "Normal"
    ],
    base: {
        atk: 110,
        def: 65,
        hp: 160,
        sp_atk: 65,
        sp_def: 110,
        speed: 30
    }
},
{
    id: 144,
    name: "Articuno",
    type: [
        "Ice",
        "Flying"
    ],
    base: {
        atk: 85,
        def: 100,
        hp: 90,
        sp_atk: 95,
        sp_def: 125,
        speed: 85
    }
},
{
    id: 145,
    name: "Zapdos",
    type: [
        "Electric",
        "Flying"
    ],
    base: {
        atk: 90,
        def: 85,
        hp: 90,
        sp_atk: 125,
        sp_def: 90,
        speed: 100
    }
},
{
    id: 146,
    name: "Moltres",
    type: [
        "Fire",
        "Flying"
    ],
    base: {
        atk: 100,
        def: 90,
        hp: 90,
        sp_atk: 125,
        sp_def: 85,
        speed: 90
    }
},
{
    id: 147,
    name: "Dratini",
    type: [
        "Dragon"
    ],
    base: {
        atk: 64,
        def: 45,
        hp: 41,
        sp_atk: 50,
        sp_def: 50,
        speed: 50
    }
},
{
    id: 148,
    name: "Dragonair",
    type: [
        "Dragon"
    ],
    base: {
        atk: 84,
        def: 65,
        hp: 61,
        sp_atk: 70,
        sp_def: 70,
        speed: 70
    }
},
{
    id: 149,
    name: "Dragonite",
    type: [
        "Dragon",
        "Flying"
    ],
    base: {
        atk: 134,
        def: 95,
        hp: 91,
        sp_atk: 100,
        sp_def: 100,
        speed: 80
    }
},
{
    id: 150,
    name: "Mewtwo",
    type: [
        "Psychic"
    ],
    base: {
        atk: 110,
        def: 90,
        hp: 106,
        sp_atk: 154,
        sp_def: 90,
        speed: 130
    }
},
{
    id: 151,
    name: "Mew",
    type: [
        "Psychic"
    ],
    base: {
        atk: 100,
        def: 100,
        hp: 100,
        sp_atk: 100,
        sp_def: 100,
        speed: 100
    }
}
]

// module.exports = { POKEMON };