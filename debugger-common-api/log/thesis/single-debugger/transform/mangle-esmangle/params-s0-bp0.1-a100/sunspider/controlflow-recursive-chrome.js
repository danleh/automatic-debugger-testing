function ack(a, b) {
    if (a == 0) {
        return b + 1;
    }
    if (b == 0) {
        return ack(a - 1, 1);
    }
    return ack(a - 1, ack(a, b - 1));
}
function fib(a) {
    if (a < 2) {
        return 1;
    }
    return fib(a - 2) + fib(a - 1);
}
function tak(a, b, c) {
    if (b >= a)
        return c;
    return tak(tak(a - 1, b, c), tak(b - 1, c, a), tak(c - 1, a, b));
}
var result = 0;
for (var i = 3; i <= 5; i++) {
    result += ack(3, i);
    result += fib(17 + i);
    result += tak(3 * i + 3, 2 * i + 2, i + 1);
}
var expected = 57775;
if (result != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + result;