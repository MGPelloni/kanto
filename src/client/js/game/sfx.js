class Sfx {
    constructor() {
        this.path = '../assets/audio/sfx';
        this.enabled = false;
        this.tracks = {};
        this.timeout = 300;

        this.preload_tracks = ['collision', 'start-menu', 'action', 'go-inside', 'go-outside', 'item-found'];
    }

    play(name, type = 'misc') {
        if (!this.enabled) {
            return;
        }

        if (!this.tracks[name]) {
            this.load(name, type);
        }

        if (!this.tracks[name].active) {
            this.tracks[name].active = true;     
            this.tracks[name].play();
     
            setTimeout(() => {
                this.tracks[name].active = false;
            }, this.timeout, name);
        }
    }

    cry(id) {
        let cry = '';

        if (typeof id === "number") {
            id = id.toString();
        }
        
        switch (id.length) {
            case 1:
                cry = `00${id}`;
                break;
            case 2: 
                cry = `0${id}`;
                break;
            default:
                cry = id;
                break;
        }

        this.play(cry, 'cries');
    }

    load(name, type = 'misc') {
        if (!this.enabled) {
            return;
        }

        let volume = 0.5;

        if (name == 'item-received' || name == 'item-found') {
            volume = 0.2;
        }

        this.tracks[name] = new Howl({
            src: [`${this.path}/${type}/${name}.wav`],
            loop: false,
            volume: volume
        });
    }

    stop() {
        Object.entries(this.tracks).forEach(([key, howl]) => {
            howl.stop();
        });
    }
  
    enable() {
        this.enabled = true;

        // Load event tracks
        if (!this.tracks[this.preload_tracks[0]]) {
            this.preload_tracks.forEach(track => {
                this.load(track);
            });
        }
    }

    disable() {
        this.enabled = false;
    }
}