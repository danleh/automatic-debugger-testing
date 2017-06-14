var last = 42, A = 3877, C = 29573, M = 139968;

function rand(max) {
    last = (last * A + C) % M;
    return max * last / M;
}

var ALU = "GGCCGGGCGCGGTGGCTCACGCCTGTAATCCCAGCACTTTGG" + "GAGGCCGAGGCGGGCGGATCACCTGAGGTCAGGAGTTCGAGA" + "CCAGCCTGGCCAACATGGTGAAACCCCGTCTCTACTAAAAAT" + "ACAAAAATTAGCCGGGCGTGGTGGCGCGCGCCTGTAATCCCA" + "GCTACTCGGGAGGCTGAGGCAGGAGAATCGCTTGAACCCGGG" + "AGGCGGAGGTTGCAGTGAGCCGAGATCGCGCCACTGCACTCC" + "AGCCTGGGCGACAGAGCGAGACTCCGTCTCAAAAA";

var IUB = {
    a: .27,
    c: .12,
    g: .12,
    t: .27,
    B: .02,
    D: .02,
    H: .02,
    K: .02,
    M: .02,
    N: .02,
    R: .02,
    S: .02,
    V: .02,
    W: .02,
    Y: .02
};

var HomoSap = {
    a: .302954942668,
    c: .1979883004921,
    g: .1975473066391,
    t: .3015094502008
};

function makeCumulative(table) {
    var last = null;
    for (var c in table) {
        if (last) table[c] += table[last];
        last = c;
    }
}

function fastaRepeat(n, seq) {
    var seqi = 0, lenOut = 60;
    while (n > 0) {
        if (n < lenOut) lenOut = n;
        if (seqi + lenOut < seq.length) {
            ret += seq.substring(seqi, seqi + lenOut).length;
            seqi += lenOut;
        } else {
            var s = seq.substring(seqi);
            seqi = lenOut - s.length;
            ret += (s + seq.substring(0, seqi)).length;
        }
        n -= lenOut;
    }
}

function fastaRandom(n, table) {
    var line = new Array(60);
    makeCumulative(table);
    while (n > 0) {
        if (n < line.length) line = new Array(n);
        for (var i = 0; i < line.length; i++) {
            var r = rand(1);
            for (var c in table) {
                if (r < table[c]) {
                    line[i] = c;
                    break;
                }
            }
        }
        ret += line.join("").length;
        n -= line.length;
    }
}

var ret = 0;

var count = 7;

fastaRepeat(2 * count * 1e5, ALU);

fastaRandom(3 * count * 1e3, IUB);

fastaRandom(5 * count * 1e3, HomoSap);

var expected = 1456e3;

if (ret != expected) throw "ERROR: bad result: expected " + expected + " but got " + ret;