var last = 42, A = 3877, C = 29573, M = 139968;
function rand(a) {
    last = (last * A + C) % M;
    return a * last / M;
}
var ALU = 'GGCCGGGCGCGGTGGCTCACGCCTGTAATCCCAGCACTTTGG' + 'GAGGCCGAGGCGGGCGGATCACCTGAGGTCAGGAGTTCGAGA' + 'CCAGCCTGGCCAACATGGTGAAACCCCGTCTCTACTAAAAAT' + 'ACAAAAATTAGCCGGGCGTGGTGGCGCGCGCCTGTAATCCCA' + 'GCTACTCGGGAGGCTGAGGCAGGAGAATCGCTTGAACCCGGG' + 'AGGCGGAGGTTGCAGTGAGCCGAGATCGCGCCACTGCACTCC' + 'AGCCTGGGCGACAGAGCGAGACTCCGTCTCAAAAA';
var IUB = {
    a: 0.27,
    c: 0.12,
    g: 0.12,
    t: 0.27,
    B: 0.02,
    D: 0.02,
    H: 0.02,
    K: 0.02,
    M: 0.02,
    N: 0.02,
    R: 0.02,
    S: 0.02,
    V: 0.02,
    W: 0.02,
    Y: 0.02
};
var HomoSap = {
    a: 0.302954942668,
    c: 0.1979883004921,
    g: 0.1975473066391,
    t: 0.3015094502008
};
function makeCumulative(b) {
    var a = null;
    for (var c in b) {
        if (a)
            b[c] += b[a];
        a = c;
    }
}
function fastaRepeat(c, d) {
    var a = 0, b = 60;
    while (c > 0) {
        if (c < b)
            b = c;
        if (a + b < d.length) {
            ret += d.substring(a, a + b).length;
            a += b;
        } else {
            var e = d.substring(a);
            a = b - e.length;
            ret += (e + d.substring(0, a)).length;
        }
        c -= b;
    }
}
function fastaRandom(b, d) {
    var a = new Array(60);
    makeCumulative(d);
    while (b > 0) {
        if (b < a.length)
            a = new Array(b);
        for (var c = 0; c < a.length; c++) {
            var f = rand(1);
            for (var e in d) {
                if (f < d[e]) {
                    a[c] = e;
                    break;
                }
            }
        }
        ret += a.join('').length;
        b -= a.length;
    }
}
var ret = 0;
var count = 7;
fastaRepeat(2 * count * 100000, ALU);
fastaRandom(3 * count * 1000, IUB);
fastaRandom(5 * count * 1000, HomoSap);
var expected = 1456000;
if (ret != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + ret;