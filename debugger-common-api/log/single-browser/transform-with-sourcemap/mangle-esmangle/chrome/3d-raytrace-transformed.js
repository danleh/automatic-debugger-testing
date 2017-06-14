function createVector(a, b, c) {
    return new Array(a, b, c);
}
function sqrLengthVector(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
}
function lengthVector(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
function addVector(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
    return a;
}
function subVector(a, b) {
    a[0] -= b[0];
    a[1] -= b[1];
    a[2] -= b[2];
    return a;
}
function scaleVector(a, b) {
    a[0] *= b;
    a[1] *= b;
    a[2] *= b;
    return a;
}
function normaliseVector(a) {
    var b = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    a[0] /= b;
    a[1] /= b;
    a[2] /= b;
    return a;
}
function add(a, b) {
    return new Array(a[0] + b[0], a[1] + b[1], a[2] + b[2]);
}
function sub(a, b) {
    return new Array(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}
function scalev(a, b) {
    return new Array(a[0] * b[0], a[1] * b[1], a[2] * b[2]);
}
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function scale(a, b) {
    return [
        a[0] * b,
        a[1] * b,
        a[2] * b
    ];
}
function cross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}
function normalise(a) {
    var b = lengthVector(a);
    return [
        a[0] / b,
        a[1] / b,
        a[2] / b
    ];
}
function transformMatrix(f, b) {
    var a = f;
    var c = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3];
    var d = a[4] * b[0] + a[5] * b[1] + a[6] * b[2] + a[7];
    var e = a[8] * b[0] + a[9] * b[1] + a[10] * b[2] + a[11];
    return [
        c,
        d,
        e
    ];
}
function invertMatrix(a) {
    var e = new Array(16);
    var b = -a[3];
    var c = -a[7];
    var d = -a[11];
    for (h = 0; h < 3; h++)
        for (v = 0; v < 3; v++)
            e[h + v * 4] = a[v + h * 4];
    for (i = 0; i < 11; i++)
        a[i] = e[i];
    a[3] = b * a[0] + c * a[1] + d * a[2];
    a[7] = b * a[4] + c * a[5] + d * a[6];
    a[11] = b * a[8] + c * a[9] + d * a[10];
    return a;
}
function Triangle(d, m, l) {
    var g = sub(l, d);
    var f = sub(m, d);
    var a = cross(g, f);
    if (Math.abs(a[0]) > Math.abs(a[1]))
        if (Math.abs(a[0]) > Math.abs(a[2]))
            this.axis = 0;
        else
            this.axis = 2;
    else if (Math.abs(a[1]) > Math.abs(a[2]))
        this.axis = 1;
    else
        this.axis = 2;
    var b = (this.axis + 1) % 3;
    var c = (this.axis + 2) % 3;
    var h = g[b];
    var i = g[c];
    var j = f[b];
    var k = f[c];
    this.normal = normalise(a);
    this.nu = a[b] / a[this.axis];
    this.nv = a[c] / a[this.axis];
    this.nd = dot(a, d) / a[this.axis];
    var e = h * k - i * j;
    this.eu = d[b];
    this.ev = d[c];
    this.nu1 = h / e;
    this.nv1 = -i / e;
    this.nu2 = k / e;
    this.nv2 = -j / e;
    this.material = [
        0.7,
        0.7,
        0.7
    ];
}
Triangle.prototype.intersect = function (e, c, l, k) {
    var d = (this.axis + 1) % 3;
    var b = (this.axis + 2) % 3;
    var j = c[this.axis] + this.nu * c[d] + this.nv * c[b];
    var a = (this.nd - e[this.axis] - this.nu * e[d] - this.nv * e[b]) / j;
    if (a < l || a > k)
        return null;
    var h = e[d] + a * c[d] - this.eu;
    var i = e[b] + a * c[b] - this.ev;
    var g = i * this.nu1 + h * this.nv1;
    if (g < 0)
        return null;
    var f = h * this.nu2 + i * this.nv2;
    if (f < 0)
        return null;
    if (g + f > 1)
        return null;
    return a;
};
function Scene(a) {
    this.triangles = a;
    this.lights = [];
    this.ambient = [
        0,
        0,
        0
    ];
    this.background = [
        0.8,
        0.8,
        1
    ];
}
var zero = new Array(0, 0, 0);
Scene.prototype.intersect = function (q, f, r, k) {
    var d = null;
    for (b = 0; b < this.triangles.length; b++) {
        var n = this.triangles[b];
        var g = n.intersect(q, f, r, k);
        if (g == null || g > k || g < r)
            continue;
        k = g;
        d = n;
    }
    if (!d)
        return [
            this.background[0],
            this.background[1],
            this.background[2]
        ];
    var a = d.normal;
    var j = add(q, scale(f, k));
    if (dot(f, a) > 0)
        a = [
            -a[0],
            -a[1],
            -a[2]
        ];
    var c = null;
    if (d.shader) {
        c = d.shader(d, j, f);
    } else {
        c = d.material;
    }
    var i = null;
    if (c.reflection > 0.001) {
        var p = addVector(scale(a, -2 * dot(f, a)), f);
        i = this.intersect(j, p, 0.0001, 1000000);
        if (c.reflection >= 0.999999)
            return i;
    }
    var e = [
        this.ambient[0],
        this.ambient[1],
        this.ambient[2]
    ];
    for (var b = 0; b < this.lights.length; b++) {
        var m = this.lights[b];
        var h = sub(m, j);
        var l = lengthVector(h);
        scaleVector(h, 1 / l);
        l -= 0.0001;
        if (this.blocked(j, h, l))
            continue;
        var o = dot(a, h);
        if (o > 0)
            addVector(e, scale(m.colour, o));
    }
    e = scalev(e, c);
    if (i) {
        e = addVector(scaleVector(e, 1 - c.reflection), scaleVector(i, c.reflection));
    }
    return e;
};
Scene.prototype.blocked = function (e, f, c) {
    var b = 0.0001;
    var g = null;
    for (i = 0; i < this.triangles.length; i++) {
        var d = this.triangles[i];
        var a = d.intersect(e, f, b, c);
        if (a == null || a > c || a < b)
            continue;
        return true;
    }
    return false;
};
function Camera(e, f, g) {
    var b = normaliseVector(subVector(f, e));
    var c = normaliseVector(cross(g, b));
    var d = normaliseVector(cross(c, subVector([
        0,
        0,
        0
    ], b)));
    var a = new Array(16);
    a[0] = c[0];
    a[1] = c[1];
    a[2] = c[2];
    a[4] = d[0];
    a[5] = d[1];
    a[6] = d[2];
    a[8] = b[0];
    a[9] = b[1];
    a[10] = b[2];
    invertMatrix(a);
    a[3] = 0;
    a[7] = 0;
    a[11] = 0;
    this.origin = e;
    this.directions = new Array(4);
    this.directions[0] = normalise([
        -0.7,
        0.7,
        1
    ]);
    this.directions[1] = normalise([
        0.7,
        0.7,
        1
    ]);
    this.directions[2] = normalise([
        0.7,
        -0.7,
        1
    ]);
    this.directions[3] = normalise([
        -0.7,
        -0.7,
        1
    ]);
    this.directions[0] = transformMatrix(a, this.directions[0]);
    this.directions[1] = transformMatrix(a, this.directions[1]);
    this.directions[2] = transformMatrix(a, this.directions[2]);
    this.directions[3] = transformMatrix(a, this.directions[3]);
}
Camera.prototype.generateRayPair = function (a) {
    rays = new Array(new Object(), new Object());
    rays[0].origin = this.origin;
    rays[1].origin = this.origin;
    rays[0].dir = addVector(scale(this.directions[0], a), scale(this.directions[3], 1 - a));
    rays[1].dir = addVector(scale(this.directions[1], a), scale(this.directions[2], 1 - a));
    return rays;
};
function renderRows(n, i, j, f, l, m, k) {
    for (var a = m; a < k; a++) {
        var b = n.generateRayPair(a / l);
        for (var c = 0; c < f; c++) {
            var d = c / f;
            var g = addVector(scale(b[0].origin, d), scale(b[1].origin, 1 - d));
            var h = normaliseVector(addVector(scale(b[0].dir, d), scale(b[1].dir, 1 - d)));
            var e = i.intersect(g, h);
            j[a][c] = e;
        }
    }
}
Camera.prototype.render = function (c, d, e, a) {
    var b = this;
    var f = 0;
    renderRows(b, c, d, e, a, 0, a);
};
function raytraceScene() {
    var x = new Date().getTime();
    var y = 2 * 6;
    var a = new Array();
    var e = createVector(-10, 10, -10);
    var f = createVector(10, 10, -10);
    var g = createVector(-10, 10, 10);
    var o = createVector(10, 10, 10);
    var n = createVector(-10, -10, -10);
    var h = createVector(10, -10, -10);
    var i = createVector(-10, -10, 10);
    var d = createVector(10, -10, 10);
    var b = 0;
    a[b++] = new Triangle(e, f, h);
    a[b++] = new Triangle(e, h, n);
    a[b++] = new Triangle(g, o, d);
    a[b++] = new Triangle(g, d, i);
    a[b++] = new Triangle(g, e, i);
    a[b++] = new Triangle(e, n, i);
    a[b++] = new Triangle(o, f, d);
    a[b++] = new Triangle(f, h, d);
    a[b++] = new Triangle(g, o, f);
    a[b++] = new Triangle(g, f, e);
    a[b++] = new Triangle(i, d, h);
    a[b++] = new Triangle(i, h, n);
    var t = createVector(0, 0.4, 0);
    var p = createVector(0.4, 0.4, 0.4);
    p.reflection = 1;
    var q = function (d, a, e) {
        var b = (a[0] / 32 % 2 + 2) % 2;
        var c = ((a[2] / 32 + 0.3) % 2 + 2) % 2;
        if (b < 1 != c < 1) {
            return p;
        } else
            return t;
    };
    var v = createVector(-1000, -30, -1000);
    var r = createVector(1000, -30, -1000);
    var s = createVector(-1000, -30, 1000);
    var w = createVector(1000, -30, 1000);
    a[b++] = new Triangle(s, w, r);
    a[b - 1].shader = q;
    a[b++] = new Triangle(s, r, v);
    a[b - 1].shader = q;
    var c = new Scene(a);
    c.lights[0] = createVector(20, 38, -22);
    c.lights[0].colour = createVector(0.7, 0.3, 0.3);
    c.lights[1] = createVector(-23, 40, 17);
    c.lights[1].colour = createVector(0.7, 0.3, 0.3);
    c.lights[2] = createVector(23, 20, 17);
    c.lights[2].colour = createVector(0.7, 0.7, 0.7);
    c.ambient = createVector(0.1, 0.1, 0.1);
    var l = 30;
    var j = new Array();
    for (var k = 0; k < l; k++) {
        j[k] = new Array();
        for (var m = 0; m < l; m++) {
            j[k][m] = 0;
        }
    }
    var u = new Camera(createVector(-40, 40, 40), createVector(0, 0, 0), createVector(0, 1, 0));
    u.render(c, j, l, l);
    return j;
}
function arrayToCanvasCommands(e) {
    var a = '<canvas id="renderCanvas" width="30px" height="30px"></canvas><scr' + 'ipt>\nvar pixels = [';
    var d = 30;
    for (var b = 0; b < d; b++) {
        a += '[';
        for (var c = 0; c < d; c++) {
            a += '[' + e[b][c] + '],';
        }
        a += '],';
    }
    a += '];\n    var canvas = document.getElementById("renderCanvas").getContext("2d");\n\n\n    var size = 30;\n    canvas.fillStyle = "red";\n    canvas.fillRect(0, 0, size, size);\n    canvas.scale(1, -1);\n    canvas.translate(0, -size);\n\n    if (!canvas.setFillColor)\n        canvas.setFillColor = function(r, g, b, a) {\n            this.fillStyle = "rgb("+[Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)]+")";\n    }\n\nfor (var y' + ' = 0; y < size; y++) {\n  for (var x' + ' = 0; x < size; x++) {\n    var l = pixels[y][x];\n    canvas.setFillColor(l[0], l[1], l[2], 1);\n    canvas.fillRect(x, y, 1, 1);\n  }\n}</scr' + 'ipt>';
    return a;
}
testOutput = arrayToCanvasCommands(raytraceScene());
var expectedLength = 20970;
if (testOutput.length != expectedLength)
    throw 'Error: bad result: expected length ' + expectedLength + ' but got ' + testOutput.length;