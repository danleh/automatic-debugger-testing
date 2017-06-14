function createVector(r, e, t) {
    return new Array(r, e, t);
}

function sqrLengthVector(r) {
    return r[0] * r[0] + r[1] * r[1] + r[2] * r[2];
}

function lengthVector(r) {
    return Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
}

function addVector(r, e) {
    r[0] += e[0];
    r[1] += e[1];
    r[2] += e[2];
    return r;
}

function subVector(r, e) {
    r[0] -= e[0];
    r[1] -= e[1];
    r[2] -= e[2];
    return r;
}

function scaleVector(r, e) {
    r[0] *= e;
    r[1] *= e;
    r[2] *= e;
    return r;
}

function normaliseVector(r) {
    var e = Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
    r[0] /= e;
    r[1] /= e;
    r[2] /= e;
    return r;
}

function add(r, e) {
    return new Array(r[0] + e[0], r[1] + e[1], r[2] + e[2]);
}

function sub(r, e) {
    return new Array(r[0] - e[0], r[1] - e[1], r[2] - e[2]);
}

function scalev(r, e) {
    return new Array(r[0] * e[0], r[1] * e[1], r[2] * e[2]);
}

function dot(r, e) {
    return r[0] * e[0] + r[1] * e[1] + r[2] * e[2];
}

function scale(r, e) {
    return [ r[0] * e, r[1] * e, r[2] * e ];
}

function cross(r, e) {
    return [ r[1] * e[2] - r[2] * e[1], r[2] * e[0] - r[0] * e[2], r[0] * e[1] - r[1] * e[0] ];
}

function normalise(r) {
    var e = lengthVector(r);
    return [ r[0] / e, r[1] / e, r[2] / e ];
}

function transformMatrix(r, e) {
    var t = r;
    var a = t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3];
    var n = t[4] * e[0] + t[5] * e[1] + t[6] * e[2] + t[7];
    var i = t[8] * e[0] + t[9] * e[1] + t[10] * e[2] + t[11];
    return [ a, n, i ];
}

function invertMatrix(r) {
    var e = new Array(16);
    var t = -r[3];
    var a = -r[7];
    var n = -r[11];
    for (h = 0; h < 3; h++) for (v = 0; v < 3; v++) e[h + v * 4] = r[v + h * 4];
    for (i = 0; i < 11; i++) r[i] = e[i];
    r[3] = t * r[0] + a * r[1] + n * r[2];
    r[7] = t * r[4] + a * r[5] + n * r[6];
    r[11] = t * r[8] + a * r[9] + n * r[10];
    return r;
}

function Triangle(r, e, t) {
    var a = sub(t, r);
    var n = sub(e, r);
    var i = cross(a, n);
    if (Math.abs(i[0]) > Math.abs(i[1])) if (Math.abs(i[0]) > Math.abs(i[2])) this.axis = 0; else this.axis = 2; else if (Math.abs(i[1]) > Math.abs(i[2])) this.axis = 1; else this.axis = 2;
    var s = (this.axis + 1) % 3;
    var o = (this.axis + 2) % 3;
    var c = a[s];
    var l = a[o];
    var v = n[s];
    var h = n[o];
    this.normal = normalise(i);
    this.nu = i[s] / i[this.axis];
    this.nv = i[o] / i[this.axis];
    this.nd = dot(i, r) / i[this.axis];
    var u = c * h - l * v;
    this.eu = r[s];
    this.ev = r[o];
    this.nu1 = c / u;
    this.nv1 = -l / u;
    this.nu2 = h / u;
    this.nv2 = -v / u;
    this.material = [ .7, .7, .7 ];
}

Triangle.prototype.intersect = function(r, e, t, a) {
    var n = (this.axis + 1) % 3;
    var i = (this.axis + 2) % 3;
    var s = e[this.axis] + this.nu * e[n] + this.nv * e[i];
    var o = (this.nd - r[this.axis] - this.nu * r[n] - this.nv * r[i]) / s;
    if (o < t || o > a) return null;
    var c = r[n] + o * e[n] - this.eu;
    var l = r[i] + o * e[i] - this.ev;
    var v = l * this.nu1 + c * this.nv1;
    if (v < 0) return null;
    var h = c * this.nu2 + l * this.nv2;
    if (h < 0) return null;
    if (v + h > 1) return null;
    return o;
};

