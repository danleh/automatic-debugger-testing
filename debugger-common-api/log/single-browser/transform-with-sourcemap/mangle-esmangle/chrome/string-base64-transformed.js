var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64Pad = '=';
function toBase64(b) {
    var c = '';
    var d = b.length;
    var a;
    for (a = 0; a < d - 2; a += 3) {
        c += toBase64Table[b.charCodeAt(a) >> 2];
        c += toBase64Table[((b.charCodeAt(a) & 3) << 4) + (b.charCodeAt(a + 1) >> 4)];
        c += toBase64Table[((b.charCodeAt(a + 1) & 15) << 2) + (b.charCodeAt(a + 2) >> 6)];
        c += toBase64Table[b.charCodeAt(a + 2) & 63];
    }
    if (d % 3) {
        a = d - d % 3;
        c += toBase64Table[b.charCodeAt(a) >> 2];
        if (d % 3 == 2) {
            c += toBase64Table[((b.charCodeAt(a) & 3) << 4) + (b.charCodeAt(a + 1) >> 4)];
            c += toBase64Table[(b.charCodeAt(a + 1) & 15) << 2];
            c += base64Pad;
        } else {
            c += toBase64Table[(b.charCodeAt(a) & 3) << 4];
            c += base64Pad + base64Pad;
        }
    }
    return c;
}
var toBinaryTable = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    -1,
    -1,
    -1,
    -1,
    -1
];
function base64ToString(d) {
    var e = '';
    var a = 0;
    var b = 0;
    for (var c = 0; c < d.length; c++) {
        var f = toBinaryTable[d.charCodeAt(c) & 127];
        var g = d.charCodeAt(c) == base64Pad.charCodeAt(0);
        if (f == -1)
            continue;
        b = b << 6 | f;
        a += 6;
        if (a >= 8) {
            a -= 8;
            if (!g)
                e += String.fromCharCode(b >> a & 255);
            b &= (1 << a) - 1;
        }
    }
    if (a)
        throw Components.Exception('Corrupted base64 string');
    return e;
}
var str = '';
for (var i = 0; i < 8192; i++)
    str += String.fromCharCode(25 * Math.random() + 97);
for (var i = 8192; i <= 16384; i *= 2) {
    var base64;
    base64 = toBase64(str);
    var encoded = base64ToString(base64);
    if (encoded != str)
        throw 'ERROR: bad result: expected ' + str + ' but got ' + encoded;
    str += str;
}
toBinaryTable = null;