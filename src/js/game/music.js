class Music {
    constructor() {
        this.enabled = false;
        this.path = '../assets/audio/music';
        this.current_track = {
            howl: null,
            id: null,
        }
        this.next_track = {
            howl: null,
            id: null,
        }
    }

    play(num) {
        if (!this.enabled) {
            return;
        }

        if (!num || num == 0) { // No track selected
            this.current_track.howl.fade(this.current_track.howl.volume(), 0, 1500);
        }

        let track = new Howl({
            src: [`${this.path}/${num}.mp3`],
            loop: true,
            volume: 0.5
        });
        
        if (this.current_track.id === null) {
            this.current_track.howl = track;
            this.current_track.id = num;
            this.current_track.howl.play();
        } else if (this.next_track.id === null && this.current_track.id !== num) {
            
            // Enqueueing the next track
            this.next_track.howl = track;
            this.next_track.id = num;

            // Fading the playing track out
            this.current_track.howl.fade(this.current_track.howl.volume(), 0, 1500);

            // Setting the current track to tne enqueued track and clearing the next track
            setTimeout(() => {
                this.current_track = this.next_track;
                this.current_track.howl.play();

                this.next_track = {
                    id: null,
                    howl: null
                }
            }, 1500)
        }
    }
}

document.querySelector('.toggle-volume').addEventListener('click', e => {
    if (!music.enabled) {
        enable_audio();
    }

    if (Howler._muted) {
        Howler.mute(false);
        document.querySelector('.toggle-volume').classList.remove('-muted');
    } else {
        Howler.mute(true)
        document.querySelector('.toggle-volume').classList.add('-muted');
    }
});

function enable_audio() {
    music.enabled = true;
    sfx.enabled = true;
    music.play(map.music);
}