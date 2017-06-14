var result = 0;

function fast3bitlookup(b) {
    var c, bi3b = 59796;
    c = 3 & bi3b >> (b << 1 & 14);
    c += 3 & bi3b >> (b >> 2 & 14);
    c += 3 & bi3b >> (b >> 5 & 6);
    return c;
}

function TimeFunc(func) {
    var x, y, t;
    var sum = 0;
    for (var x = 0; x < 500; x++) for (var y = 0; y < 256; y++) sum += func(y);
    return sum;
}

sum = TimeFunc(fast3bitlookup);

var expected = 512e3;

if (sum != expected) throw "ERROR: bad result: expected " + expected + " but got " + sum;