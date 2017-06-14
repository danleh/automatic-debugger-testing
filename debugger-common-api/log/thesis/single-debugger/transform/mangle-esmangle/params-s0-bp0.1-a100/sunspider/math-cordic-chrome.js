var AG_CONST = 0.607252935;
function FIXED(a) {
    return a * 65536;
}
function FLOAT(a) {
    return a / 65536;
}
function DEG2RAD(a) {
    return 0.017453 * a;
}
var Angles = [
    FIXED(45),
    FIXED(26.565),
    FIXED(14.0362),
    FIXED(7.12502),
    FIXED(3.57633),
    FIXED(1.78991),
    FIXED(0.895174),
    FIXED(0.447614),
    FIXED(0.223811),
    FIXED(0.111906),
    FIXED(0.055953),
    FIXED(0.027977)
];
var Target = 28.027;
function cordicsincos(g) {
    var b;
    var c;
    var f;
    var d;
    var a;
    b = FIXED(AG_CONST);
    c = 0;
    f = FIXED(g);
    d = 0;
    for (a = 0; a < 12; a++) {
        var e;
        if (f > d) {
            e = b - (c >> a);
            c = (b >> a) + c;
            b = e;
            d += Angles[a];
        } else {
            e = b + (c >> a);
            c = -(b >> a) + c;
            b = e;
            d -= Angles[a];
        }
    }
    return FLOAT(b) * FLOAT(c);
}
var total = 0;
function cordic(d) {
    var b = new Date();
    for (var a = 0; a < d; a++) {
        total += cordicsincos(Target);
    }
    var c = new Date();
    return c.getTime() - b.getTime();
}
cordic(25000);
var expected = 10362.570468755888;
if (total != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + total;