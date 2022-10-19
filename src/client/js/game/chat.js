class Chat {
    constructor() {
        this.messages = [];
        this.cooldown = false;
        this.pattern = "^[^<>/]*$";
        this.regex = new RegExp(this.pattern);
        this.feed = document.querySelector('#chat-feed');
    }

    trainer_message(name, message, atts) {
        this.messages.push(`${name}: ${message}`);

        let chat_element = document.createElement('p');
        chat_element.innerHTML = `<span style="color: ${atts.color}">${name}:</span> ${message}`;

        this.feed.appendChild(chat_element);
        this.feed.scrollTop = this.feed.scrollHeight
    }

    server_message(message) {
        this.messages.push(`Server: ${message}`);

        let chat_element = document.createElement('p');
        chat_element.classList.add('-lobby-notice');
        chat_element.innerHTML = `${message}`;

        this.feed.appendChild(chat_element);
        this.feed.scrollTop = this.feed.scrollHeight
    }

    emit_message(message) {
        if (this.test_message(message)) {
            socket.emit('chat_add_message', {lobby_id: meta.lobby_id, message: message});
        }
    }

    test_message(message) {
        return this.regex.test(message);
    }
}


// document.querySelector('#kanto-view-chat').addEventListener('click', e => {
//     document.querySelector('body').classList.toggle('-chat-active');
// });