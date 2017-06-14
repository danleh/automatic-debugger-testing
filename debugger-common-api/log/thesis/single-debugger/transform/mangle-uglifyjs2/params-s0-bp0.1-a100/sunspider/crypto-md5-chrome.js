var hexcase = 0;

var b64pad = "";

var chrsz = 8;

function hex_md5(r) {
    return binl2hex(core_md5(str2binl(r), r.length * chrsz));
}

function b64_md5(r) {
    return binl2b64(core_md5(str2binl(r), r.length * chrsz));
}

function str_md5(r) {
    return binl2str(core_md5(str2binl(r), r.length * chrsz));
}

function hex_hmac_md5(r, e) {
    return binl2hex(core_hmac_md5(r, e));
}

function b64_hmac_md5(r, e) {
    return binl2b64(core_hmac_md5(r, e));
}

function str_hmac_md5(r, e) {
    return binl2str(core_hmac_md5(r, e));
}

function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

function core_md5(r, e) {
    r[e >> 5] |= 128 << e % 32;
    r[(e + 64 >>> 9 << 4) + 14] = e;
    var n = 1732584193;
    var d = -271733879;
    var t = -1732584194;
    var a = 271733878;
    for (var m = 0; m < r.length; m += 16) {
        var i = n;
        var o = d;
        var h = t;
        var _ = a;
        n = md5_ff(n, d, t, a, r[m + 0], 7, -680876936);
        a = md5_ff(a, n, d, t, r[m + 1], 12, -389564586);
        t = md5_ff(t, a, n, d, r[m + 2], 17, 606105819);
        d = md5_ff(d, t, a, n, r[m + 3], 22, -1044525330);
        n = md5_ff(n, d, t, a, r[m + 4], 7, -176418897);
        a = md5_ff(a, n, d, t, r[m + 5], 12, 1200080426);
        t = md5_ff(t, a, n, d, r[m + 6], 17, -1473231341);
        d = md5_ff(d, t, a, n, r[m + 7], 22, -45705983);
        n = md5_ff(n, d, t, a, r[m + 8], 7, 1770035416);
        a = md5_ff(a, n, d, t, r[m + 9], 12, -1958414417);
        t = md5_ff(t, a, n, d, r[m + 10], 17, -42063);
        d = md5_ff(d, t, a, n, r[m + 11], 22, -1990404162);
        n = md5_ff(n, d, t, a, r[m + 12], 7, 1804603682);
        a = md5_ff(a, n, d, t, r[m + 13], 12, -40341101);
        t = md5_ff(t, a, n, d, r[m + 14], 17, -1502002290);
        d = md5_ff(d, t, a, n, r[m + 15], 22, 1236535329);
        n = md5_gg(n, d, t, a, r[m + 1], 5, -165796510);
        a = md5_gg(a, n, d, t, r[m + 6], 9, -1069501632);
        t = md5_gg(t, a, n, d, r[m + 11], 14, 643717713);
        d = md5_gg(d, t, a, n, r[m + 0], 20, -373897302);
        n = md5_gg(n, d, t, a, r[m + 5], 5, -701558691);
        a = md5_gg(a, n, d, t, r[m + 10], 9, 38016083);
        t = md5_gg(t, a, n, d, r[m + 15], 14, -660478335);
        d = md5_gg(d, t, a, n, r[m + 4], 20, -405537848);
        n = md5_gg(n, d, t, a, r[m + 9], 5, 568446438);
        a = md5_gg(a, n, d, t, r[m + 14], 9, -1019803690);
        t = md5_gg(t, a, n, d, r[m + 3], 14, -187363961);
        d = md5_gg(d, t, a, n, r[m + 8], 20, 1163531501);
        n = md5_gg(n, d, t, a, r[m + 13], 5, -1444681467);
        a = md5_gg(a, n, d, t, r[m + 2], 9, -51403784);
        t = md5_gg(t, a, n, d, r[m + 7], 14, 1735328473);
        d = md5_gg(d, t, a, n, r[m + 12], 20, -1926607734);
        n = md5_hh(n, d, t, a, r[m + 5], 4, -378558);
        a = md5_hh(a, n, d, t, r[m + 8], 11, -2022574463);
        t = md5_hh(t, a, n, d, r[m + 11], 16, 1839030562);
        d = md5_hh(d, t, a, n, r[m + 14], 23, -35309556);
        n = md5_hh(n, d, t, a, r[m + 1], 4, -1530992060);
        a = md5_hh(a, n, d, t, r[m + 4], 11, 1272893353);
        t = md5_hh(t, a, n, d, r[m + 7], 16, -155497632);
        d = md5_hh(d, t, a, n, r[m + 10], 23, -1094730640);
        n = md5_hh(n, d, t, a, r[m + 13], 4, 681279174);
        a = md5_hh(a, n, d, t, r[m + 0], 11, -358537222);
        t = md5_hh(t, a, n, d, r[m + 3], 16, -722521979);
        d = md5_hh(d, t, a, n, r[m + 6], 23, 76029189);
        n = md5_hh(n, d, t, a, r[m + 9], 4, -640364487);
        a = md5_hh(a, n, d, t, r[m + 12], 11, -421815835);
        t = md5_hh(t, a, n, d, r[m + 15], 16, 530742520);
        d = md5_hh(d, t, a, n, r[m + 2], 23, -995338651);
        n = md5_ii(n, d, t, a, r[m + 0], 6, -198630844);
        a = md5_ii(a, n, d, t, r[m + 7], 10, 1126891415);
        t = md5_ii(t, a, n, d, r[m + 14], 15, -1416354905);
        d = md5_ii(d, t, a, n, r[m + 5], 21, -57434055);
        n = md5_ii(n, d, t, a, r[m + 12], 6, 1700485571);
        a = md5_ii(a, n, d, t, r[m + 3], 10, -1894986606);
        t = md5_ii(t, a, n, d, r[m + 10], 15, -1051523);
        d = md5_ii(d, t, a, n, r[m + 1], 21, -2054922799);
        n = md5_ii(n, d, t, a, r[m + 8], 6, 1873313359);
        a = md5_ii(a, n, d, t, r[m + 15], 10, -30611744);
        t = md5_ii(t, a, n, d, r[m + 6], 15, -1560198380);
        d = md5_ii(d, t, a, n, r[m + 13], 21, 1309151649);
        n = md5_ii(n, d, t, a, r[m + 4], 6, -145523070);
        a = md5_ii(a, n, d, t, r[m + 11], 10, -1120210379);
        t = md5_ii(t, a, n, d, r[m + 2], 15, 718787259);
        d = md5_ii(d, t, a, n, r[m + 9], 21, -343485551);
        n = safe_add(n, i);
        d = safe_add(d, o);
        t = safe_add(t, h);
        a = safe_add(a, _);
    }
    return Array(n, d, t, a);
}

