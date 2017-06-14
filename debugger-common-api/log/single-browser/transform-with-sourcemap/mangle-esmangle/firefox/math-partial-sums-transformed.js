function partial(f) {
    var d = a2 = a3 = a4 = a5 = a6 = a7 = a8 = a9 = 0;
    var e = 2 / 3;
    var b = -1;
    var c = k3 = sk = ck = 0;
    for (var a = 1; a <= f; a++) {
        c = a * a;
        k3 = c * a;
        sk = Math.sin(a);
        ck = Math.cos(a);
        b = -b;
        d += Math.pow(e, a - 1);
        a2 += Math.pow(a, -0.5);
        a3 += 1 / (a * (a + 1));
        a4 += 1 / (k3 * sk * sk);
        a5 += 1 / (k3 * ck * ck);
        a6 += 1 / a;
        a7 += 1 / c;
        a8 += b / a;
        a9 += b / (2 * a - 1);
    }
    return a6 + a7 + a8 + a9;
}
var total = 0;
for (var i = 1024; i <= 16384; i *= 2) {
    total += partial(i);
}
var expected = 60.08994194659945;
if (total != expected) {
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + total;
}