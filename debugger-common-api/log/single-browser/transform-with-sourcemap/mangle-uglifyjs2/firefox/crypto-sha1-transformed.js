var hexcase = 0;

var b64pad = "";

var chrsz = 8;

function hex_sha1(r) {
    return binb2hex(core_sha1(str2binb(r), r.length * chrsz));
}

function b64_sha1(r) {
    return binb2b64(core_sha1(str2binb(r), r.length * chrsz));
}

function str_sha1(r) {
    return binb2str(core_sha1(str2binb(r), r.length * chrsz));
}

function hex_hmac_sha1(r, e) {
    return binb2hex(core_hmac_sha1(r, e));
}

function b64_hmac_sha1(r, e) {
    return binb2b64(core_hmac_sha1(r, e));
}

function str_hmac_sha1(r, e) {
    return binb2str(core_hmac_sha1(r, e));
}

function sha1_vm_test() {
    return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

function core_sha1(r, e) {
    r[e >> 5] |= 128 << 24 - e % 32;
    r[(e + 64 >> 9 << 4) + 15] = e;
    var a = Array(80);
    var t = 1732584193;
    var n = -271733879;
    var h = -1732584194;
    var s = 271733878;
    var o = -1009589776;
    for (var c = 0; c < r.length; c += 16) {
        var i = t;
        var f = n;
        var u = h;
        var d = s;
        var b = o;
        for (var v = 0; v < 80; v++) {
            if (v < 16) a[v] = r[c + v]; else a[v] = rol(a[v - 3] ^ a[v - 8] ^ a[v - 14] ^ a[v - 16], 1);
            var l = safe_add(safe_add(rol(t, 5), sha1_ft(v, n, h, s)), safe_add(safe_add(o, a[v]), sha1_kt(v)));
            o = s;
            s = h;
            h = rol(n, 30);
            n = t;
            t = l;
        }
        t = safe_add(t, i);
        n = safe_add(n, f);
        h = safe_add(h, u);
        s = safe_add(s, d);
        o = safe_add(o, b);
    }
    return Array(t, n, h, s, o);
}

function sha1_ft(r, e, a, t) {
    if (r < 20) return e & a | ~e & t;
    if (r < 40) return e ^ a ^ t;
    if (r < 60) return e & a | e & t | a & t;
    return e ^ a ^ t;
}

function sha1_kt(r) {
    return r < 20 ? 1518500249 : r < 40 ? 1859775393 : r < 60 ? -1894007588 : -899497514;
}

function core_hmac_sha1(r, e) {
    var a = str2binb(r);
    if (a.length > 16) a = core_sha1(a, r.length * chrsz);
    var t = Array(16), n = Array(16);
    for (var h = 0; h < 16; h++) {
        t[h] = a[h] ^ 909522486;
        n[h] = a[h] ^ 1549556828;
    }
    var s = core_sha1(t.concat(str2binb(e)), 512 + e.length * chrsz);
    return core_sha1(n.concat(s), 512 + 160);
}

function safe_add(r, e) {
    var a = (r & 65535) + (e & 65535);
    var t = (r >> 16) + (e >> 16) + (a >> 16);
    return t << 16 | a & 65535;
}

function rol(r, e) {
    return r << e | r >>> 32 - e;
}

function str2binb(r) {
    var e = Array();
    var a = (1 << chrsz) - 1;
    for (var t = 0; t < r.length * chrsz; t += chrsz) e[t >> 5] |= (r.charCodeAt(t / chrsz) & a) << 32 - chrsz - t % 32;
    return e;
}

function binb2str(r) {
    var e = "";
    var a = (1 << chrsz) - 1;
    for (var t = 0; t < r.length * 32; t += chrsz) e += String.fromCharCode(r[t >> 5] >>> 32 - chrsz - t % 32 & a);
    return e;
}

function binb2hex(r) {
    var e = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var a = "";
    for (var t = 0; t < r.length * 4; t++) {
        a += e.charAt(r[t >> 2] >> (3 - t % 4) * 8 + 4 & 15) + e.charAt(r[t >> 2] >> (3 - t % 4) * 8 & 15);
    }
    return a;
}

function binb2b64(r) {
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var a = "";
    for (var t = 0; t < r.length * 4; t += 3) {
        var n = (r[t >> 2] >> 8 * (3 - t % 4) & 255) << 16 | (r[t + 1 >> 2] >> 8 * (3 - (t + 1) % 4) & 255) << 8 | r[t + 2 >> 2] >> 8 * (3 - (t + 2) % 4) & 255;
        for (var h = 0; h < 4; h++) {
            if (t * 8 + h * 6 > r.length * 32) a += b64pad; else a += e.charAt(n >> 6 * (3 - h) & 63);
        }
    }
    return a;
}

var plainText = "Two households, both alike in dignity,\nIn fair Verona, where we lay our scene,\nFrom ancient grudge break to new mutiny,\nWhere civil blood makes civil hands unclean.\nFrom forth the fatal loins of these two foes\nA pair of star-cross'd lovers take their life;\nWhole misadventured piteous overthrows\nDo with their death bury their parents' strife.\nThe fearful passage of their death-mark'd love,\nAnd the continuance of their parents' rage,\nWhich, but their children's end, nought could remove,\nIs now the two hours' traffic of our stage;\nThe which if you with patient ears attend,\nWhat here shall miss, our toil shall strive to mend.";

for (var i = 0; i < 4; i++) {
    plainText += plainText;
}

var sha1Output = hex_sha1(plainText);

var expected = "2524d264def74cce2498bf112bedf00e6c0b796d";

if (sha1Output != expected) throw "ERROR: bad result: expected " + expected + " but got " + sha1Output;