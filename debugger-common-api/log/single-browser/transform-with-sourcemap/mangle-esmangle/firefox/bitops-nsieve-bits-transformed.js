function pad(b, c) {
    var a = b.toString();
    while (a.length < c)
        a = ' ' + a;
    return a;
}
function primes(d, g) {
    var a, e = 0, c = 10000 << g, f = c + 31 >> 5;
    for (a = 0; a < f; a++)
        d[a] = 4294967295;
    for (a = 2; a < c; a++)
        if (d[a >> 5] & 1 << (a & 31)) {
            for (var b = a + a; b < c; b += a)
                d[b >> 5] &= ~(1 << (b & 31));
            e++;
        }
}
function sieve() {
    for (var a = 4; a <= 4; a++) {
        var b = new Array((10000 << a) + 31 >> 5);
        primes(b, a);
    }
    return b;
}
var result = sieve();
var sum = 0;
for (var i = 0; i < result.length; ++i)
    sum += result[i];
var expected = -1286749544853;
if (sum != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + sum;