function A(t, r) {
    return 1 / ((t + r) * (t + r + 1) / 2 + t + 1);
}

function Au(t, r) {
    for (var e = 0; e < t.length; ++e) {
        var o = 0;
        for (var a = 0; a < t.length; ++a) o += A(e, a) * t[a];
        r[e] = o;
    }
}

function Atu(t, r) {
    for (var e = 0; e < t.length; ++e) {
        var o = 0;
        for (var a = 0; a < t.length; ++a) o += A(a, e) * t[a];
        r[e] = o;
    }
}

function AtAu(t, r, e) {
    Au(t, e);
    Atu(e, r);
}

function spectralnorm(t) {
    var r, e = [], o = [], a = [], n = 0, u = 0;
    for (r = 0; r < t; ++r) {
        e[r] = 1;
        o[r] = a[r] = 0;
    }
    for (r = 0; r < 10; ++r) {
        AtAu(e, o, a);
        AtAu(o, e, a);
    }
    for (r = 0; r < t; ++r) {
        u += e[r] * o[r];
        n += o[r] * o[r];
    }
    return Math.sqrt(u / n);
}

var total = 0;

for (var i = 6; i <= 48; i *= 2) {
    total += spectralnorm(i);
}

var expected = 5.086694231303284;

if (total != expected) throw "ERROR: bad result: expected " + expected + " but got " + total;