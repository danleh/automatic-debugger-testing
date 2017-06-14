var result = 0;
function bitsinbyte(c) {
    var a = 1, b = 0;
    while (a < 256) {
        if (c & a)
            b++;
        a <<= 1;
    }
    return b;
}
function TimeFunc(d) {
    var b, a, e;
    var c = 0;
    for (var b = 0; b < 350; b++)
        for (var a = 0; a < 256; a++)
            c += d(a);
    return c;
}
result = TimeFunc(bitsinbyte);
var expected = 358400;
if (result != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + result;