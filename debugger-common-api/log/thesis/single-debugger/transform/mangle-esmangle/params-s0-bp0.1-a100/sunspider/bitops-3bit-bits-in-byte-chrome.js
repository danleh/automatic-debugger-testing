var result = 0;
function fast3bitlookup(c) {
    var a, b = 59796;
    a = 3 & b >> (c << 1 & 14);
    a += 3 & b >> (c >> 2 & 14);
    a += 3 & b >> (c >> 5 & 6);
    return a;
}
function TimeFunc(d) {
    var b, a, e;
    var c = 0;
    for (var b = 0; b < 500; b++)
        for (var a = 0; a < 256; a++)
            c += d(a);
    return c;
}
sum = TimeFunc(fast3bitlookup);
var expected = 512000;
if (sum != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + sum;