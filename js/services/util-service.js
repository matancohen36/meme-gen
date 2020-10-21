function makeId() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var txt = '';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key);
    return JSON.parse(val)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function _createMapById(items) {
    const map = items.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
    }, {});
    return map;
}
function _createMapByIdOlder(items) {
    const map = {};
    items.forEach(item => {
        map[item.id] = item;
    });
    return map;
}