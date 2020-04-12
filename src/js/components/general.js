/**
 * A console.log that follows pixi.js's styling.
 *
 * @static
 * @param {string} message - The string message.
 * @param {string} type - The string renderer type.
 */
function kanto_console(message, type) {
    var _a;
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        var args = [
            "\n %c %c %c Kanto.chat v1.0.0 %c  %c  " + message + "  %c \n",
            'background: #ff66a5; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'color: #ff66a5; background: #030307; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            'color: #ff2424; background: #fff; padding:5px 0;',
            'background: #ffc3dc; padding:5px 0;',
            'background: #ff66a5; padding:5px 0;',
            ];
        (_a = window.console).log.apply(_a, args);
    }
    else if (window.console) {
        window.console.log("Kanto.chat 1.0.0 - " + message);
    }
}