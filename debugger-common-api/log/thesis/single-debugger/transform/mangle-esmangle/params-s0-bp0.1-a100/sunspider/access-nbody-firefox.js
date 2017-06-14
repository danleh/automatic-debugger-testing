var PI = 3.141592653589793;
var SOLAR_MASS = 4 * PI * PI;
var DAYS_PER_YEAR = 365.24;
function Body(a, b, c, d, e, f, g) {
    this.x = a;
    this.y = b;
    this.z = c;
    this.vx = d;
    this.vy = e;
    this.vz = f;
    this.mass = g;
}
Body.prototype.offsetMomentum = function (a, b, c) {
    this.vx = -a / SOLAR_MASS;
    this.vy = -b / SOLAR_MASS;
    this.vz = -c / SOLAR_MASS;
    return this;
};
function Jupiter() {
    return new Body(4.841431442464721, -1.1603200440274284, -0.10362204447112311, 0.001660076642744037 * DAYS_PER_YEAR, 0.007699011184197404 * DAYS_PER_YEAR, -0.0000690460016972063 * DAYS_PER_YEAR, 0.0009547919384243266 * SOLAR_MASS);
}
function Saturn() {
    return new Body(8.34336671824458, 4.124798564124305, -0.4035234171143214, -0.002767425107268624 * DAYS_PER_YEAR, 0.004998528012349172 * DAYS_PER_YEAR, 0.000023041729757376393 * DAYS_PER_YEAR, 0.0002858859806661308 * SOLAR_MASS);
}
function Uranus() {
    return new Body(12.894369562139131, -15.111151401698631, -0.22330757889265573, 0.002964601375647616 * DAYS_PER_YEAR, 0.0023784717395948095 * DAYS_PER_YEAR, -0.000029658956854023756 * DAYS_PER_YEAR, 0.00004366244043351563 * SOLAR_MASS);
}
function Neptune() {
    return new Body(15.379697114850917, -25.919314609987964, 0.17925877295037118, 0.0026806777249038932 * DAYS_PER_YEAR, 0.001628241700382423 * DAYS_PER_YEAR, -0.00009515922545197159 * DAYS_PER_YEAR, 0.000051513890204661145 * SOLAR_MASS);
}
function Sun() {
    return new Body(0, 0, 0, 0, 0, 0, SOLAR_MASS);
}
function NBodySystem(h) {
    this.bodies = h;
    var d = 0;
    var e = 0;
    var f = 0;
    var g = this.bodies.length;
    for (var b = 0; b < g; b++) {
        var a = this.bodies[b];
        var c = a.mass;
        d += a.vx * c;
        e += a.vy * c;
        f += a.vz * c;
    }
    this.bodies[0].offsetMomentum(d, e, f);
}
NBodySystem.prototype.advance = function (j) {
    var h, g, f, i, d;
    var k = this.bodies.length;
    for (var c = 0; c < k; c++) {
        var b = this.bodies[c];
        for (var l = c + 1; l < k; l++) {
            var a = this.bodies[l];
            h = b.x - a.x;
            g = b.y - a.y;
            f = b.z - a.z;
            i = Math.sqrt(h * h + g * g + f * f);
            d = j / (i * i * i);
            b.vx -= h * a.mass * d;
            b.vy -= g * a.mass * d;
            b.vz -= f * a.mass * d;
            a.vx += h * b.mass * d;
            a.vy += g * b.mass * d;
            a.vz += f * b.mass * d;
        }
    }
    for (var c = 0; c < k; c++) {
        var e = this.bodies[c];
        e.x += j * e.vx;
        e.y += j * e.vy;
        e.z += j * e.vz;
    }
};
NBodySystem.prototype.energy = function () {
    var f, i, h, j;
    var d = 0;
    var g = this.bodies.length;
    for (var c = 0; c < g; c++) {
        var a = this.bodies[c];
        d += 0.5 * a.mass * (a.vx * a.vx + a.vy * a.vy + a.vz * a.vz);
        for (var e = c + 1; e < g; e++) {
            var b = this.bodies[e];
            f = a.x - b.x;
            i = a.y - b.y;
            h = a.z - b.z;
            j = Math.sqrt(f * f + i * i + h * h);
            d -= a.mass * b.mass / j;
        }
    }
    return d;
};
var ret = 0;
for (var n = 3; n <= 24; n *= 2) {
    (function () {
        var a = new NBodySystem(Array(Sun(), Jupiter(), Saturn(), Uranus(), Neptune()));
        var c = n * 100;
        ret += a.energy();
        for (var b = 0; b < c; b++) {
            a.advance(0.01);
        }
        ret += a.energy();
    }());
}
var expected = -1.3524862408537381;
if (ret != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + ret;