const ACCENT_MAP = { a: 'áàäâ', e: 'éèëê', i: 'íìïî', o: 'óòöô', u: 'úùüû', n: 'ñ' };

function slugify(text) {
    let result = String(text || '').toLowerCase();
    Object.keys(ACCENT_MAP).forEach((plain) => {
        ACCENT_MAP[plain].split('').forEach((accented) => {
            result = result.split(accented).join(plain);
        });
    });
    return result.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function todayDisplay() {
    const d = new Date();
    return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
}

function newTimestamp() {
    return Date.now();
}

module.exports = { slugify, todayDisplay, newTimestamp };
