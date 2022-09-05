class Sfx {
    constructor() {
        this.enabled = false;
        this.library = {};
        this.path = '../assets/audio/sfx/misc';
        this.timeout = 300;
        this.active = false;
    }

    play(name) {
        if (this.enabled && !this.active) {
            this.active = true;

            if (!this.library[name]) {
                this.library[name] = new Howl({
                    src: [`${this.path}/${name}.wav`],
                    loop: false,
                    volume: 1
                })
            }
                
            this.library[name].play();

            setTimeout(() => {
                this.active = false;
            }, this.timeout)
        }
    }
}