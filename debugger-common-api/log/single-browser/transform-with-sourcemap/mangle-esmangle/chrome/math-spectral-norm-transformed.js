function A(a, b) {
    return 1 / ((a + b) * (a + b + 1) / 2 + a + 1);
}
function Au(c, e) {
    for (var a = 0; a < c.length; ++a) {
        var d = 0;
        for (var b = 0; b < c.length; ++b)
            d += A(a, b) * c[b];
        e[a] = d;
    }
}
function Atu(c, e) {
    for (var a = 0; a < c.length; ++a) {
        var d = 0;
        for (var b = 0; b < c.length; ++b)
            d += A(b, a) * c[b];
        e[a] = d;
    }
}
function AtAu(b, c, a) {
    Au(b, a);
    Atu(a, c);
}
function spectralnorm(g) {
    var a, c = [], b = [], d = [], e = 0, f = 0;
    for (a = 0; a < g; ++a) {
        c[a] = 1;
        b[a] = d[a] = 0;
    }
    for (a = 0; a < 10; ++a) {
        AtAu(c, b, d);
        AtAu(b, c, d);
    }
    for (a = 0; a < g; ++a) {
        f += c[a] * b[a];
        e += b[a] * b[a];
    }
    return Math.sqrt(f / e);
}
var total = 0;
for (var i = 6; i <= 48; i *= 2) {
    total += spectralnorm(i);
}
var expected = 5.086694231303284;
if (total != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + total;