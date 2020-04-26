class Message {
    constructor(text, speed = 3) {
      this.text = text;
      this.index = 0;
      this.tick = 0;
      this.speed = speed;
      this.length = text.length;
      this.words = text.split(' ');
      this.rows = [];
      this.current_row = 0;
      this.previous_row = 0;
      this.generate_rows();
    }
    
    next_word() {
        var next_word = null;
        var length_track = 0;
        this.words.forEach(word => {
            length_track += word.length;
            if (length_track >= this.index + word.length && next_word == null) {
                next_word = word;
            }
        });
        return next_word;
    }

    next_row() {
        this.previous_row += this.rows[this.current_row].length + 1;
        this.current_row++;
        var p = document.createElement('p');
        message_elem.appendChild(p);
        var row_height = message_elem.offsetHeight / 2;
        var transform = (row_height * this.current_row) - (row_height);
        message_elem.style.transform = 'translateY(-' + transform + 'px)';
        document.getElementById('message-caret').style.display = '';
    }

    generate_rows() {
        var length_track = 0;
        var line = [];

        this.words.forEach(word => {
            length_track += word.length + 1;

            if (length_track >= Game.message_meta.row_limit) {
                this.rows.push(line.join(" "));
                line = [];
                length_track = 0;
                length_track += word.length;
            }

            line.push(word);
        });       

        if (line) {
            this.rows.push(line.join(" "));
        }
    }
}