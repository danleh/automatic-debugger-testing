var hexcase = 0;
var b64pad = '';
var chrsz = 8;
function hex_md5(a) {
    return binl2hex(core_md5(str2binl(a), a.length * chrsz));
}
function b64_md5(a) {
    return binl2b64(core_md5(str2binl(a), a.length * chrsz));
}
function str_md5(a) {
    return binl2str(core_md5(str2binl(a), a.length * chrsz));
}
function hex_hmac_md5(a, b) {
    return binl2hex(core_hmac_md5(a, b));
}
function b64_hmac_md5(a, b) {
    return binl2b64(core_hmac_md5(a, b));
}
function str_hmac_md5(a, b) {
    return binl2str(core_hmac_md5(a, b));
}
function md5_vm_test() {
    return hex_md5('abc') == '900150983cd24fb0d6963f7d28e17f72';
}
function core_md5(e, g) {
    e[g >> 5] |= 128 << g % 32;
    e[(g + 64 >>> 9 << 4) + 14] = g;
    var b = 1732584193;
    var c = -271733879;
    var d = -1732584194;
    var a = 271733878;
    for (var f = 0; f < e.length; f += 16) {
        var i = b;
        var j = c;
        var k = d;
        var h = a;
        b = md5_ff(b, c, d, a, e[f + 0], 7, -680876936);
        a = md5_ff(a, b, c, d, e[f + 1], 12, -389564586);
        d = md5_ff(d, a, b, c, e[f + 2], 17, 606105819);
        c = md5_ff(c, d, a, b, e[f + 3], 22, -1044525330);
        b = md5_ff(b, c, d, a, e[f + 4], 7, -176418897);
        a = md5_ff(a, b, c, d, e[f + 5], 12, 1200080426);
        d = md5_ff(d, a, b, c, e[f + 6], 17, -1473231341);
        c = md5_ff(c, d, a, b, e[f + 7], 22, -45705983);
        b = md5_ff(b, c, d, a, e[f + 8], 7, 1770035416);
        a = md5_ff(a, b, c, d, e[f + 9], 12, -1958414417);
        d = md5_ff(d, a, b, c, e[f + 10], 17, -42063);
        c = md5_ff(c, d, a, b, e[f + 11], 22, -1990404162);
        b = md5_ff(b, c, d, a, e[f + 12], 7, 1804603682);
        a = md5_ff(a, b, c, d, e[f + 13], 12, -40341101);
        d = md5_ff(d, a, b, c, e[f + 14], 17, -1502002290);
        c = md5_ff(c, d, a, b, e[f + 15], 22, 1236535329);
        b = md5_gg(b, c, d, a, e[f + 1], 5, -165796510);
        a = md5_gg(a, b, c, d, e[f + 6], 9, -1069501632);
        d = md5_gg(d, a, b, c, e[f + 11], 14, 643717713);
        c = md5_gg(c, d, a, b, e[f + 0], 20, -373897302);
        b = md5_gg(b, c, d, a, e[f + 5], 5, -701558691);
        a = md5_gg(a, b, c, d, e[f + 10], 9, 38016083);
        d = md5_gg(d, a, b, c, e[f + 15], 14, -660478335);
        c = md5_gg(c, d, a, b, e[f + 4], 20, -405537848);
        b = md5_gg(b, c, d, a, e[f + 9], 5, 568446438);
        a = md5_gg(a, b, c, d, e[f + 14], 9, -1019803690);
        d = md5_gg(d, a, b, c, e[f + 3], 14, -187363961);
        c = md5_gg(c, d, a, b, e[f + 8], 20, 1163531501);
        b = md5_gg(b, c, d, a, e[f + 13], 5, -1444681467);
        a = md5_gg(a, b, c, d, e[f + 2], 9, -51403784);
        d = md5_gg(d, a, b, c, e[f + 7], 14, 1735328473);
        c = md5_gg(c, d, a, b, e[f + 12], 20, -1926607734);
        b = md5_hh(b, c, d, a, e[f + 5], 4, -378558);
        a = md5_hh(a, b, c, d, e[f + 8], 11, -2022574463);
        d = md5_hh(d, a, b, c, e[f + 11], 16, 1839030562);
        c = md5_hh(c, d, a, b, e[f + 14], 23, -35309556);
        b = md5_hh(b, c, d, a, e[f + 1], 4, -1530992060);
        a = md5_hh(a, b, c, d, e[f + 4], 11, 1272893353);
        d = md5_hh(d, a, b, c, e[f + 7], 16, -155497632);
        c = md5_hh(c, d, a, b, e[f + 10], 23, -1094730640);
        b = md5_hh(b, c, d, a, e[f + 13], 4, 681279174);
        a = md5_hh(a, b, c, d, e[f + 0], 11, -358537222);
        d = md5_hh(d, a, b, c, e[f + 3], 16, -722521979);
        c = md5_hh(c, d, a, b, e[f + 6], 23, 76029189);
        b = md5_hh(b, c, d, a, e[f + 9], 4, -640364487);
        a = md5_hh(a, b, c, d, e[f + 12], 11, -421815835);
        d = md5_hh(d, a, b, c, e[f + 15], 16, 530742520);
        c = md5_hh(c, d, a, b, e[f + 2], 23, -995338651);
        b = md5_ii(b, c, d, a, e[f + 0], 6, -198630844);
        a = md5_ii(a, b, c, d, e[f + 7], 10, 1126891415);
        d = md5_ii(d, a, b, c, e[f + 14], 15, -1416354905);
        c = md5_ii(c, d, a, b, e[f + 5], 21, -57434055);
        b = md5_ii(b, c, d, a, e[f + 12], 6, 1700485571);
        a = md5_ii(a, b, c, d, e[f + 3], 10, -1894986606);
        d = md5_ii(d, a, b, c, e[f + 10], 15, -1051523);
        c = md5_ii(c, d, a, b, e[f + 1], 21, -2054922799);
        b = md5_ii(b, c, d, a, e[f + 8], 6, 1873313359);
        a = md5_ii(a, b, c, d, e[f + 15], 10, -30611744);
        d = md5_ii(d, a, b, c, e[f + 6], 15, -1560198380);
        c = md5_ii(c, d, a, b, e[f + 13], 21, 1309151649);
        b = md5_ii(b, c, d, a, e[f + 4], 6, -145523070);
        a = md5_ii(a, b, c, d, e[f + 11], 10, -1120210379);
        d = md5_ii(d, a, b, c, e[f + 2], 15, 718787259);
        c = md5_ii(c, d, a, b, e[f + 9], 21, -343485551);
        b = safe_add(b, i);
        c = safe_add(c, j);
        d = safe_add(d, k);
        a = safe_add(a, h);
    }
    return Array(b, c, d, a);
}
function md5_cmn(a, b, c, d, e, f) {
    return safe_add(bit_rol(safe_add(safe_add(b, a), safe_add(d, f)), e), c);
}
function md5_ff(b, a, c, d, e, f, g) {
    return md5_cmn(a & c | ~a & d, b, a, e, f, g);
}
function md5_gg(c, a, d, b, e, f, g) {
    return md5_cmn(a & b | d & ~b, c, a, e, f, g);
}
function md5_hh(b, a, c, d, e, f, g) {
    return md5_cmn(a ^ c ^ d, b, a, e, f, g);
}
function md5_ii(b, a, c, d, e, f, g) {
    return md5_cmn(c ^ (a | ~d), b, a, e, f, g);
}
function core_hmac_md5(e, f) {
    var b = str2binl(e);
    if (b.length > 16)
        b = core_md5(b, e.length * chrsz);
    var c = Array(16), d = Array(16);
    for (var a = 0; a < 16; a++) {
        c[a] = b[a] ^ 909522486;
        d[a] = b[a] ^ 1549556828;
    }
    var g = core_md5(c.concat(str2binl(f)), 512 + f.length * chrsz);
    return core_md5(d.concat(g), 512 + 128);
}
function safe_add(b, c) {
    var a = (b & 65535) + (c & 65535);
    var d = (b >> 16) + (c >> 16) + (a >> 16);
    return d << 16 | a & 65535;
}
function bit_rol(a, b) {
    return a << b | a >>> 32 - b;
}
function str2binl(c) {
    var b = Array();
    var d = (1 << chrsz) - 1;
    for (var a = 0; a < c.length * chrsz; a += chrsz)
        b[a >> 5] |= (c.charCodeAt(a / chrsz) & d) << a % 32;
    return b;
}
function binl2str(c) {
    var b = '';
    var d = (1 << chrsz) - 1;
    for (var a = 0; a < c.length * 32; a += chrsz)
        b += String.fromCharCode(c[a >> 5] >>> a % 32 & d);
    return b;
}
function binl2hex(b) {
    var c = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    var d = '';
    for (var a = 0; a < b.length * 4; a++) {
        d += c.charAt(b[a >> 2] >> a % 4 * 8 + 4 & 15) + c.charAt(b[a >> 2] >> a % 4 * 8 & 15);
    }
    return d;
}
function binl2b64(b) {
    var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var d = '';
    for (var a = 0; a < b.length * 4; a += 3) {
        var f = (b[a >> 2] >> 8 * (a % 4) & 255) << 16 | (b[a + 1 >> 2] >> 8 * ((a + 1) % 4) & 255) << 8 | b[a + 2 >> 2] >> 8 * ((a + 2) % 4) & 255;
        for (var c = 0; c < 4; c++) {
            if (a * 8 + c * 6 > b.length * 32)
                d += b64pad;
            else
                d += e.charAt(f >> 6 * (3 - c) & 63);
        }
    }
    return d;
}
var plainText = 'Rebellious subjects, enemies to peace,\nProfaners of this neighbour-stained steel,--\nWill they not hear? What, ho! you men, you beasts,\nThat quench the fire of your pernicious rage\nWith purple fountains issuing from your veins,\nOn pain of torture, from those bloody hands\nThrow your mistemper\'d weapons to the ground,\nAnd hear the sentence of your moved prince.\nThree civil brawls, bred of an airy word,\nBy thee, old Capulet, and Montague,\nHave thrice disturb\'d the quiet of our streets,\nAnd made Verona\'s ancient citizens\nCast by their grave beseeming ornaments,\nTo wield old partisans, in hands as old,\nCanker\'d with peace, to part your canker\'d hate:\nIf ever you disturb our streets again,\nYour lives shall pay the forfeit of the peace.\nFor this time, all the rest depart away:\nYou Capulet; shall go along with me:\nAnd, Montague, come you this afternoon,\nTo know our further pleasure in this case,\nTo old Free-town, our common judgment-place.\nOnce more, on pain of death, all men depart.';
for (var i = 0; i < 4; i++) {
    plainText += plainText;
}
var md5Output = hex_md5(plainText);
var expected = 'a831e91e0f70eddcb70dc61c6f82f6cd';
if (md5Output != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + md5Output;