function Scene(r) {
    this.triangles = r;
    this.lights = [];
    this.ambient = [ 0, 0, 0 ];
    this.background = [ .8, .8, 1 ];
}

var zero = new Array(0, 0, 0);

Scene.prototype.intersect = function(r, e, t, a) {
    var n = null;
    for (f = 0; f < this.triangles.length; f++) {
        var i = this.triangles[f];
        var s = i.intersect(r, e, t, a);
        if (s == null || s > a || s < t) continue;
        a = s;
        n = i;
    }
    if (!n) return [ this.background[0], this.background[1], this.background[2] ];
    var o = n.normal;
    var c = add(r, scale(e, a));
    if (dot(e, o) > 0) o = [ -o[0], -o[1], -o[2] ];
    var l = null;
    if (n.shader) {
        l = n.shader(n, c, e);
    } else {
        l = n.material;
    }
    var v = null;
    if (l.reflection > .001) {
        var h = addVector(scale(o, -2 * dot(e, o)), e);
        v = this.intersect(c, h, 1e-4, 1e6);
        if (l.reflection >= .999999) return v;
    }
    var u = [ this.ambient[0], this.ambient[1], this.ambient[2] ];
    for (var f = 0; f < this.lights.length; f++) {
        var d = this.lights[f];
        var g = sub(d, c);
        var V = lengthVector(g);
        scaleVector(g, 1 / V);
        V -= 1e-4;
        if (this.blocked(c, g, V)) continue;
        var y = dot(o, g);
        if (y > 0) addVector(u, scale(d.colour, y));
    }
    u = scalev(u, l);
    if (v) {
        u = addVector(scaleVector(u, 1 - l.reflection), scaleVector(v, l.reflection));
    }
    return u;
};

Scene.prototype.blocked = function(r, e, t) {
    var a = 1e-4;
    var n = null;
    for (i = 0; i < this.triangles.length; i++) {
        var s = this.triangles[i];
        var o = s.intersect(r, e, a, t);
        if (o == null || o > t || o < a) continue;
        return true;
    }
    return false;
};

function Camera(r, e, t) {
    var a = normaliseVector(subVector(e, r));
    var n = normaliseVector(cross(t, a));
    var i = normaliseVector(cross(n, subVector([ 0, 0, 0 ], a)));
    var s = new Array(16);
    s[0] = n[0];
    s[1] = n[1];
    s[2] = n[2];
    s[4] = i[0];
    s[5] = i[1];
    s[6] = i[2];
    s[8] = a[0];
    s[9] = a[1];
    s[10] = a[2];
    invertMatrix(s);
    s[3] = 0;
    s[7] = 0;
    s[11] = 0;
    this.origin = r;
    this.directions = new Array(4);
    this.directions[0] = normalise([ -.7, .7, 1 ]);
    this.directions[1] = normalise([ .7, .7, 1 ]);
    this.directions[2] = normalise([ .7, -.7, 1 ]);
    this.directions[3] = normalise([ -.7, -.7, 1 ]);
    this.directions[0] = transformMatrix(s, this.directions[0]);
    this.directions[1] = transformMatrix(s, this.directions[1]);
    this.directions[2] = transformMatrix(s, this.directions[2]);
    this.directions[3] = transformMatrix(s, this.directions[3]);
}

Camera.prototype.generateRayPair = function(r) {
    rays = new Array(new Object(), new Object());
    rays[0].origin = this.origin;
    rays[1].origin = this.origin;
    rays[0].dir = addVector(scale(this.directions[0], r), scale(this.directions[3], 1 - r));
    rays[1].dir = addVector(scale(this.directions[1], r), scale(this.directions[2], 1 - r));
    return rays;
};

function renderRows(r, e, t, a, n, i, s) {
    for (var o = i; o < s; o++) {
        var c = r.generateRayPair(o / n);
        for (var l = 0; l < a; l++) {
            var v = l / a;
            var h = addVector(scale(c[0].origin, v), scale(c[1].origin, 1 - v));
            var u = normaliseVector(addVector(scale(c[0].dir, v), scale(c[1].dir, 1 - v)));
            var f = e.intersect(h, u);
            t[o][l] = f;
        }
    }
}

