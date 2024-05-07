// 半角英数字を全角に変換する関数
function toFullWidth(str) {
    return str.replace(/[A-Za-z0-9!-~]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    }).replace(/ /g, '　');
}

module.exports = toFullWidth;