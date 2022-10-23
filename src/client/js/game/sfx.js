class Sfx {
    constructor() {
        this.path = '../assets/audio/sfx/misc';
        this.enabled = false;
        this.tracks = {};
        this.timeout = 300;

        this.preload_tracks = ['collision', 'start-menu', 'action', 'go-inside', 'go-outside', 'item-found'];
    }

    play(name) {
        if (!this.enabled) {
            return;
        }

        if (!this.tracks[name]) {
            this.load(name);
        }

        if (!this.tracks[name].active) {
            this.tracks[name].active = true;     
            this.tracks[name].play();
    
            setTimeout(() => {
                this.tracks[name].active = false;
            }, this.timeout, name);
        }
    }

    load(name) {
        this.tracks[name] = new Howl({
            src: [`${this.path}/${name}.wav`],
            loop: false,
            volume: 0.5
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