var PI = 3.141592653589793;

var SOLAR_MASS = 4 * PI * PI;

var DAYS_PER_YEAR = 365.24;

function Body(t, e, r, s, n, v, a) {
    this.x = t;
    this.y = e;
    this.z = r;
    this.vx = s;
    this.vy = n;
    this.vz = v;
    this.mass = a;
}

Body.prototype.offsetMomentum = function(t, e, r) {
    this.vx = -t / SOLAR_MASS;
    this.vy = -e / SOLAR_MASS;
    this.vz = -r / SOLAR_MASS;
    return this;
};

function Jupiter() {
    return new Body(4.841431442464721, -1.1603200440274284, -.10362204447112311, .001660076642744037 * DAYS_PER_YEAR, .007699011184197404 * DAYS_PER_YEAR, -690460016972063e-19 * DAYS_PER_YEAR, .0009547919384243266 * SOLAR_MASS);
}

function Saturn() {
    return new Body(8.34336671824458, 4.124798564124305, -.4035234171143214, -.002767425107268624 * DAYS_PER_YEAR, .004998528012349172 * DAYS_PER_YEAR, 23041729757376393e-21 * DAYS_PER_YEAR, .0002858859806661308 * SOLAR_MASS);
}

function Uranus() {
    return new Body(12.894369562139131, -15.111151401698631, -.22330757889265573, .002964601375647616 * DAYS_PER_YEAR, .0023784717395948095 * DAYS_PER_YEAR, -29658956854023756e-21 * DAYS_PER_YEAR, 4366244043351563e-20 * SOLAR_MASS);
}

function Neptune() {
    return new Body(15.379697114850917, -25.919314609987964, .17925877295037118, .0026806777249038932 * DAYS_PER_YEAR, .001628241700382423 * DAYS_PER_YEAR, -9515922545197159e-20 * DAYS_PER_YEAR, 51513890204661145e-21 * SOLAR_MASS);
}

function Sun() {
    return new Body(0, 0, 0, 0, 0, 0, SOLAR_MASS);
}

function NBodySystem(t) {
    this.bodies = t;
    var e = 0;
    var r = 0;
    var s = 0;
    var n = this.bodies.length;
    for (var v = 0; v < n; v++) {
        var a = this.bodies[v];
        var o = a.mass;
        e += a.vx * o;
        r += a.vy * o;
        s += a.vz * o;
    }
    this.bodies[0].offsetMomentum(e, r, s);
}

NBodySystem.prototype.advance = function(t) {
    var e, r, s, n, v;
    var a = this.bodies.length;
    for (var o = 0; o < a; o++) {
        var S = this.bodies[o];
        for (var i = o + 1; i < a; i++) {
            var A = this.bodies[i];
            e = S.x - A.x;
            r = S.y - A.y;
            s = S.z - A.z;
            n = Math.sqrt(e * e + r * r + s * s);
            v = t / (n * n * n);
            S.vx -= e * A.mass * v;
            S.vy -= r * A.mass * v;
            S.vz -= s * A.mass * v;
            A.vx += e * S.mass * v;
            A.vy += r * S.mass * v;
            A.vz += s * S.mass * v;
        }
    }
    for (var o = 0; o < a; o++) {
        var R = this.bodies[o];
        R.x += t * R.vx;
        R.y += t * R.vy;
        R.z += t * R.vz;
    }
};

NBodySystem.prototype.energy = function() {
    var t, e, r, s;
    var n = 0;
    var v = this.bodies.length;
    for (var a = 0; a < v; a++) {
        var o = this.bodies[a];
        n += .5 * o.mass * (o.vx * o.vx + o.vy * o.vy + o.vz * o.vz);
        for (var S = a + 1; S < v; S++) {
            var i = this.bodies[S];
            t = o.x - i.x;
            e = o.y - i.y;
            r = o.z - i.z;
            s = Math.sqrt(t * t + e * e + r * r);
            n -= o.mass * i.mass / s;
        }
    }
    return n;
};

var ret = 0;

for (var n = 3; n <= 24; n *= 2) {
    (function() {
        var t = new NBodySystem(Array(Sun(), Jupiter(), Saturn(), Uranus(), Neptune()));
        var e = n * 100;
        ret += t.energy();
        for (var r = 0; r < e; r++) {
            t.advance(.01);
        }
        ret += t.energy();
    })();
}

var expected = -1.3524862408537381;

if (ret != expected) throw "ERROR: bad result: expected " + expected + " but got " + ret;