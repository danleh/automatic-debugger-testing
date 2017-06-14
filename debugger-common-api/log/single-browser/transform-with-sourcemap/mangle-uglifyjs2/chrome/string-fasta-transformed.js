var last = 42, A = 3877, C = 29573, M = 139968;

function rand(G) {
    last = (last * A + C) % M;
    return G * last / M;
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

function makeCumulative(G) {
    var C = null;
    for (var A in G) {
        if (C) G[A] += G[C];
        C = A;
    }
}

function fastaRepeat(G, C) {
    var A = 0, t = 60;
    while (G > 0) {
        if (G < t) t = G;
        if (A + t < C.length) {
            ret += C.substring(A, A + t).length;
            A += t;
        } else {
            var a = C.substring(A);
            A = t - a.length;
            ret += (a + C.substring(0, A)).length;
        }
        G -= t;
    }
}

function fastaRandom(G, C) {
    var A = new Array(60);
    makeCumulative(C);
    while (G > 0) {
        if (G < A.length) A = new Array(G);
        for (var t = 0; t < A.length; t++) {
            var a = rand(1);
            for (var e in C) {
                if (a < C[e]) {
                    A[t] = e;
                    break;
                }
            }
        }
        ret += A.join("").length;
        G -= A.length;
    }
}

var ret = 0;

var count = 7;

fastaRepeat(2 * count * 1e5, ALU);

fastaRandom(3 * count * 1e3, IUB);

fastaRandom(5 * count * 1e3, HomoSap);

var expected = 1456e3;

if (ret != expected) throw "ERROR: bad result: expected " + expected + " but got " + ret;