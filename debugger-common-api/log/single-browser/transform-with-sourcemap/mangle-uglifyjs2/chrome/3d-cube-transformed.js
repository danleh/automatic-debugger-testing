var Q = new Array();

var MTrans = new Array();

var MQube = new Array();

var I = new Array();

var Origin = new Object();

var Testing = new Object();

var LoopTimer;

var validation = {
    20: 2889.0000000000045,
    40: 2889.0000000000055,
    80: 2889.000000000005,
    160: 2889.0000000000055
};

var DisplArea = new Object();

DisplArea.Width = 300;

DisplArea.Height = 300;

function DrawLine(e, r) {
    var a = e.V[0];
    var n = r.V[0];
    var i = e.V[1];
    var t = r.V[1];
    var f = Math.abs(n - a);
    var u = Math.abs(t - i);
    var L = a;
    var s = i;
    var o, l;
    var v, M;
    var w;
    var T;
    var g;
    var D;
    if (n >= a) {
        o = 1;
        v = 1;
    } else {
        o = -1;
        v = -1;
    }
    if (t >= i) {
        l = 1;
        M = 1;
    } else {
        l = -1;
        M = -1;
    }
    if (f >= u) {
        o = 0;
        M = 0;
        w = f;
        T = f / 2;
        g = u;
        D = f;
    } else {
        v = 0;
        l = 0;
        w = u;
        T = u / 2;
        g = f;
        D = u;
    }
    D = Math.round(Q.LastPx + D);
    var V = Q.LastPx;
    for (;V < D; V++) {
        T += g;
        if (T >= w) {
            T -= w;
            L += o;
            s += l;
        }
        L += v;
        s += M;
    }
    Q.LastPx = D;
}

function CalcCross(e, r) {
    var a = new Array();
    a[0] = e[1] * r[2] - e[2] * r[1];
    a[1] = e[2] * r[0] - e[0] * r[2];
    a[2] = e[0] * r[1] - e[1] * r[0];
    return a;
}

function CalcNormal(e, r, a) {
    var n = new Array();
    var i = new Array();
    for (var t = 0; t < 3; t++) {
        n[t] = e[t] - r[t];
        i[t] = a[t] - r[t];
    }
    n = CalcCross(n, i);
    var Q = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    for (var t = 0; t < 3; t++) n[t] = n[t] / Q;
    n[3] = 1;
    return n;
}

function CreateP(e, r, a) {
    this.V = [ e, r, a, 1 ];
}

function MMulti(e, r) {
    var a = [ [], [], [], [] ];
    var n = 0;
    var i = 0;
    for (;n < 4; n++) {
        i = 0;
        for (;i < 4; i++) a[n][i] = e[n][0] * r[0][i] + e[n][1] * r[1][i] + e[n][2] * r[2][i] + e[n][3] * r[3][i];
    }
    return a;
}

function VMulti(e, r) {
    var a = new Array();
    var n = 0;
    for (;n < 4; n++) a[n] = e[n][0] * r[0] + e[n][1] * r[1] + e[n][2] * r[2] + e[n][3] * r[3];
    return a;
}

function VMulti2(e, r) {
    var a = new Array();
    var n = 0;
    for (;n < 3; n++) a[n] = e[n][0] * r[0] + e[n][1] * r[1] + e[n][2] * r[2];
    return a;
}

function MAdd(e, r) {
    var a = [ [], [], [], [] ];
    var n = 0;
    var i = 0;
    for (;n < 4; n++) {
        i = 0;
        for (;i < 4; i++) a[n][i] = e[n][i] + r[n][i];
    }
    return a;
}

function Translate(e, r, a, n) {
    var i = [ [ 1, 0, 0, r ], [ 0, 1, 0, a ], [ 0, 0, 1, n ], [ 0, 0, 0, 1 ] ];
    return MMulti(i, e);
}

