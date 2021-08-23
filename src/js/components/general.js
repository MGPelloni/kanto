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
            "\n %c %c %c Kanto v" + VERSION + " %c  %c  " + message + "  %c \n",
            'background: #cedae6; padding:5px 0;',
            'background: #cedae6; padding:5px 0;',
            'color: #cedae6; background: #030307; padding:5px 0;',
            'background: #cedae6; padding:5px 0;',
            'color: #2f2f2f; background: #fff; padding:5px 0;',
            'background: #cedae6; padding:5px 0;',
            ];
        (_a = window.console).log.apply(_a, args);
    }
    else if (window.console) {
        window.console.log("Kanto.chat 1.0.0 - " + message);
    }
}

function time() {
    return Date.now();
}

function parse_query_string() {
    const url = window.location.search;
    const paramsString = url.split('?')[1];
    const searchParams = new URLSearchParams(paramsString);
    return searchParams;
}