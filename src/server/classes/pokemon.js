class Pokemon {
    constructor(id, level) {
        let index = id - 1;
        Object.assign(this, POKEMON[index]); // Pokemon base data
        this.level = level;
    }
}