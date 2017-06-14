function pad(e, r) {
    var t = e.toString();
    var a = r - t.length;
    if (a > 0) {
        for (var v = 1; v <= a; v++) t = " " + t;
    }
    return t;
}

function nsieve(e, r) {
    var t, a, v;
    for (t = 2; t <= e; t++) {
        r[t] = true;
    }
    v = 0;
    for (t = 2; t <= e; t++) {
        if (r[t]) {
            for (a = t + t; a <= e; a += t) r[a] = false;
            v++;
        }
    }
    return v;
}

function sieve() {
    var e = 0;
    for (var r = 1; r <= 3; r++) {
        var t = (1 << r) * 1e4;
        var a = Array(t + 1);
        e += nsieve(t, a);
    }
    return e;
}

var result = sieve();

var expected = 14302;

if (result != expected) throw "ERROR: bad result: expected " + expected + " but got " + result;