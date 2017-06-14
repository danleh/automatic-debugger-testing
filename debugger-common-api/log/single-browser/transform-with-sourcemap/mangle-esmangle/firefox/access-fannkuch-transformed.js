function fannkuch(d) {
    var j = 0;
    var e = Array(d);
    var c = Array(d);
    var f = Array(d);
    var n = Array(d);
    var h = 0;
    var l = d - 1;
    for (var a = 0; a < d; a++)
        c[a] = a;
    var b = d;
    while (true) {
        if (j < 30) {
            var m = '';
            for (var a = 0; a < d; a++)
                m += (c[a] + 1).toString();
            j++;
        }
        while (b != 1) {
            f[b - 1] = b;
            b--;
        }
        if (!(c[0] == 0 || c[l] == l)) {
            for (var a = 0; a < d; a++)
                e[a] = c[a];
            var i = 0;
            var g;
            while (!((g = e[0]) == 0)) {
                var o = g + 1 >> 1;
                for (var a = 0; a < o; a++) {
                    var p = e[a];
                    e[a] = e[g - a];
                    e[g - a] = p;
                }
                i++;
            }
            if (i > h) {
                h = i;
                for (var a = 0; a < d; a++)
                    n[a] = c[a];
            }
        }
        while (true) {
            if (b == d)
                return h;
            var q = c[0];
            var a = 0;
            while (a < b) {
                var k = a + 1;
                c[a] = c[k];
                a = k;
            }
            c[b] = q;
            f[b] = f[b] - 1;
            if (f[b] > 0)
                break;
            b++;
        }
    }
}
var n = 8;
var ret = fannkuch(n);
var expected = 22;
if (ret != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + ret;