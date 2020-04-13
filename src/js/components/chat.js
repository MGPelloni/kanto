kanto_console('Loaded: chat.js');

function game_chat(message) {
    document.querySelector('#chat-feed').innerHTML += (`<p class="game-chat-message">${message}</p>`);
}