function RotateX(e, r) {
    var a = r;
    a *= Math.PI / 180;
    var n = Math.cos(a);
    var i = Math.sin(a);
    var t = [ [ 1, 0, 0, 0 ], [ 0, n, -i, 0 ], [ 0, i, n, 0 ], [ 0, 0, 0, 1 ] ];
    return MMulti(t, e);
}

function RotateY(e, r) {
    var a = r;
    a *= Math.PI / 180;
    var n = Math.cos(a);
    var i = Math.sin(a);
    var t = [ [ n, 0, i, 0 ], [ 0, 1, 0, 0 ], [ -i, 0, n, 0 ], [ 0, 0, 0, 1 ] ];
    return MMulti(t, e);
}

function RotateZ(e, r) {
    var a = r;
    a *= Math.PI / 180;
    var n = Math.cos(a);
    var i = Math.sin(a);
    var t = [ [ n, -i, 0, 0 ], [ i, n, 0, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 0, 1 ] ];
    return MMulti(t, e);
}

function DrawQube() {
    var e = new Array();
    var r = 5;
    Q.LastPx = 0;
    for (;r > -1; r--) e[r] = VMulti2(MQube, Q.Normal[r]);
    if (e[0][2] < 0) {
        if (!Q.Line[0]) {
            DrawLine(Q[0], Q[1]);
            Q.Line[0] = true;
        }
        if (!Q.Line[1]) {
            DrawLine(Q[1], Q[2]);
            Q.Line[1] = true;
        }
        if (!Q.Line[2]) {
            DrawLine(Q[2], Q[3]);
            Q.Line[2] = true;
        }
        if (!Q.Line[3]) {
            DrawLine(Q[3], Q[0]);
            Q.Line[3] = true;
        }
    }
    if (e[1][2] < 0) {
        if (!Q.Line[2]) {
            DrawLine(Q[3], Q[2]);
            Q.Line[2] = true;
        }
        if (!Q.Line[9]) {
            DrawLine(Q[2], Q[6]);
            Q.Line[9] = true;
        }
        if (!Q.Line[6]) {
            DrawLine(Q[6], Q[7]);
            Q.Line[6] = true;
        }
        if (!Q.Line[10]) {
            DrawLine(Q[7], Q[3]);
            Q.Line[10] = true;
        }
    }
    if (e[2][2] < 0) {
        if (!Q.Line[4]) {
            DrawLine(Q[4], Q[5]);
            Q.Line[4] = true;
        }
        if (!Q.Line[5]) {
            DrawLine(Q[5], Q[6]);
            Q.Line[5] = true;
        }
        if (!Q.Line[6]) {
            DrawLine(Q[6], Q[7]);
            Q.Line[6] = true;
        }
        if (!Q.Line[7]) {
            DrawLine(Q[7], Q[4]);
            Q.Line[7] = true;
        }
    }
    if (e[3][2] < 0) {
        if (!Q.Line[4]) {
            DrawLine(Q[4], Q[5]);
            Q.Line[4] = true;
        }
        if (!Q.Line[8]) {
            DrawLine(Q[5], Q[1]);
            Q.Line[8] = true;
        }
        if (!Q.Line[0]) {
            DrawLine(Q[1], Q[0]);
            Q.Line[0] = true;
        }
        if (!Q.Line[11]) {
            DrawLine(Q[0], Q[4]);
            Q.Line[11] = true;
        }
    }
    if (e[4][2] < 0) {
        if (!Q.Line[11]) {
            DrawLine(Q[4], Q[0]);
            Q.Line[11] = true;
        }
        if (!Q.Line[3]) {
            DrawLine(Q[0], Q[3]);
            Q.Line[3] = true;
        }
        if (!Q.Line[10]) {
            DrawLine(Q[3], Q[7]);
            Q.Line[10] = true;
        }
        if (!Q.Line[7]) {
            DrawLine(Q[7], Q[4]);
            Q.Line[7] = true;
        }
    }
    if (e[5][2] < 0) {
        if (!Q.Line[8]) {
            DrawLine(Q[1], Q[5]);
            Q.Line[8] = true;
        }
        if (!Q.Line[5]) {
            DrawLine(Q[5], Q[6]);
            Q.Line[5] = true;
        }
        if (!Q.Line[9]) {
            DrawLine(Q[6], Q[2]);
            Q.Line[9] = true;
        }
        if (!Q.Line[1]) {
            DrawLine(Q[2], Q[1]);
            Q.Line[1] = true;
        }
    }
    Q.Line = [ false, false, false, false, false, false, false, false, false, false, false, false ];
    Q.LastPx = 0;
}

