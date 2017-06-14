function pad(n, width) {
    var s = n.toString();
    while (s.length < width) s = " " + s;
    return s;
}

function primes(isPrime, n) {
    var i, count = 0, m = 1e4 << n, size = m + 31 >> 5;
    for (i = 0; i < size; i++) isPrime[i] = 4294967295;
    for (i = 2; i < m; i++) if (isPrime[i >> 5] & 1 << (i & 31)) {
        for (var j = i + i; j < m; j += i) isPrime[j >> 5] &= ~(1 << (j & 31));
        count++;
    }
}

function sieve() {
    for (var i = 4; i <= 4; i++) {
        var isPrime = new Array((1e4 << i) + 31 >> 5);
        primes(isPrime, i);
    }
    return isPrime;
}

var result = sieve();

var sum = 0;

for (var i = 0; i < result.length; ++i) sum += result[i];

var expected = -1286749544853;

if (sum != expected) throw "ERROR: bad result: expected " + expected + " but got " + sum;