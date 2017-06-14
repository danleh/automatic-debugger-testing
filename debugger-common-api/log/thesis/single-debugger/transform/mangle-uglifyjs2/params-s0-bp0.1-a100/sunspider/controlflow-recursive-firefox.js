function ack(t, e) {
    if (t == 0) {
        return e + 1;
    }
    if (e == 0) {
        return ack(t - 1, 1);
    }
    return ack(t - 1, ack(t, e - 1));
}

function fib(t) {
    if (t < 2) {
        return 1;
    }
    return fib(t - 2) + fib(t - 1);
}

function tak(t, e, r) {
    if (e >= t) return r;
    return tak(tak(t - 1, e, r), tak(e - 1, r, t), tak(r - 1, t, e));
}

var result = 0;

for (var i = 3; i <= 5; i++) {
    result += ack(3, i);
    result += fib(17 + i);
    result += tak(3 * i + 3, 2 * i + 2, i + 1);
}

var expected = 57775;

if (result != expected) throw "ERROR: bad result: expected " + expected + " but got " + result;