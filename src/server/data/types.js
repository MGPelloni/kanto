const TYPES = [{
        name: "Normal",
        effective: [],
        ineffective: ["Rock", "Steel"],
        no_effect: ["Ghost"]
    },
    {
        name: "Fighting",
        effective: ["Normal", "Ice", "Rock"],
        ineffective: ["Poison", "Flying", "Psychic", "Bug"],
        no_effect: ["Ghost"],
    },
    {
        name: "Flying",
        effective: ["Grass", "Fighting", "Bug"],
        ineffective: ["Electric", "Rock", "Steel"],
        no_effect: [],
    },
    {
        name: "Poison",
        effective: ["Grass"],
        ineffective: ["Poison", "Ground", "Rock", "Ghost"],
        no_effect: []
    },
    {
        name: "Ground",
        effective: ["Fire", "Electric", "Poison", "Rock"],
        ineffective: ["Grass", "Bug"],
        no_effect: ["Flying"],
    },
    {
        name: "Rock",
        effective: ["Fire", "Ice", "Flying", "Bug"],
        ineffective: ["Fighting", "Ground"],
        no_effect: []
    },
    {
        name: "Bug",
        effective: ["Grass", "Psychic"],
        ineffective: ["Fire", "Fighting", "Poison", "Flying", "Ghost"],
        no_effect: []
    },
    {
        name: "Ghost",
        effective: ["Psychic", "Ghost"],
        ineffective: [],
        no_effect: ["Normal"]
    },
    {
        name: "Fire",
        effective: ["Grass", "Ice", "Bug", "Steel"],
        ineffective: ["Fire", "Water", "Rock", "Dragon"],
        no_effect: []
    },
    {
        name: "Water",
        effective: ["Fire", "Ground", "Rock"],
        ineffective: ["Water", "Grass", "Dragon"],
        no_effect: []
    },
    {
        name: "Grass",
        effective: ["Water", "Ground", "Rock"],
        ineffective: ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon"],
        no_effect: []
    },
    {
        name: "Electric",
        effective: ["Water", "Flying"],
        ineffective: ["Electric", "Grass", "Dragon"],
        no_effect: ["Ground"]
    },
    {
        name: "Psychic",
        effective: ["Fighting", "Poison"],
        ineffective: ["Psychic"],
        no_effect: []
    },
    {
        name: "Ice",
        effective: ["Grass", "Ground", "Flying", "Dragon"],
        ineffective: ["Fire", "Water", "Ice"],
        no_effect: []
    },
    {
        name: "Dragon",
        effective: ["Dragon"],
        ineffective: [],
        no_effect: []
    }
]