function fannkuch(r) {
    var a = 0;
    var e = Array(r);
    var v = Array(r);
    var t = Array(r);
    var f = Array(r);
    var i = 0;
    var n = r - 1;
    for (var o = 0; o < r; o++) v[o] = o;
    var h = r;
    while (true) {
        if (a < 30) {
            var u = "";
            for (var o = 0; o < r; o++) u += (v[o] + 1).toString();
            a++;
        }
        while (h != 1) {
            t[h - 1] = h;
            h--;
        }
        if (!(v[0] == 0 || v[n] == n)) {
            for (var o = 0; o < r; o++) e[o] = v[o];
            var c = 0;
            var l;
            while (!((l = e[0]) == 0)) {
                var w = l + 1 >> 1;
                for (var o = 0; o < w; o++) {
                    var d = e[o];
                    e[o] = e[l - o];
                    e[l - o] = d;
                }
                c++;
            }
            if (c > i) {
                i = c;
                for (var o = 0; o < r; o++) f[o] = v[o];
            }
        }
        while (true) {
            if (h == r) return i;
            var p = v[0];
            var o = 0;
            while (o < h) {
                var x = o + 1;
                v[o] = v[x];
                o = x;
            }
            v[h] = p;
            t[h] = t[h] - 1;
            if (t[h] > 0) break;
            h++;
        }
    }
}

var n = 8;

var ret = fannkuch(n);

var expected = 22;

if (ret != expected) throw "ERROR: bad result: expected " + expected + " but got " + ret;