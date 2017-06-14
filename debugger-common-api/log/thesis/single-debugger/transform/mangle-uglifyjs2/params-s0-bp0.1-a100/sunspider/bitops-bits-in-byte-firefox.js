var result = 0;

function bitsinbyte(e) {
    var t = 1, r = 0;
    while (t < 256) {
        if (e & t) r++;
        t <<= 1;
    }
    return r;
}

function TimeFunc(e) {
    var t, r, u;
    var i = 0;
    for (var t = 0; t < 350; t++) for (var r = 0; r < 256; r++) i += e(r);
    return i;
}

result = TimeFunc(bitsinbyte);

var expected = 358400;

if (result != expected) throw "ERROR: bad result: expected " + expected + " but got " + result;