function Loop() {
    if (Testing.LoopCount > Testing.LoopMax) return;
    var e = String(Testing.LoopCount);
    while (e.length < 3) e = "0" + e;
    MTrans = Translate(I, -Q[8].V[0], -Q[8].V[1], -Q[8].V[2]);
    MTrans = RotateX(MTrans, 1);
    MTrans = RotateY(MTrans, 3);
    MTrans = RotateZ(MTrans, 5);
    MTrans = Translate(MTrans, Q[8].V[0], Q[8].V[1], Q[8].V[2]);
    MQube = MMulti(MTrans, MQube);
    var r = 8;
    for (;r > -1; r--) {
        Q[r].V = VMulti(MTrans, Q[r].V);
    }
    DrawQube();
    Testing.LoopCount++;
    Loop();
}

function Init(e) {
    Origin.V = [ 150, 150, 20, 1 ];
    Testing.LoopCount = 0;
    Testing.LoopMax = 50;
    Testing.TimeMax = 0;
    Testing.TimeAvg = 0;
    Testing.TimeMin = 0;
    Testing.TimeTemp = 0;
    Testing.TimeTotal = 0;
    Testing.Init = false;
    MTrans = [ [ 1, 0, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 0, 1 ] ];
    MQube = [ [ 1, 0, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 0, 1 ] ];
    I = [ [ 1, 0, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 0, 1 ] ];
    Q[0] = new CreateP(-e, -e, e);
    Q[1] = new CreateP(-e, e, e);
    Q[2] = new CreateP(e, e, e);
    Q[3] = new CreateP(e, -e, e);
    Q[4] = new CreateP(-e, -e, -e);
    Q[5] = new CreateP(-e, e, -e);
    Q[6] = new CreateP(e, e, -e);
    Q[7] = new CreateP(e, -e, -e);
    Q[8] = new CreateP(0, 0, 0);
    Q.Edge = [ [ 0, 1, 2 ], [ 3, 2, 6 ], [ 7, 6, 5 ], [ 4, 5, 1 ], [ 4, 0, 3 ], [ 1, 5, 6 ] ];
    Q.Normal = new Array();
    for (var r = 0; r < Q.Edge.length; r++) Q.Normal[r] = CalcNormal(Q[Q.Edge[r][0]].V, Q[Q.Edge[r][1]].V, Q[Q.Edge[r][2]].V);
    Q.Line = [ false, false, false, false, false, false, false, false, false, false, false, false ];
    Q.NumPx = 9 * 2 * e;
    for (var r = 0; r < Q.NumPx; r++) CreateP(0, 0, 0);
    MTrans = Translate(MTrans, Origin.V[0], Origin.V[1], Origin.V[2]);
    MQube = MMulti(MTrans, MQube);
    var r = 0;
    for (;r < 9; r++) {
        Q[r].V = VMulti(MTrans, Q[r].V);
    }
    DrawQube();
    Testing.Init = true;
    Loop();
    var a = 0;
    for (var r = 0; r < Q.length; ++r) {
        var n = Q[r].V;
        for (var i = 0; i < n.length; ++i) a += n[i];
    }
    if (a != validation[e]) throw "Error: bad vector sum for CubeSize = " + e + "; expected " + validation[e] + " but got " + a;
}

for (var i = 20; i <= 160; i *= 2) {
    Init(i);
}

Q = null;

MTrans = null;

MQube = null;

I = null;

Origin = null;

Testing = null;

LoopTime = null;

DisplArea = null;