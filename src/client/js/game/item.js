class Item {
    constructor(name = 'Untitled Item', type = 'Special') {
        this.name = name;
        this.type = type;
    }

    use() {
        console.log(`Using ${this.name}`);
    }
}