var toBase64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

var base64Pad = "=";

function toBase64(a) {
    var e = "";
    var r = a.length;
    var t;
    for (t = 0; t < r - 2; t += 3) {
        e += toBase64Table[a.charCodeAt(t) >> 2];
        e += toBase64Table[((a.charCodeAt(t) & 3) << 4) + (a.charCodeAt(t + 1) >> 4)];
        e += toBase64Table[((a.charCodeAt(t + 1) & 15) << 2) + (a.charCodeAt(t + 2) >> 6)];
        e += toBase64Table[a.charCodeAt(t + 2) & 63];
    }
    if (r % 3) {
        t = r - r % 3;
        e += toBase64Table[a.charCodeAt(t) >> 2];
        if (r % 3 == 2) {
            e += toBase64Table[((a.charCodeAt(t) & 3) << 4) + (a.charCodeAt(t + 1) >> 4)];
            e += toBase64Table[(a.charCodeAt(t + 1) & 15) << 2];
            e += base64Pad;
        } else {
            e += toBase64Table[(a.charCodeAt(t) & 3) << 4];
            e += base64Pad + base64Pad;
        }
    }
    return e;
}

var toBinaryTable = [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1 ];

function base64ToString(a) {
    var e = "";
    var r = 0;
    var t = 0;
    for (var o = 0; o < a.length; o++) {
        var s = toBinaryTable[a.charCodeAt(o) & 127];
        var d = a.charCodeAt(o) == base64Pad.charCodeAt(0);
        if (s == -1) continue;
        t = t << 6 | s;
        r += 6;
        if (r >= 8) {
            r -= 8;
            if (!d) e += String.fromCharCode(t >> r & 255);
            t &= (1 << r) - 1;
        }
    }
    if (r) throw Components.Exception("Corrupted base64 string");
    return e;
}

var str = "";

for (var i = 0; i < 8192; i++) str += String.fromCharCode(25 * Math.random() + 97);

for (var i = 8192; i <= 16384; i *= 2) {
    var base64;
    base64 = toBase64(str);
    var encoded = base64ToString(base64);
    if (encoded != str) throw "ERROR: bad result: expected " + str + " but got " + encoded;
    str += str;
}

toBinaryTable = null;