function md5_cmn(r, e, n, d, t, a) {
    return safe_add(bit_rol(safe_add(safe_add(e, r), safe_add(d, a)), t), n);
}

function md5_ff(r, e, n, d, t, a, m) {
    return md5_cmn(e & n | ~e & d, r, e, t, a, m);
}

function md5_gg(r, e, n, d, t, a, m) {
    return md5_cmn(e & d | n & ~d, r, e, t, a, m);
}

function md5_hh(r, e, n, d, t, a, m) {
    return md5_cmn(e ^ n ^ d, r, e, t, a, m);
}

function md5_ii(r, e, n, d, t, a, m) {
    return md5_cmn(n ^ (e | ~d), r, e, t, a, m);
}

function core_hmac_md5(r, e) {
    var n = str2binl(r);
    if (n.length > 16) n = core_md5(n, r.length * chrsz);
    var d = Array(16), t = Array(16);
    for (var a = 0; a < 16; a++) {
        d[a] = n[a] ^ 909522486;
        t[a] = n[a] ^ 1549556828;
    }
    var m = core_md5(d.concat(str2binl(e)), 512 + e.length * chrsz);
    return core_md5(t.concat(m), 512 + 128);
}

function safe_add(r, e) {
    var n = (r & 65535) + (e & 65535);
    var d = (r >> 16) + (e >> 16) + (n >> 16);
    return d << 16 | n & 65535;
}

function bit_rol(r, e) {
    return r << e | r >>> 32 - e;
}

function str2binl(r) {
    var e = Array();
    var n = (1 << chrsz) - 1;
    for (var d = 0; d < r.length * chrsz; d += chrsz) e[d >> 5] |= (r.charCodeAt(d / chrsz) & n) << d % 32;
    return e;
}

function binl2str(r) {
    var e = "";
    var n = (1 << chrsz) - 1;
    for (var d = 0; d < r.length * 32; d += chrsz) e += String.fromCharCode(r[d >> 5] >>> d % 32 & n);
    return e;
}

function binl2hex(r) {
    var e = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var n = "";
    for (var d = 0; d < r.length * 4; d++) {
        n += e.charAt(r[d >> 2] >> d % 4 * 8 + 4 & 15) + e.charAt(r[d >> 2] >> d % 4 * 8 & 15);
    }
    return n;
}

function binl2b64(r) {
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var n = "";
    for (var d = 0; d < r.length * 4; d += 3) {
        var t = (r[d >> 2] >> 8 * (d % 4) & 255) << 16 | (r[d + 1 >> 2] >> 8 * ((d + 1) % 4) & 255) << 8 | r[d + 2 >> 2] >> 8 * ((d + 2) % 4) & 255;
        for (var a = 0; a < 4; a++) {
            if (d * 8 + a * 6 > r.length * 32) n += b64pad; else n += e.charAt(t >> 6 * (3 - a) & 63);
        }
    }
    return n;
}

var plainText = "Rebellious subjects, enemies to peace,\nProfaners of this neighbour-stained steel,--\nWill they not hear? What, ho! you men, you beasts,\nThat quench the fire of your pernicious rage\nWith purple fountains issuing from your veins,\nOn pain of torture, from those bloody hands\nThrow your mistemper'd weapons to the ground,\nAnd hear the sentence of your moved prince.\nThree civil brawls, bred of an airy word,\nBy thee, old Capulet, and Montague,\nHave thrice disturb'd the quiet of our streets,\nAnd made Verona's ancient citizens\nCast by their grave beseeming ornaments,\nTo wield old partisans, in hands as old,\nCanker'd with peace, to part your canker'd hate:\nIf ever you disturb our streets again,\nYour lives shall pay the forfeit of the peace.\nFor this time, all the rest depart away:\nYou Capulet; shall go along with me:\nAnd, Montague, come you this afternoon,\nTo know our further pleasure in this case,\nTo old Free-town, our common judgment-place.\nOnce more, on pain of death, all men depart.";

for (var i = 0; i < 4; i++) {
    plainText += plainText;
}

var md5Output = hex_md5(plainText);

var expected = "a831e91e0f70eddcb70dc61c6f82f6cd";

if (md5Output != expected) throw "ERROR: bad result: expected " + expected + " but got " + md5Output;