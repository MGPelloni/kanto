class Dialogue {
    constructor() {
        this.queue = [];
        this.msg = null;
        this.ticker = null;
        this.text = null;
        this.active = false;
        this.speed = 3;
        this.arrow = {
            animation: 0,
            mask: message_container.getChildByName('message_arrow'),
        }
        this.disable_next = false;
        this.awaiting_action = false;
    }

    add_message(text) {
        this.active = true;
        this.msg = new Message(text);
        player.frozen = true;
        message_container.visible = true;
        message_text.text = '';
        write_game_text();
    }

    queue_messages(messages) {
        if (Array.isArray(messages)) { // Check for multiple messages
            this.queue = [...messages]; 
        } else {
            this.queue = [messages];
        }
        
        this.process_queue();
    }

    process_queue() {
        if (this.queue.length > 0) {
            this.add_message(this.queue[0]);
            this.queue.shift();
        }
    }

    next() {
        if (this.awaiting_action && !this.disable_next) {
            if (this.msg == null && this.queue.length == 0) { // Message is complete
                message_container.visible = false;
                message_text.text = '';
                player.frozen = false;
                npcs.forEach(npc => {
                    npc.frozen = false;
                });
                
                setTimeout(() => {
                    this.active = false;
                }, 600);
                
            } else if (this.msg == null && this.queue.length > 0) {
                this.process_queue();
            } else {
                sfx.play('action');
                this.msg.next_row();
            }

            this.awaiting_action = false;
        }
    }
}

class Message {
    constructor(text) {
      this.text = text;
      this.index = 0;
      this.tick = 0;
      this.row_limit = 18;
      this.length = text.length;
      this.words = text.split(' ');
      this.rows = [];
      this.current_row = 0;
      this.read_characters = 0;
      this.animation = {
        active: false,
        keyframes: [
            12.5,
            8,
            18,
        ],
        tick: 0,
        arrow: time(),
      };

        this.generate_rows();
        this.text = this.text.replace(/;/g, '');
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
        let next_row = this.rows[(this.current_row + 1)];

        if (this.current_row > 0 && this.current_row < this.rows.length - 1) {
            this.animation.active = true;
            this.animation.tick = 0;
        }

        if (next_row) {
            this.read_characters += this.rows[this.current_row].length + 1;
            this.current_row++;
            dialogue.arrow.mask.visible = true;
            dialogue.arrow.animation = 0;
        }
    }

    generate_rows() {
        let length_track = 0,
            line = [],
            move_to_next_line = false;

        this.words.forEach(word => {
            if (word.includes(';')) {
                word = word.replace(';', '');
                move_to_next_line = true;
            }

            if (/[.,:!?]/.test(word.charAt(word.length - 1))) { // If the word is the ending of a sentence
                length_track += word.length;
            } else {
                length_track += word.length + 1;
            }

            if (length_track > this.row_limit) {
                this.rows.push(line.join(" "));
                line = [];
                length_track = 0;

                if (/[.,:!?]/.test(word.charAt(word.length - 1))) { // If the word is the ending of a sentence
                    length_track += word.length;
                } else {
                    length_track += word.length + 1;
                }
            }

            line.push(word);

            if (move_to_next_line) {
                length_track = this.row_limit;
                move_to_next_line = false;
            }
        });       

        if (line) {
            this.rows.push(line.join(" "));
        }
    }
}

function write_game_text() {
    // Animate to a new line
    if (dialogue.msg.animation.active) {
        animate_game_text();
        requestAnimationFrame(write_game_text);
        return;
    }

    if (dialogue.msg) {
        dialogue.msg.tick++;

        if (keys["88"]) {
            dialogue.speed = 1.5;
        } else {
            dialogue.speed = 3;
        }
        
        if (dialogue.msg.index > dialogue.msg.length) { // If we've reached the end of the message
            dialogue.msg = null;
            dialogue.awaiting_action = true;
            dialogue.disable_next = true;

            setTimeout(() => {
                dialogue.disable_next = false;
            }, 300);
            cancelAnimationFrame(write_game_text);
            return;
        } else { // ..otherwise, type out the message by letter.
            dialogue.text = dialogue.msg.text.slice(0 + dialogue.msg.read_characters, dialogue.msg.index);
            if (dialogue.msg.rows[dialogue.msg.current_row - 1]) {
                message_text.text = dialogue.msg.rows[dialogue.msg.current_row - 1] + '\n' + dialogue.text;  
            } else {
                message_text.text = dialogue.text;  
            }

            message_text.y = dialogue.msg.animation.keyframes[2];
        }
    }
    
    
    if (dialogue.msg) {
        if (dialogue.msg.tick > dialogue.speed) {
            dialogue.msg.tick = 0;
    
            let current_row = dialogue.msg.rows[dialogue.msg.current_row];
            
            if (current_row.length + dialogue.msg.read_characters >= dialogue.text.length + dialogue.msg.read_characters) {
                dialogue.msg.index++; // Add a character to the message
            } else if (dialogue.msg.index == dialogue.msg.rows[dialogue.msg.current_row].length + dialogue.msg.read_characters + 1) {
                if (dialogue.msg.current_row == 0) { // If it's the first row, automatically move to the second row.
                    dialogue.msg.next_row();
                } else { // Await user input to move to next row
                    dialogue.awaiting_action = true; 
                    animate_arrow(dialogue.msg.tick);
                }
            }
        }    
    }

    requestAnimationFrame(write_game_text);
}

function animate_game_text() {
    dialogue.msg.animation.tick++;

    if (dialogue.msg.animation.tick > 6) {
        dialogue.msg.animation.active = false;
    } else if (dialogue.msg.animation.tick > 4) {
        message_text.y = dialogue.msg.animation.keyframes[1];
    } else if (dialogue.msg.animation.tick > 2) {
        message_text.y = dialogue.msg.animation.keyframes[0];
    }
}

function animate_arrow() {
    let cur_time = time();

    if (dialogue.arrow.animation == 0) {
        dialogue.arrow.mask.visible = false;
        dialogue.arrow.animation = cur_time;
    }

    if (cur_time > dialogue.arrow.animation + 500) {
        if (dialogue.arrow.mask.visible) {
            dialogue.arrow.mask.visible = false;
        } else {
            dialogue.arrow.mask.visible = true;
        }

        dialogue.arrow.animation = cur_time;
    }
}