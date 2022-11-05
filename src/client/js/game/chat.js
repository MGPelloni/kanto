class Chat {
    constructor() {
        this.messages = [];
        this.cooldown = false;
        this.pattern = "^[^<>/]*$";
        this.regex = new RegExp(this.pattern);
        this.feed = document.querySelector('#chat-feed');
        this.enabled = true;
    }

    trainer_message(name, message, atts) {
        if (!chat.enabled) {
            return false;
        }
        
        this.messages.push(`${name}: ${message}`);

        let chat_element = document.createElement('p');
        chat_element.innerHTML = `<span style="color: ${atts.color}">${name}:</span> ${message}`;

        this.feed.appendChild(chat_element);
        this.feed.scrollTop = this.feed.scrollHeight
    }

    server_message(message) {
        if (!chat.enabled) {
            return false;
        }

        this.messages.push(`Server: ${message}`);

        let chat_element = document.createElement('p');
        chat_element.classList.add('-lobby-notice');
        chat_element.innerHTML = `${message}`;

        this.feed.appendChild(chat_element);
        this.feed.scrollTop = this.feed.scrollHeight
    }

    emit_message(message) {
        if (!chat.enabled) {
            return false;
        }
        
        if (this.validate_message(message)) {
            socket.emit('chat_add_message', {lobby_id: lobby_id, message: message});
        }
    }

    validate_message(message) {
        return this.regex.test(message);
    }
}