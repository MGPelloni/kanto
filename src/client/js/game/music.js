class Music {
    constructor() {
        this.path = '../assets/audio/music';
        this.enabled = false;
        this.tracks = {};
        this.current_track = null;
        this.next_track = null;
        this.fading = false;
        this.preload_tracks = [25, 32, 13] // Encounter, Cycling, Battle
        
        // Looping music
        this.track_loops = {};
        this.loop_interval = null;
        this.set_track_loops();
    }

    load(num) {
        if (!this.enabled) {
            return;
        }

        this.tracks[num] = new Howl({
            src: [`${this.path}/${num}.mp3`],
            loop: true,
            volume: 0.5
        });
    }

    heartbeat() {
        let current_position = music.tracks[music.current_track].seek();
        // console.log(current_position);

        if (music.track_loops[music.current_track]) {
            // console.log('Loop start', music.track_loops[music.current_track].start);
            // console.log('Loop end', music.track_loops[music.current_track].end);
    
            if (current_position > music.track_loops[music.current_track].end) {
                music.tracks[music.current_track].seek(music.track_loops[music.current_track].start);
            }
        }
    }

    play(num) {
        if (!this.enabled) {
            return;
        }

        // Loading
        if (!this.tracks[num]) {
            this.load(num);
        }

        this.next_track = num;

        // New music incoming, fade out
        if (this.current_track && this.current_track !== this.next_track) {
            this.tracks[this.current_track].fade(this.tracks[this.current_track].volume(), 0, 1500);
            this.fade_out_track = this.current_track;

            if (!this.fading) {
                setTimeout(() => {
                    if (this.fade_out_track == this.current_track) { // Music played between fade out and this
                        music.stop();
                        music.tracks[music.next_track].volume(0.5);
                        music.tracks[music.next_track].play();
                        music.current_track = music.next_track;
                        music.fading = false;
                    } else {
                        music.tracks[music.fade_out_track].stop();
                    }
                }, 1500);

                this.fading = true;
            }
        } else { // First song
            this.current_track = num;
            this.tracks[num].play();
        }

        if (this.loop_interval) {
            clearInterval(this.loop_interval);
        }
        
        if (this.track_loops[this.current_track]) { // Loop data available
            this.loop_interval = setInterval(music.heartbeat, 100);
        }
    }

    immediate_play(num) {
        this.current_track = num;

        if (!this.enabled) {
            return;
        }

        // Loading
        if (!this.tracks[num]) {
            this.load(num);
        }
        
        this.stop();
        this.tracks[num].play();
    }

    stop() {
        Object.entries(this.tracks).forEach(([key, howl]) => {
            howl.stop();
        });
    }

    enable() {
        Howler.mute(false);
        this.enabled = true;

        if (!this.current_track) {
            this.current_track = map.music;
        }

        this.play(this.current_track);

        // Load event tracks
        if (!this.tracks[this.preload_tracks[0]]) {
            this.preload_tracks.forEach(track => {
                this.load(track);
            });
        }
    }

    get_context() {
        if (player.speed == 2) {
            return 32;
        }

        return map.music;
    }

    disable() {
        Howler.mute(true);
        this.enabled = false;
        this.stop();
        clearInterval(this.loop_interval);
    }

    set_track_loops() {
        this.track_loops[13] = {
            start: 44.4,
            end: 75.688
        }

        this.track_loops[14] = {
            start: 12.35,
            end: 34.80799999999999,
        }

        this.track_loops[16] = {
            start: 0,
            end: 57.8
        }

        this.track_loops[25] = {
            start: 1.4653333333333336,
            end: 20.1
        }

        this.track_loops[26] = {
            start: 0,
            end: 83.3933
        }

        this.track_loops[28] = {
            start: 2.3,
            end: 61.672
        }

        this.track_loops[32] = {
            start: 34.55733333333333,
            end: 68.81066666666666
        }

        this.track_loops[37] = {
            start: 1.7893333333333317,
            end: 68.63066666666665
        }
    }
}