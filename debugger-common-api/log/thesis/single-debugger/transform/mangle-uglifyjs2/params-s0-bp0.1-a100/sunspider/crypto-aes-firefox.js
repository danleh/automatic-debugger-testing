function Cipher(r, e) {
    var a = 4;
    var n = e.length / a - 1;
    var t = [ [], [], [], [] ];
    for (var o = 0; o < 4 * a; o++) t[o % 4][Math.floor(o / 4)] = r[o];
    t = AddRoundKey(t, e, 0, a);
    for (var h = 1; h < n; h++) {
        t = SubBytes(t, a);
        t = ShiftRows(t, a);
        t = MixColumns(t, a);
        t = AddRoundKey(t, e, h, a);
    }
    t = SubBytes(t, a);
    t = ShiftRows(t, a);
    t = AddRoundKey(t, e, n, a);
    var i = new Array(4 * a);
    for (var o = 0; o < 4 * a; o++) i[o] = t[o % 4][Math.floor(o / 4)];
    return i;
}

function SubBytes(r, e) {
    for (var a = 0; a < 4; a++) {
        for (var n = 0; n < e; n++) r[a][n] = Sbox[r[a][n]];
    }
    return r;
}

function ShiftRows(r, e) {
    var a = new Array(4);
    for (var n = 1; n < 4; n++) {
        for (var t = 0; t < 4; t++) a[t] = r[n][(t + n) % e];
        for (var t = 0; t < 4; t++) r[n][t] = a[t];
    }
    return r;
}

function MixColumns(r, e) {
    for (var a = 0; a < 4; a++) {
        var n = new Array(4);
        var t = new Array(4);
        for (var o = 0; o < 4; o++) {
            n[o] = r[o][a];
            t[o] = r[o][a] & 128 ? r[o][a] << 1 ^ 283 : r[o][a] << 1;
        }
        r[0][a] = t[0] ^ n[1] ^ t[1] ^ n[2] ^ n[3];
        r[1][a] = n[0] ^ t[1] ^ n[2] ^ t[2] ^ n[3];
        r[2][a] = n[0] ^ n[1] ^ t[2] ^ n[3] ^ t[3];
        r[3][a] = n[0] ^ t[0] ^ n[1] ^ n[2] ^ t[3];
    }
    return r;
}

function AddRoundKey(r, e, a, n) {
    for (var t = 0; t < 4; t++) {
        for (var o = 0; o < n; o++) r[t][o] ^= e[a * 4 + o][t];
    }
    return r;
}

function KeyExpansion(r) {
    var e = 4;
    var a = r.length / 4;
    var n = a + 6;
    var t = new Array(e * (n + 1));
    var o = new Array(4);
    for (var h = 0; h < a; h++) {
        var i = [ r[4 * h], r[4 * h + 1], r[4 * h + 2], r[4 * h + 3] ];
        t[h] = i;
    }
    for (var h = a; h < e * (n + 1); h++) {
        t[h] = new Array(4);
        for (var s = 0; s < 4; s++) o[s] = t[h - 1][s];
        if (h % a == 0) {
            o = SubWord(RotWord(o));
            for (var s = 0; s < 4; s++) o[s] ^= Rcon[h / a][s];
        } else if (a > 6 && h % a == 4) {
            o = SubWord(o);
        }
        for (var s = 0; s < 4; s++) t[h][s] = t[h - a][s] ^ o[s];
    }
    return t;
}

function SubWord(r) {
    for (var e = 0; e < 4; e++) r[e] = Sbox[r[e]];
    return r;
}

function RotWord(r) {
    r[4] = r[0];
    for (var e = 0; e < 4; e++) r[e] = r[e + 1];
    return r;
}

var Sbox = [ 99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22 ];

