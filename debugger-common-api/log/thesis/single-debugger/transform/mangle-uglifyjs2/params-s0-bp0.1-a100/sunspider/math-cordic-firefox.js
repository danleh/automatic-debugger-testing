var AG_CONST = .607252935;

function FIXED(e) {
    return e * 65536;
}

function FLOAT(e) {
    return e / 65536;
}

function DEG2RAD(e) {
    return .017453 * e;
}

var Angles = [ FIXED(45), FIXED(26.565), FIXED(14.0362), FIXED(7.12502), FIXED(3.57633), FIXED(1.78991), FIXED(.895174), FIXED(.447614), FIXED(.223811), FIXED(.111906), FIXED(.055953), FIXED(.027977) ];

var Target = 28.027;

function cordicsincos(e) {
    var r;
    var t;
    var a;
    var n;
    var c;
    r = FIXED(AG_CONST);
    t = 0;
    a = FIXED(e);
    n = 0;
    for (c = 0; c < 12; c++) {
        var o;
        if (a > n) {
            o = r - (t >> c);
            t = (r >> c) + t;
            r = o;
            n += Angles[c];
        } else {
            o = r + (t >> c);
            t = -(r >> c) + t;
            r = o;
            n -= Angles[c];
        }
    }
    return FLOAT(r) * FLOAT(t);
}

var total = 0;

function cordic(e) {
    var r = new Date();
    for (var t = 0; t < e; t++) {
        total += cordicsincos(Target);
    }
    var a = new Date();
    return a.getTime() - r.getTime();
}

cordic(25e3);

var expected = 10362.570468755888;

if (total != expected) throw "ERROR: bad result: expected " + expected + " but got " + total;