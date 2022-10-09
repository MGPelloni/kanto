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
            "\n %c %c %c Kanto Engine v" + VERSION + " %c  %c  " + message + "  %c \n",
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
        window.console.log("Kanto Engine - " + message);
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

const saveTemplateAsFile = (filename, dataObjToWrite) => {
    const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
    const link = document.createElement("a");

    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

    const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });

    link.dispatchEvent(evt);
    link.remove()
};

const move_element_in_array = (arr, from, to) => {
	if (Object.prototype.toString.call(arr) !== '[object Array]') {
		throw new Error('Please provide a valid array.');
	}

	var item = arr.splice(from, 1);

	if (!item.length) {
		throw new Error('There is no item in the array at index ' + from);
	}

	arr.splice(to, 0, item[0]);
};
