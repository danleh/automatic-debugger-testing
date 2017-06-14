function Cipher(h, d) {
    var b = 4;
    var f = d.length / b - 1;
    var a = [
        [],
        [],
        [],
        []
    ];
    for (var c = 0; c < 4 * b; c++)
        a[c % 4][Math.floor(c / 4)] = h[c];
    a = AddRoundKey(a, d, 0, b);
    for (var e = 1; e < f; e++) {
        a = SubBytes(a, b);
        a = ShiftRows(a, b);
        a = MixColumns(a, b);
        a = AddRoundKey(a, d, e, b);
    }
    a = SubBytes(a, b);
    a = ShiftRows(a, b);
    a = AddRoundKey(a, d, f, b);
    var g = new Array(4 * b);
    for (var c = 0; c < 4 * b; c++)
        g[c] = a[c % 4][Math.floor(c / 4)];
    return g;
}
function SubBytes(c, d) {
    for (var a = 0; a < 4; a++) {
        for (var b = 0; b < d; b++)
            c[a][b] = Sbox[c[a][b]];
    }
    return c;
}
function ShiftRows(c, e) {
    var d = new Array(4);
    for (var b = 1; b < 4; b++) {
        for (var a = 0; a < 4; a++)
            d[a] = c[b][(a + b) % e];
        for (var a = 0; a < 4; a++)
            c[b][a] = d[a];
    }
    return c;
}
function MixColumns(d, f) {
    for (var b = 0; b < 4; b++) {
        var a = new Array(4);
        var c = new Array(4);
        for (var e = 0; e < 4; e++) {
            a[e] = d[e][b];
            c[e] = d[e][b] & 128 ? d[e][b] << 1 ^ 283 : d[e][b] << 1;
        }
        d[0][b] = c[0] ^ a[1] ^ c[1] ^ a[2] ^ a[3];
        d[1][b] = a[0] ^ c[1] ^ a[2] ^ c[2] ^ a[3];
        d[2][b] = a[0] ^ a[1] ^ c[2] ^ a[3] ^ c[3];
        d[3][b] = a[0] ^ c[0] ^ a[1] ^ a[2] ^ c[3];
    }
    return d;
}
function AddRoundKey(c, d, e, f) {
    for (var a = 0; a < 4; a++) {
        for (var b = 0; b < f; b++)
            c[a][b] ^= d[e * 4 + b][a];
    }
    return c;
}
function KeyExpansion(f) {
    var g = 4;
    var c = f.length / 4;
    var h = c + 6;
    var e = new Array(g * (h + 1));
    var d = new Array(4);
    for (var a = 0; a < c; a++) {
        var i = [
            f[4 * a],
            f[4 * a + 1],
            f[4 * a + 2],
            f[4 * a + 3]
        ];
        e[a] = i;
    }
    for (var a = c; a < g * (h + 1); a++) {
        e[a] = new Array(4);
        for (var b = 0; b < 4; b++)
            d[b] = e[a - 1][b];
        if (a % c == 0) {
            d = SubWord(RotWord(d));
            for (var b = 0; b < 4; b++)
                d[b] ^= Rcon[a / c][b];
        } else if (c > 6 && a % c == 4) {
            d = SubWord(d);
        }
        for (var b = 0; b < 4; b++)
            e[a][b] = e[a - c][b] ^ d[b];
    }
    return e;
}
function SubWord(b) {
    for (var a = 0; a < 4; a++)
        b[a] = Sbox[b[a]];
    return b;
}
function RotWord(a) {
    a[4] = a[0];
    for (var b = 0; b < 4; b++)
        a[b] = a[b + 1];
    return a;
}
var Sbox = [
    99,
    124,
    119,
    123,
    242,
    107,
    111,
    197,
    48,
    1,
    103,
    43,
    254,
    215,
    171,
    118,
    202,
    130,
    201,
    125,
    250,
    89,
    71,
    240,
    173,
    212,
    162,
    175,
    156,
    164,
    114,
    192,
    183,
    253,
    147,
    38,
    54,
    63,
    247,
    204,
    52,
    165,
    229,
    241,
    113,
    216,
    49,
    21,
    4,
    199,
    35,
    195,
    24,
    150,
    5,
    154,
    7,
    18,
    128,
    226,
    235,
    39,
    178,
    117,
    9,
    131,
    44,
    26,
    27,
    110,
    90,
    160,
    82,
    59,
    214,
    179,
    41,
    227,
    47,
    132,
    83,
    209,
    0,
    237,
    32,
    252,
    177,
    91,
    106,
    203,
    190,
    57,
    74,
    76,
    88,
    207,
    208,
    239,
    170,
    251,
    67,
    77,
    51,
    133,
    69,
    249,
    2,
    127,
    80,
    60,
    159,
    168,
    81,
    163,
    64,
    143,
    146,
    157,
    56,
    245,
    188,
    182,
    218,
    33,
    16,
    255,
    243,
    210,
    205,
    12,
    19,
    236,
    95,
    151,
    68,
    23,
    196,
    167,
    126,
    61,
    100,
    93,
    25,
    115,
    96,
    129,
    79,
    220,
    34,
    42,
    144,
    136,
    70,
    238,
    184,
    20,
    222,
    94,
    11,
    219,
    224,
    50,
    58,
    10,
    73,
    6,
    36,
    92,
    194,
    211,
    172,
    98,
    145,
    149,
    228,
    121,
    231,
    200,
    55,
    109,
    141,
    213,
    78,
    169,
    108,
    86,
    244,
    234,
    101,
    122,
    174,
    8,
    186,
    120,
    37,
    46,
    28,
    166,
    180,
    198,
    232,
    221,
    116,
    31,
    75,
    189,
    139,
    138,
    112,
    62,
    181,
    102,
    72,
    3,
    246,
    14,
    97,
    53,
    87,
    185,
    134,
    193,
    29,
    158,
    225,
    248,
    152,
    17,
    105,
    217,
    142,
    148,
    155,
    30,
    135,
    233,
    206,
    85,
    40,
    223,
    140,
    161,
    137,
    13,
    191,
    230,
    66,
    104,
    65,
    153,
    45,
    15,
    176,
    84,
    187,
    22
];
var Rcon = [
    [
        0,
        0,
        0,
        0
    ],
    [
        1,
        0,
        0,
        0
    ],
    [
        2,
        0,
        0,
        0
    ],
    [
        4,
        0,
        0,
        0
    ],
    [
        8,
        0,
        0,
        0
    ],
    [
        16,
        0,
        0,
        0
    ],
    [
        32,
        0,
        0,
        0
    ],
    [
        64,
        0,
        0,
        0
    ],
    [
        128,
        0,
        0,
        0
    ],
    [
        27,
        0,
        0,
        0
    ],
    [
        54,
        0,
        0,
        0
    ]
];
function AESEncryptCtr(m, u, h) {
    if (!(h == 128 || h == 192 || h == 256))
        return '';
    var k = h / 8;
    var j = new Array(k);
    for (var a = 0; a < k; a++)
        j[a] = u.charCodeAt(a) & 255;
    var f = Cipher(j, KeyExpansion(j));
    f = f.concat(f.slice(0, k - 16));
    var e = 16;
    var d = new Array(e);
    var l = new Date().getTime();
    for (var a = 0; a < 4; a++)
        d[a] = l >>> a * 8 & 255;
    for (var a = 0; a < 4; a++)
        d[a + 4] = l / 4294967296 >>> a * 8 & 255;
    var p = KeyExpansion(f);
    var i = Math.ceil(m.length / e);
    var n = new Array(i);
    for (var c = 0; c < i; c++) {
        for (var b = 0; b < 4; b++)
            d[15 - b] = c >>> b * 8 & 255;
        for (var b = 0; b < 4; b++)
            d[15 - b - 4] = c / 4294967296 >>> b * 8;
        var q = Cipher(d, p);
        var r = c < i - 1 ? e : (m.length - 1) % e + 1;
        var o = '';
        for (var a = 0; a < r; a++) {
            var t = m.charCodeAt(c * e + a);
            var s = t ^ q[a];
            o += String.fromCharCode(s);
        }
        n[c] = escCtrlChars(o);
    }
    var g = '';
    for (var a = 0; a < 8; a++)
        g += String.fromCharCode(d[a]);
    g = escCtrlChars(g);
    return g + '-' + n.join('-');
}
function AESDecryptCtr(d, s, i) {
    if (!(i == 128 || i == 192 || i == 256))
        return '';
    var g = i / 8;
    var h = new Array(g);
    for (var a = 0; a < g; a++)
        h[a] = s.charCodeAt(a) & 255;
    var r = KeyExpansion(h);
    var e = Cipher(h, r);
    e = e.concat(e.slice(0, g - 16));
    var o = KeyExpansion(e);
    d = d.split('-');
    var l = 16;
    var f = new Array(l);
    var m = unescCtrlChars(d[0]);
    for (var a = 0; a < 8; a++)
        f[a] = m.charCodeAt(a);
    var k = new Array(d.length - 1);
    for (var c = 1; c < d.length; c++) {
        for (var b = 0; b < 4; b++)
            f[15 - b] = c - 1 >>> b * 8 & 255;
        for (var b = 0; b < 4; b++)
            f[15 - b - 4] = c / 4294967296 - 1 >>> b * 8 & 255;
        var q = Cipher(f, o);
        d[c] = unescCtrlChars(d[c]);
        var j = '';
        for (var a = 0; a < d[c].length; a++) {
            var p = d[c].charCodeAt(a);
            var n = p ^ q[a];
            j += String.fromCharCode(n);
        }
        k[c - 1] = j;
    }
    return k.join('');
}
function escCtrlChars(a) {
    return a.replace(/[\0\t\n\v\f\r\xa0'"!-]/g, function (a) {
        return '!' + a.charCodeAt(0) + '!';
    });
}
function unescCtrlChars(a) {
    return a.replace(/!\d\d?\d?!/g, function (a) {
        return String.fromCharCode(a.slice(1, -1));
    });
}
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function encodeBase64(a) {
    var k, e, f, i, j, g, h, b, c = 0, d = '';
    a = encodeUTF8(a);
    do {
        k = a.charCodeAt(c++);
        e = a.charCodeAt(c++);
        f = a.charCodeAt(c++);
        b = k << 16 | e << 8 | f;
        i = b >> 18 & 63;
        j = b >> 12 & 63;
        g = b >> 6 & 63;
        h = b & 63;
        if (isNaN(f))
            h = 64;
        if (isNaN(e))
            g = 64;
        d += b64.charAt(i) + b64.charAt(j) + b64.charAt(g) + b64.charAt(h);
    } while (c < a.length);
    return d;
}
function decodeBase64(c) {
    var d, f, k, i, j, g, h, e, a = 0, b = '';
    do {
        i = b64.indexOf(c.charAt(a++));
        j = b64.indexOf(c.charAt(a++));
        g = b64.indexOf(c.charAt(a++));
        h = b64.indexOf(c.charAt(a++));
        e = i << 18 | j << 12 | g << 6 | h;
        d = e >> 16 & 255;
        f = e >> 8 & 255;
        k = e & 255;
        if (g == 64)
            b += String.fromCharCode(d);
        else if (h == 64)
            b += String.fromCharCode(d, f);
        else
            b += String.fromCharCode(d, f, k);
    } while (a < c.length);
    return decodeUTF8(b);
}
function encodeUTF8(a) {
    a = a.replace(/[\u0080-\u07ff]/g, function (b) {
        var a = b.charCodeAt(0);
        return String.fromCharCode(192 | a >> 6, 128 | a & 63);
    });
    a = a.replace(/[\u0800-\uffff]/g, function (b) {
        var a = b.charCodeAt(0);
        return String.fromCharCode(224 | a >> 12, 128 | a >> 6 & 63, 128 | a & 63);
    });
    return a;
}
function decodeUTF8(a) {
    a = a.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (a) {
        var b = (a.charCodeAt(0) & 31) << 6 | a.charCodeAt(1) & 63;
        return String.fromCharCode(b);
    });
    a = a.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function (a) {
        var b = (a.charCodeAt(0) & 15) << 12 | a.charCodeAt(1) & 63 << 6 | a.charCodeAt(2) & 63;
        return String.fromCharCode(b);
    });
    return a;
}
function byteArrayToHexStr(c) {
    var b = '';
    for (var a = 0; a < c.length; a++)
        b += c[a].toString(16) + ' ';
    return b;
}
var plainText = 'ROMEO: But, soft! what light through yonder window breaks?\nIt is the east, and Juliet is the sun.\nArise, fair sun, and kill the envious moon,\nWho is already sick and pale with grief,\nThat thou her maid art far more fair than she:\nBe not her maid, since she is envious;\nHer vestal livery is but sick and green\nAnd none but fools do wear it; cast it off.\nIt is my lady, O, it is my love!\nO, that she knew she were!\nShe speaks yet she says nothing: what of that?\nHer eye discourses; I will answer it.\nI am too bold, \'tis not to me she speaks:\nTwo of the fairest stars in all the heaven,\nHaving some business, do entreat her eyes\nTo twinkle in their spheres till they return.\nWhat if her eyes were there, they in her head?\nThe brightness of her cheek would shame those stars,\nAs daylight doth a lamp; her eyes in heaven\nWould through the airy region stream so bright\nThat birds would sing and think it were not night.\nSee, how she leans her cheek upon her hand!\nO, that I were a glove upon that hand,\nThat I might touch that cheek!\nJULIET: Ay me!\nROMEO: She speaks:\nO, speak again, bright angel! for thou art\nAs glorious to this night, being o\'er my head\nAs is a winged messenger of heaven\nUnto the white-upturned wondering eyes\nOf mortals that fall back to gaze on him\nWhen he bestrides the lazy-pacing clouds\nAnd sails upon the bosom of the air.';
var password = 'O Romeo, Romeo! wherefore art thou Romeo?';
var cipherText = AESEncryptCtr(plainText, password, 256);
var decryptedText = AESDecryptCtr(cipherText, password, 256);
if (decryptedText != plainText)
    throw 'ERROR: bad result: expected ' + plainText + ' but got ' + decryptedText;