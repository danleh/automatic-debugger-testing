function partial(a) {
    var t = a2 = a3 = a4 = a5 = a6 = a7 = a8 = a9 = 0;
    var r = 2 / 3;
    var e = -1;
    var k = k3 = sk = ck = 0;
    for (var o = 1; o <= a; o++) {
        k = o * o;
        k3 = k * o;
        sk = Math.sin(o);
        ck = Math.cos(o);
        e = -e;
        t += Math.pow(r, o - 1);
        a2 += Math.pow(o, -.5);
        a3 += 1 / (o * (o + 1));
        a4 += 1 / (k3 * sk * sk);
        a5 += 1 / (k3 * ck * ck);
        a6 += 1 / o;
        a7 += 1 / k;
        a8 += e / o;
        a9 += e / (2 * o - 1);
    }
    return a6 + a7 + a8 + a9;
}

var total = 0;

for (var i = 1024; i <= 16384; i *= 2) {
    total += partial(i);
}

var expected = 60.08994194659945;

if (total != expected) {
    throw "ERROR: bad result: expected " + expected + " but got " + total;
}