Camera.prototype.render = function(r, e, t, a) {
    var n = this;
    var i = 0;
    renderRows(n, r, e, t, a, 0, a);
};

function raytraceScene() {
    var r = new Date().getTime();
    var e = 2 * 6;
    var t = new Array();
    var a = createVector(-10, 10, -10);
    var n = createVector(10, 10, -10);
    var i = createVector(-10, 10, 10);
    var s = createVector(10, 10, 10);
    var o = createVector(-10, -10, -10);
    var c = createVector(10, -10, -10);
    var l = createVector(-10, -10, 10);
    var v = createVector(10, -10, 10);
    var h = 0;
    t[h++] = new Triangle(a, n, c);
    t[h++] = new Triangle(a, c, o);
    t[h++] = new Triangle(i, s, v);
    t[h++] = new Triangle(i, v, l);
    t[h++] = new Triangle(i, a, l);
    t[h++] = new Triangle(a, o, l);
    t[h++] = new Triangle(s, n, v);
    t[h++] = new Triangle(n, c, v);
    t[h++] = new Triangle(i, s, n);
    t[h++] = new Triangle(i, n, a);
    t[h++] = new Triangle(l, v, c);
    t[h++] = new Triangle(l, c, o);
    var u = createVector(0, .4, 0);
    var f = createVector(.4, .4, .4);
    f.reflection = 1;
    var d = function(r, e, t) {
        var a = (e[0] / 32 % 2 + 2) % 2;
        var n = ((e[2] / 32 + .3) % 2 + 2) % 2;
        if (a < 1 != n < 1) {
            return f;
        } else return u;
    };
    var g = createVector(-1e3, -30, -1e3);
    var V = createVector(1e3, -30, -1e3);
    var y = createVector(-1e3, -30, 1e3);
    var m = createVector(1e3, -30, 1e3);
    t[h++] = new Triangle(y, m, V);
    t[h - 1].shader = d;
    t[h++] = new Triangle(y, V, g);
    t[h - 1].shader = d;
    var w = new Scene(t);
    w.lights[0] = createVector(20, 38, -22);
    w.lights[0].colour = createVector(.7, .3, .3);
    w.lights[1] = createVector(-23, 40, 17);
    w.lights[1].colour = createVector(.7, .3, .3);
    w.lights[2] = createVector(23, 20, 17);
    w.lights[2].colour = createVector(.7, .7, .7);
    w.ambient = createVector(.1, .1, .1);
    var x = 30;
    var b = new Array();
    for (var p = 0; p < x; p++) {
        b[p] = new Array();
        for (var T = 0; T < x; T++) {
            b[p][T] = 0;
        }
    }
    var M = new Camera(createVector(-40, 40, 40), createVector(0, 0, 0), createVector(0, 1, 0));
    M.render(w, b, x, x);
    return b;
}

function arrayToCanvasCommands(r) {
    var e = '<canvas id="renderCanvas" width="30px" height="30px"></canvas><scr' + "ipt>\nvar pixels = [";
    var t = 30;
    for (var a = 0; a < t; a++) {
        e += "[";
        for (var n = 0; n < t; n++) {
            e += "[" + r[a][n] + "],";
        }
        e += "],";
    }
    e += '];\n    var canvas = document.getElementById("renderCanvas").getContext("2d");\n\n\n    var size = 30;\n    canvas.fillStyle = "red";\n    canvas.fillRect(0, 0, size, size);\n    canvas.scale(1, -1);\n    canvas.translate(0, -size);\n\n    if (!canvas.setFillColor)\n        canvas.setFillColor = function(r, g, b, a) {\n            this.fillStyle = "rgb("+[Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)]+")";\n    }\n\nfor (var y = 0; y < size; y++) {\n  for (var x = 0; x < size; x++) {\n    var l = pixels[y][x];\n    canvas.setFillColor(l[0], l[1], l[2], 1);\n    canvas.fillRect(x, y, 1, 1);\n  }\n}</scr' + "ipt>";
    return e;
}

testOutput = arrayToCanvasCommands(raytraceScene());

var expectedLength = 20970;

if (testOutput.length != expectedLength) throw "Error: bad result: expected length " + expectedLength + " but got " + testOutput.length;