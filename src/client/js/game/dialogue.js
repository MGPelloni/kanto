class Dialogue {
    constructor() {
        this.queue = [];
        this.msg = null;
        this.ticker = null;
        this.text = null;
        this.active = false;
        this.cooldown = false;
        this.speed = 3;
        this.arrow = {
            animation: 0,
            mask: message_container.getChildByName('message_arrow'),
        }
        this.disable_next = false;
        this.awaiting_action = false;
        this.option_prompt_active = false;
    }

    add_message(message) {
        let queued_message = '';
        let queued_options = [];
        
        if (typeof message === 'object') {
            if (message.text) {
                queued_message = message.text
            }

            if (message.options) {
                queued_options = message.options;
            }

            if (message.pre_callback) {
                if (typeof window[message.pre_callback.name] === "function") { 
                    window[message.pre_callback['name']](message.pre_callback['args']);
                }
            }

            if (message.post_callback) {
                this.post_callback = message.post_callback;
            }
        } else if (typeof message === 'string') { // Legacy
            queued_message = message;
        }
        
        if (typeof message === 'object' && !message.text && !message.options && !message.post_callback) { // Message only contains a pre-callback
            return;
        }

        this.active = true;
        this.msg = new Message(queued_message, queued_options);
        player.frozen = true;
        message_container.visible = true;
        message_text.text = '';
        write_game_text();
    }

    queue_messages(messages) {
        if (Array.isArray(messages)) { // Check for multiple messages
            this.queue.push(...messages); 
        } else {
            this.queue.push(messages);
        }
        
        this.process_queue();
    }

    analyze_queue() {
        // Check to see if any conditional is met
        let new_queue = [];
        
        this.queue.forEach((message) => {
            if (!message.conditionals) {
                new_queue.push(message);
                return;
            }

            let conditionals_met = 0,
                conditionals_required = message.conditionals.length;
            
            message.conditionals.forEach(conditional => {
                switch (conditional.name) {
                    case 'has_item':
                        if (conditional.value == 'true' || conditional.value === undefined) {
                            player.items.forEach(item => {
                                if (item.name == conditional.key) {
                                    conditionals_met++;
                                }
                            });
                        } else if (conditional.value == 'false') {
                            let item_found = false;
                            player.items.forEach(item => {
                                if (item.name == conditional.key) {
                                    item_found = true;
                                }
                            });

                            if (!item_found) {
                                conditionals_met++;
                            }
                        }
                        break;
                    case 'has_flag':
                        if (conditional.value == 'false') {
                            if (!player.flags.has(conditional.key)) {
                                conditionals_met++;
                            }
                        } else {
                            if (player.flags.has(conditional.key) && player.flags.get(conditional.key) == conditional.value) {
                                conditionals_met++;
                            }
                        }
                        break;
                    case 'has_money':
                        if (conditional.value == 'false') {
                            if (player.money < conditional.key) {
                                conditionals_met++;
                            }
                        } else if (player.money >= conditional.key) {
                            conditionals_met++;
                        }
                        break;
                    default:
                        break;
                }
            });

            if (conditionals_met == conditionals_required) {
                new_queue.push(message);
            }
        }); 

        this.queue = new_queue;
    }

    process_queue() {
        this.analyze_queue();

        if (this.queue.length > 0) {
            this.add_message(this.queue[0]);
            this.queue.shift();
        }
    }

    next() {
        if (this.awaiting_action && !this.disable_next) {
            if (this.msg == null && this.queue.length == 0) { // Message is complete
                if (!player.in_battle) {
                    message_container.visible = false;
                    player.frozen = false;
                }
                
                message_text.text = '';
                npcs.forEach(npc => {
                    npc.frozen = false;
                });

                if (this.post_callback) {
                    if (typeof window[this.post_callback.name] === "function") { 
                        window[this.post_callback['name']](this.post_callback['args']);
                    }

                    this.post_callback = null;
                }

                dialogue.cooldown = true;
                 
                setTimeout(() => {
                    if (dialogue.queue.length == 0) {
                        dialogue.cooldown = false;
                        dialogue.active = false;
                    }
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

    open_option_prompt(options) {
        let dialogue_menu = null,
        menu_index = null;

        this.queued_options = options;
    
        menus.forEach((menu, i) => {
            if (menu.name == 'Dialogue') {
                dialogue_menu = menu;
                menu_index = i;
            }
        });
    
        if (dialogue_menu) {
            let prepared_options = [];

            options.forEach(option => {
                prepared_options.push({
                    name: option.option
                });
            });

            dialogue_menu.update_options(prepared_options);

            menu_container.visible = true;
            dialogue_menu.reset();
            dialogue_menu.open();
            player.menu.history.push(menu_index);
            player.menu.current = menu_index;
            player.menu.active = true;
            player.controls = 'menu';
            this.option_prompt_active = true;
        }
    }

    selected_option(selected_option) {
        if (this.queued_options && !this.disable_next) {
            this.queued_options.forEach(dialogue_option => {
                if (dialogue_option.option == selected_option) {
                    this.awaiting_action = false;
                    this.option_prompt_active = false;
                    sfx.play('action');
                    kanto_close_menus();

                    this.queue_messages(dialogue_option.dialogue);
                }
            })
        }
    }
}

class Message {
    constructor(text, options = []) {
      this.text = text;
      this.options = options;
      this.index = 0;
      this.tick = 0;
      this.row_limit = 17;
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
    if (dialogue.msg) {
        if (dialogue.msg.animation.active) {
            animate_game_text();
            // requestAnimationFrame(write_game_text);
            // meep_var = setInterval(write_game_text, 1000 / 2);
            return;
        }
    }

    if (dialogue.msg) {
        dialogue.msg.tick++;

        if (keys["88"]) {
            dialogue.speed = 1.5;
        } else {
            dialogue.speed = 3;
        }
        
        if (dialogue.msg.index > dialogue.msg.length) { // If we've reached the end of the message
            if (dialogue.msg.options.length > 0) { // Option fork, we have to wait for user input
                dialogue.open_option_prompt(dialogue.msg.options);
            }

            dialogue.msg = null;
            dialogue.awaiting_action = true;
            dialogue.disable_next = true;

            setTimeout(() => {
                dialogue.disable_next = false;
            }, 300);
            // cancelAnimationFrame(write_game_text);
            clearInterval(dialogue.interval_id);
            dialogue.interval_id = null;

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

    // requestAnimationFrame(write_game_text);
    if (!dialogue.interval_id) {
        dialogue.interval_id = setInterval(write_game_text, 1000 / FPS);
    }
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