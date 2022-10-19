class Chat {
    constructor(lobby_id) {
        this.lobby_id = lobby_id;
        this.messages = [];
        this.pattern = "^[^<>/]*$";
        this.regex = new RegExp(this.pattern);
        
        // @link https://github.com/MauriceButler/badwords/blob/master/array.js
        this.banned_words =  ["fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "gaylord", "n1gga", "n1gger", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "retard"];
    }

    trainer_message(trainer, message) {
        if (this.test_message(message)) {
            this.messages.push(`${trainer.name}: ${message}`);

            let atts = {
                color: trainer.color
            }

            io.to(this.lobby_id).emit('chat_trainer_message', {
                name: trainer.name,
                message: message,
                atts: atts
            });
        }
    }

    server_message(message) {
        this.messages.push(`Server: ${message}`);

        io.to(this.lobby_id).emit('chat_server_message', {
            message: message
        });
    }

    direct_message(socket_id, message) {
        io.to(socket_id).emit('chat_server_message', {
            message: message
        }); 
    }

    test_message(message) {
        // HTML check
        if (!this.regex.test(message)) {
            return false;
        }

        // Banned words check
        let banned_word_present = false;
        this.banned_words.forEach(word => {
            if (message.includes(word)) {
                banned_word_present = true;
            }
        });

        if (banned_word_present) {
            return false;
        }

        return true;
    }

    edit_message() {

    }

    delete_message() {

    }

    sync() {

    }
}