var Rcon = [ [ 0, 0, 0, 0 ], [ 1, 0, 0, 0 ], [ 2, 0, 0, 0 ], [ 4, 0, 0, 0 ], [ 8, 0, 0, 0 ], [ 16, 0, 0, 0 ], [ 32, 0, 0, 0 ], [ 64, 0, 0, 0 ], [ 128, 0, 0, 0 ], [ 27, 0, 0, 0 ], [ 54, 0, 0, 0 ] ];

function AESEncryptCtr(r, e, a) {
    if (!(a == 128 || a == 192 || a == 256)) return "";
    var n = a / 8;
    var t = new Array(n);
    for (var o = 0; o < n; o++) t[o] = e.charCodeAt(o) & 255;
    var h = Cipher(t, KeyExpansion(t));
    h = h.concat(h.slice(0, n - 16));
    var i = 16;
    var s = new Array(i);
    var f = new Date().getTime();
    for (var o = 0; o < 4; o++) s[o] = f >>> o * 8 & 255;
    for (var o = 0; o < 4; o++) s[o + 4] = f / 4294967296 >>> o * 8 & 255;
    var d = KeyExpansion(h);
    var u = Math.ceil(r.length / i);
    var v = new Array(u);
    for (var c = 0; c < u; c++) {
        for (var l = 0; l < 4; l++) s[15 - l] = c >>> l * 8 & 255;
        for (var l = 0; l < 4; l++) s[15 - l - 4] = c / 4294967296 >>> l * 8;
        var C = Cipher(s, d);
        var g = c < u - 1 ? i : (r.length - 1) % i + 1;
        var y = "";
        for (var o = 0; o < g; o++) {
            var A = r.charCodeAt(c * i + o);
            var p = A ^ C[o];
            y += String.fromCharCode(p);
        }
        v[c] = escCtrlChars(y);
    }
    var w = "";
    for (var o = 0; o < 8; o++) w += String.fromCharCode(s[o]);
    w = escCtrlChars(w);
    return w + "-" + v.join("-");
}

function AESDecryptCtr(r, e, a) {
    if (!(a == 128 || a == 192 || a == 256)) return "";
    var n = a / 8;
    var t = new Array(n);
    for (var o = 0; o < n; o++) t[o] = e.charCodeAt(o) & 255;
    var h = KeyExpansion(t);
    var i = Cipher(t, h);
    i = i.concat(i.slice(0, n - 16));
    var s = KeyExpansion(i);
    r = r.split("-");
    var f = 16;
    var d = new Array(f);
    var u = unescCtrlChars(r[0]);
    for (var o = 0; o < 8; o++) d[o] = u.charCodeAt(o);
    var v = new Array(r.length - 1);
    for (var c = 1; c < r.length; c++) {
        for (var l = 0; l < 4; l++) d[15 - l] = c - 1 >>> l * 8 & 255;
        for (var l = 0; l < 4; l++) d[15 - l - 4] = c / 4294967296 - 1 >>> l * 8 & 255;
        var C = Cipher(d, s);
        r[c] = unescCtrlChars(r[c]);
        var g = "";
        for (var o = 0; o < r[c].length; o++) {
            var y = r[c].charCodeAt(o);
            var A = y ^ C[o];
            g += String.fromCharCode(A);
        }
        v[c - 1] = g;
    }
    return v.join("");
}

function escCtrlChars(r) {
    return r.replace(/[\0\t\n\v\f\r\xa0'"!-]/g, function(r) {
        return "!" + r.charCodeAt(0) + "!";
    });
}

function unescCtrlChars(r) {
    return r.replace(/!\d\d?\d?!/g, function(r) {
        return String.fromCharCode(r.slice(1, -1));
    });
}

