function pad(e, r) {
    var t = e.toString();
    while (t.length < r) t = " " + t;
    return t;
}

function primes(e, r) {
    var t, i = 0, u = 1e4 << r, a = u + 31 >> 5;
    for (t = 0; t < a; t++) e[t] = 4294967295;
    for (t = 2; t < u; t++) if (e[t >> 5] & 1 << (t & 31)) {
        for (var n = t + t; n < u; n += t) e[n >> 5] &= ~(1 << (n & 31));
        i++;
    }
}

function sieve() {
    for (var e = 4; e <= 4; e++) {
        var r = new Array((1e4 << e) + 31 >> 5);
        primes(r, e);
    }
    return r;
}

var result = sieve();

var sum = 0;

for (var i = 0; i < result.length; ++i) sum += result[i];

var expected = -1286749544853;

if (sum != expected) throw "ERROR: bad result: expected " + expected + " but got " + sum;