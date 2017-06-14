function pad(d, e) {
    var a = d.toString();
    var b = e - a.length;
    if (b > 0) {
        for (var c = 1; c <= b; c++)
            a = ' ' + a;
    }
    return a;
}
function nsieve(c, d) {
    var a, b, e;
    for (a = 2; a <= c; a++) {
        d[a] = true;
    }
    e = 0;
    for (a = 2; a <= c; a++) {
        if (d[a]) {
            for (b = a + a; b <= c; b += a)
                d[b] = false;
            e++;
        }
    }
    return e;
}
function sieve() {
    var b = 0;
    for (var a = 1; a <= 3; a++) {
        var c = (1 << a) * 10000;
        var d = Array(c + 1);
        b += nsieve(c, d);
    }
    return b;
}
var result = sieve();
var expected = 14302;
if (result != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + result;