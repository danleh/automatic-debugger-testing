var result = 0;

function fast3bitlookup(e) {
    var t, r = 59796;
    t = 3 & r >> (e << 1 & 14);
    t += 3 & r >> (e >> 2 & 14);
    t += 3 & r >> (e >> 5 & 6);
    return t;
}

function TimeFunc(e) {
    var t, r, u;
    var a = 0;
    for (var t = 0; t < 500; t++) for (var r = 0; r < 256; r++) a += e(r);
    return a;
}

sum = TimeFunc(fast3bitlookup);

var expected = 512e3;

if (sum != expected) throw "ERROR: bad result: expected " + expected + " but got " + sum;