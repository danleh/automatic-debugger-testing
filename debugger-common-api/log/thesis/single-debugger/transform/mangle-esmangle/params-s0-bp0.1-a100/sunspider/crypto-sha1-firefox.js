var hexcase = 0;
var b64pad = '';
var chrsz = 8;
function hex_sha1(a) {
    return binb2hex(core_sha1(str2binb(a), a.length * chrsz));
}
function b64_sha1(a) {
    return binb2b64(core_sha1(str2binb(a), a.length * chrsz));
}
function str_sha1(a) {
    return binb2str(core_sha1(str2binb(a), a.length * chrsz));
}
function hex_hmac_sha1(a, b) {
    return binb2hex(core_hmac_sha1(a, b));
}
function b64_hmac_sha1(a, b) {
    return binb2b64(core_hmac_sha1(a, b));
}
function str_hmac_sha1(a, b) {
    return binb2str(core_hmac_sha1(a, b));
}
function sha1_vm_test() {
    return hex_sha1('abc') == 'a9993e364706816aba3e25717850c26c9cd0d89d';
}
function core_sha1(i, h) {
    i[h >> 5] |= 128 << 24 - h % 32;
    i[(h + 64 >> 9 << 4) + 15] = h;
    var b = Array(80);
    var c = 1732584193;
    var d = -271733879;
    var e = -1732584194;
    var f = 271733878;
    var g = -1009589776;
    for (var j = 0; j < i.length; j += 16) {
        var k = c;
        var l = d;
        var m = e;
        var n = f;
        var o = g;
        for (var a = 0; a < 80; a++) {
            if (a < 16)
                b[a] = i[j + a];
            else
                b[a] = rol(b[a - 3] ^ b[a - 8] ^ b[a - 14] ^ b[a - 16], 1);
            var p = safe_add(safe_add(rol(c, 5), sha1_ft(a, d, e, f)), safe_add(safe_add(g, b[a]), sha1_kt(a)));
            g = f;
            f = e;
            e = rol(d, 30);
            d = c;
            c = p;
        }
        c = safe_add(c, k);
        d = safe_add(d, l);
        e = safe_add(e, m);
        f = safe_add(f, n);
        g = safe_add(g, o);
    }
    return Array(c, d, e, f, g);
}
function sha1_ft(d, a, b, c) {
    if (d < 20)
        return a & b | ~a & c;
    if (d < 40)
        return a ^ b ^ c;
    if (d < 60)
        return a & b | a & c | b & c;
    return a ^ b ^ c;
}
function sha1_kt(a) {
    return a < 20 ? 1518500249 : a < 40 ? 1859775393 : a < 60 ? -1894007588 : -899497514;
}
function core_hmac_sha1(e, f) {
    var b = str2binb(e);
    if (b.length > 16)
        b = core_sha1(b, e.length * chrsz);
    var c = Array(16), d = Array(16);
    for (var a = 0; a < 16; a++) {
        c[a] = b[a] ^ 909522486;
        d[a] = b[a] ^ 1549556828;
    }
    var g = core_sha1(c.concat(str2binb(f)), 512 + f.length * chrsz);
    return core_sha1(d.concat(g), 512 + 160);
}
function safe_add(b, c) {
    var a = (b & 65535) + (c & 65535);
    var d = (b >> 16) + (c >> 16) + (a >> 16);
    return d << 16 | a & 65535;
}
function rol(a, b) {
    return a << b | a >>> 32 - b;
}
function str2binb(c) {
    var b = Array();
    var d = (1 << chrsz) - 1;
    for (var a = 0; a < c.length * chrsz; a += chrsz)
        b[a >> 5] |= (c.charCodeAt(a / chrsz) & d) << 32 - chrsz - a % 32;
    return b;
}
function binb2str(c) {
    var b = '';
    var d = (1 << chrsz) - 1;
    for (var a = 0; a < c.length * 32; a += chrsz)
        b += String.fromCharCode(c[a >> 5] >>> 32 - chrsz - a % 32 & d);
    return b;
}
function binb2hex(b) {
    var c = hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    var d = '';
    for (var a = 0; a < b.length * 4; a++) {
        d += c.charAt(b[a >> 2] >> (3 - a % 4) * 8 + 4 & 15) + c.charAt(b[a >> 2] >> (3 - a % 4) * 8 & 15);
    }
    return d;
}
function binb2b64(b) {
    var e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var d = '';
    for (var a = 0; a < b.length * 4; a += 3) {
        var f = (b[a >> 2] >> 8 * (3 - a % 4) & 255) << 16 | (b[a + 1 >> 2] >> 8 * (3 - (a + 1) % 4) & 255) << 8 | b[a + 2 >> 2] >> 8 * (3 - (a + 2) % 4) & 255;
        for (var c = 0; c < 4; c++) {
            if (a * 8 + c * 6 > b.length * 32)
                d += b64pad;
            else
                d += e.charAt(f >> 6 * (3 - c) & 63);
        }
    }
    return d;
}
var plainText = 'Two households, both alike in dignity,\nIn fair Verona, where we lay our scene,\nFrom ancient grudge break to new mutiny,\nWhere civil blood makes civil hands unclean.\nFrom forth the fatal loins of these two foes\nA pair of star-cross\'d lovers take their life;\nWhole misadventured piteous overthrows\nDo with their death bury their parents\' strife.\nThe fearful passage of their death-mark\'d love,\nAnd the continuance of their parents\' rage,\nWhich, but their children\'s end, nought could remove,\nIs now the two hours\' traffic of our stage;\nThe which if you with patient ears attend,\nWhat here shall miss, our toil shall strive to mend.';
for (var i = 0; i < 4; i++) {
    plainText += plainText;
}
var sha1Output = hex_sha1(plainText);
var expected = '2524d264def74cce2498bf112bedf00e6c0b796d';
if (sha1Output != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + sha1Output;