var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encodeBase64(r) {
    var e, a, n, t, o, h, i, s, f = 0, d = "";
    r = encodeUTF8(r);
    do {
        e = r.charCodeAt(f++);
        a = r.charCodeAt(f++);
        n = r.charCodeAt(f++);
        s = e << 16 | a << 8 | n;
        t = s >> 18 & 63;
        o = s >> 12 & 63;
        h = s >> 6 & 63;
        i = s & 63;
        if (isNaN(n)) i = 64;
        if (isNaN(a)) h = 64;
        d += b64.charAt(t) + b64.charAt(o) + b64.charAt(h) + b64.charAt(i);
    } while (f < r.length);
    return d;
}

function decodeBase64(r) {
    var e, a, n, t, o, h, i, s, f = 0, d = "";
    do {
        t = b64.indexOf(r.charAt(f++));
        o = b64.indexOf(r.charAt(f++));
        h = b64.indexOf(r.charAt(f++));
        i = b64.indexOf(r.charAt(f++));
        s = t << 18 | o << 12 | h << 6 | i;
        e = s >> 16 & 255;
        a = s >> 8 & 255;
        n = s & 255;
        if (h == 64) d += String.fromCharCode(e); else if (i == 64) d += String.fromCharCode(e, a); else d += String.fromCharCode(e, a, n);
    } while (f < r.length);
    return decodeUTF8(d);
}

function encodeUTF8(r) {
    r = r.replace(/[\u0080-\u07ff]/g, function(r) {
        var e = r.charCodeAt(0);
        return String.fromCharCode(192 | e >> 6, 128 | e & 63);
    });
    r = r.replace(/[\u0800-\uffff]/g, function(r) {
        var e = r.charCodeAt(0);
        return String.fromCharCode(224 | e >> 12, 128 | e >> 6 & 63, 128 | e & 63);
    });
    return r;
}

function decodeUTF8(r) {
    r = r.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function(r) {
        var e = (r.charCodeAt(0) & 31) << 6 | r.charCodeAt(1) & 63;
        return String.fromCharCode(e);
    });
    r = r.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function(r) {
        var e = (r.charCodeAt(0) & 15) << 12 | r.charCodeAt(1) & 63 << 6 | r.charCodeAt(2) & 63;
        return String.fromCharCode(e);
    });
    return r;
}

function byteArrayToHexStr(r) {
    var e = "";
    for (var a = 0; a < r.length; a++) e += r[a].toString(16) + " ";
    return e;
}

var plainText = "ROMEO: But, soft! what light through yonder window breaks?\nIt is the east, and Juliet is the sun.\nArise, fair sun, and kill the envious moon,\nWho is already sick and pale with grief,\nThat thou her maid art far more fair than she:\nBe not her maid, since she is envious;\nHer vestal livery is but sick and green\nAnd none but fools do wear it; cast it off.\nIt is my lady, O, it is my love!\nO, that she knew she were!\nShe speaks yet she says nothing: what of that?\nHer eye discourses; I will answer it.\nI am too bold, 'tis not to me she speaks:\nTwo of the fairest stars in all the heaven,\nHaving some business, do entreat her eyes\nTo twinkle in their spheres till they return.\nWhat if her eyes were there, they in her head?\nThe brightness of her cheek would shame those stars,\nAs daylight doth a lamp; her eyes in heaven\nWould through the airy region stream so bright\nThat birds would sing and think it were not night.\nSee, how she leans her cheek upon her hand!\nO, that I were a glove upon that hand,\nThat I might touch that cheek!\nJULIET: Ay me!\nROMEO: She speaks:\nO, speak again, bright angel! for thou art\nAs glorious to this night, being o'er my head\nAs is a winged messenger of heaven\nUnto the white-upturned wondering eyes\nOf mortals that fall back to gaze on him\nWhen he bestrides the lazy-pacing clouds\nAnd sails upon the bosom of the air.";

var password = "O Romeo, Romeo! wherefore art thou Romeo?";

var cipherText = AESEncryptCtr(plainText, password, 256);

var decryptedText = AESDecryptCtr(cipherText, password, 256);

if (decryptedText != plainText) throw "ERROR: bad result: expected " + plainText + " but got " + decryptedText;