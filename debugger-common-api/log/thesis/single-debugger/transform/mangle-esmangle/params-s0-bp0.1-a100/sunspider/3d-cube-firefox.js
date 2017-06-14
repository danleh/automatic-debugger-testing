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
function DrawLine(r, s) {
    var f = r.V[0];
    var m = s.V[0];
    var g = r.V[1];
    var q = s.V[1];
    var a = Math.abs(m - f);
    var b = Math.abs(q - g);
    var o = f;
    var l = g;
    var e, h;
    var i, j;
    var k;
    var d;
    var p;
    var c;
    if (m >= f) {
        e = 1;
        i = 1;
    } else {
        e = -1;
        i = -1;
    }
    if (q >= g) {
        h = 1;
        j = 1;
    } else {
        h = -1;
        j = -1;
    }
    if (a >= b) {
        e = 0;
        j = 0;
        k = a;
        d = a / 2;
        p = b;
        c = a;
    } else {
        i = 0;
        h = 0;
        k = b;
        d = b / 2;
        p = a;
        c = b;
    }
    c = Math.round(Q.LastPx + c);
    var n = Q.LastPx;
    for (; n < c; n++) {
        d += p;
        if (d >= k) {
            d -= k;
            o += e;
            l += h;
        }
        o += i;
        l += j;
    }
    Q.LastPx = c;
}
function CalcCross(a, b) {
    var c = new Array();
    c[0] = a[1] * b[2] - a[2] * b[1];
    c[1] = a[2] * b[0] - a[0] * b[2];
    c[2] = a[0] * b[1] - a[1] * b[0];
    return c;
}
function CalcNormal(f, d, g) {
    var b = new Array();
    var c = new Array();
    for (var a = 0; a < 3; a++) {
        b[a] = f[a] - d[a];
        c[a] = g[a] - d[a];
    }
    b = CalcCross(b, c);
    var e = Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);
    for (var a = 0; a < 3; a++)
        b[a] = b[a] / e;
    b[3] = 1;
    return b;
}
function CreateP(a, b, c) {
    this.V = [
        a,
        b,
        c,
        1
    ];
}
function MMulti(c, d) {
    var e = [
        [],
        [],
        [],
        []
    ];
    var b = 0;
    var a = 0;
    for (; b < 4; b++) {
        a = 0;
        for (; a < 4; a++)
            e[b][a] = c[b][0] * d[0][a] + c[b][1] * d[1][a] + c[b][2] * d[2][a] + c[b][3] * d[3][a];
    }
    return e;
}
function VMulti(b, c) {
    var d = new Array();
    var a = 0;
    for (; a < 4; a++)
        d[a] = b[a][0] * c[0] + b[a][1] * c[1] + b[a][2] * c[2] + b[a][3] * c[3];
    return d;
}
function VMulti2(b, c) {
    var d = new Array();
    var a = 0;
    for (; a < 3; a++)
        d[a] = b[a][0] * c[0] + b[a][1] * c[1] + b[a][2] * c[2];
    return d;
}
function MAdd(d, e) {
    var c = [
        [],
        [],
        [],
        []
    ];
    var b = 0;
    var a = 0;
    for (; b < 4; b++) {
        a = 0;
        for (; a < 4; a++)
            c[b][a] = d[b][a] + e[b][a];
    }
    return c;
}
function Translate(b, c, d, e) {
    var a = [
        [
            1,
            0,
            0,
            c
        ],
        [
            0,
            1,
            0,
            d
        ],
        [
            0,
            0,
            1,
            e
        ],
        [
            0,
            0,
            0,
            1
        ]
    ];
    return MMulti(a, b);
}
function RotateX(e, f) {
    var a = f;
    a *= Math.PI / 180;
    var b = Math.cos(a);
    var c = Math.sin(a);
    var d = [
        [
            1,
            0,
            0,
            0
        ],
        [
            0,
            b,
            -c,
            0
        ],
        [
            0,
            c,
            b,
            0
        ],
        [
            0,
            0,
            0,
            1
        ]
    ];
    return MMulti(d, e);
}
function RotateY(e, f) {
    var a = f;
    a *= Math.PI / 180;
    var b = Math.cos(a);
    var c = Math.sin(a);
    var d = [
        [
            b,
            0,
            c,
            0
        ],
        [
            0,
            1,
            0,
            0
        ],
        [
            -c,
            0,
            b,
            0
        ],
        [
            0,
            0,
            0,
            1
        ]
    ];
    return MMulti(d, e);
}
function RotateZ(e, f) {
    var a = f;
    a *= Math.PI / 180;
    var b = Math.cos(a);
    var c = Math.sin(a);
    var d = [
        [
            b,
            -c,
            0,
            0
        ],
        [
            c,
            b,
            0,
            0
        ],
        [
            0,
            0,
            1,
            0
        ],
        [
            0,
            0,
            0,
            1
        ]
    ];
    return MMulti(d, e);
}
function DrawQube() {
    var a = new Array();
    var b = 5;
    Q.LastPx = 0;
    for (; b > -1; b--)
        a[b] = VMulti2(MQube, Q.Normal[b]);
    if (a[0][2] < 0) {
        if (!Q.Line[0]) {
            DrawLine(Q[0], Q[1]);
            Q.Line[0] = true;
        }
        ;
        if (!Q.Line[1]) {
            DrawLine(Q[1], Q[2]);
            Q.Line[1] = true;
        }
        ;
        if (!Q.Line[2]) {
            DrawLine(Q[2], Q[3]);
            Q.Line[2] = true;
        }
        ;
        if (!Q.Line[3]) {
            DrawLine(Q[3], Q[0]);
            Q.Line[3] = true;
        }
        ;
    }
    if (a[1][2] < 0) {
        if (!Q.Line[2]) {
            DrawLine(Q[3], Q[2]);
            Q.Line[2] = true;
        }
        ;
        if (!Q.Line[9]) {
            DrawLine(Q[2], Q[6]);
            Q.Line[9] = true;
        }
        ;
        if (!Q.Line[6]) {
            DrawLine(Q[6], Q[7]);
            Q.Line[6] = true;
        }
        ;
        if (!Q.Line[10]) {
            DrawLine(Q[7], Q[3]);
            Q.Line[10] = true;
        }
        ;
    }
    if (a[2][2] < 0) {
        if (!Q.Line[4]) {
            DrawLine(Q[4], Q[5]);
            Q.Line[4] = true;
        }
        ;
        if (!Q.Line[5]) {
            DrawLine(Q[5], Q[6]);
            Q.Line[5] = true;
        }
        ;
        if (!Q.Line[6]) {
            DrawLine(Q[6], Q[7]);
            Q.Line[6] = true;
        }
        ;
        if (!Q.Line[7]) {
            DrawLine(Q[7], Q[4]);
            Q.Line[7] = true;
        }
        ;
    }
    if (a[3][2] < 0) {
        if (!Q.Line[4]) {
            DrawLine(Q[4], Q[5]);
            Q.Line[4] = true;
        }
        ;
        if (!Q.Line[8]) {
            DrawLine(Q[5], Q[1]);
            Q.Line[8] = true;
        }
        ;
        if (!Q.Line[0]) {
            DrawLine(Q[1], Q[0]);
            Q.Line[0] = true;
        }
        ;
        if (!Q.Line[11]) {
            DrawLine(Q[0], Q[4]);
            Q.Line[11] = true;
        }
        ;
    }
    if (a[4][2] < 0) {
        if (!Q.Line[11]) {
            DrawLine(Q[4], Q[0]);
            Q.Line[11] = true;
        }
        ;
        if (!Q.Line[3]) {
            DrawLine(Q[0], Q[3]);
            Q.Line[3] = true;
        }
        ;
        if (!Q.Line[10]) {
            DrawLine(Q[3], Q[7]);
            Q.Line[10] = true;
        }
        ;
        if (!Q.Line[7]) {
            DrawLine(Q[7], Q[4]);
            Q.Line[7] = true;
        }
        ;
    }
    if (a[5][2] < 0) {
        if (!Q.Line[8]) {
            DrawLine(Q[1], Q[5]);
            Q.Line[8] = true;
        }
        ;
        if (!Q.Line[5]) {
            DrawLine(Q[5], Q[6]);
            Q.Line[5] = true;
        }
        ;
        if (!Q.Line[9]) {
            DrawLine(Q[6], Q[2]);
            Q.Line[9] = true;
        }
        ;
        if (!Q.Line[1]) {
            DrawLine(Q[2], Q[1]);
            Q.Line[1] = true;
        }
        ;
    }
    Q.Line = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ];
    Q.LastPx = 0;
}
function Loop() {
    if (Testing.LoopCount > Testing.LoopMax)
        return;
    var b = String(Testing.LoopCount);
    while (b.length < 3)
        b = '0' + b;
    MTrans = Translate(I, -Q[8].V[0], -Q[8].V[1], -Q[8].V[2]);
    MTrans = RotateX(MTrans, 1);
    MTrans = RotateY(MTrans, 3);
    MTrans = RotateZ(MTrans, 5);
    MTrans = Translate(MTrans, Q[8].V[0], Q[8].V[1], Q[8].V[2]);
    MQube = MMulti(MTrans, MQube);
    var a = 8;
    for (; a > -1; a--) {
        Q[a].V = VMulti(MTrans, Q[a].V);
    }
    DrawQube();
    Testing.LoopCount++;
    Loop();
}
function Init(a) {
    Origin.V = [
        150,
        150,
        20,
        1
    ];
    Testing.LoopCount = 0;
    Testing.LoopMax = 50;
    Testing.TimeMax = 0;
    Testing.TimeAvg = 0;
    Testing.TimeMin = 0;
    Testing.TimeTemp = 0;
    Testing.TimeTotal = 0;
    Testing.Init = false;
    MTrans = [
        [
            1,
            0,
            0,
            0
        ],
        [
            0,
            1,
            0,
            0
        ],
        [
            0,
            0,
            1,
            0
        ],
        [
            0,
            0,
            0,
            1
        ]
    ];
    MQube = [
        [
            1,
            0,
            0,
            0
        ],
        [
            0,
            1,
            0,
            0
        ],
        [
            0,
            0,
            1,
            0
        ],
        [
            0,
            0,
            0,
            1
        ]
    ];
    I = [
        [
            1,
            0,
            0,
            0
        ],
        [
            0,
            1,
            0,
            0
        ],
        [
            0,
            0,
            1,
            0
        ],
        [
            0,
            0,
            0,
            1
        ]
    ];
    Q[0] = new CreateP(-a, -a, a);
    Q[1] = new CreateP(-a, a, a);
    Q[2] = new CreateP(a, a, a);
    Q[3] = new CreateP(a, -a, a);
    Q[4] = new CreateP(-a, -a, -a);
    Q[5] = new CreateP(-a, a, -a);
    Q[6] = new CreateP(a, a, -a);
    Q[7] = new CreateP(a, -a, -a);
    Q[8] = new CreateP(0, 0, 0);
    Q.Edge = [
        [
            0,
            1,
            2
        ],
        [
            3,
            2,
            6
        ],
        [
            7,
            6,
            5
        ],
        [
            4,
            5,
            1
        ],
        [
            4,
            0,
            3
        ],
        [
            1,
            5,
            6
        ]
    ];
    Q.Normal = new Array();
    for (var b = 0; b < Q.Edge.length; b++)
        Q.Normal[b] = CalcNormal(Q[Q.Edge[b][0]].V, Q[Q.Edge[b][1]].V, Q[Q.Edge[b][2]].V);
    Q.Line = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ];
    Q.NumPx = 9 * 2 * a;
    for (var b = 0; b < Q.NumPx; b++)
        CreateP(0, 0, 0);
    MTrans = Translate(MTrans, Origin.V[0], Origin.V[1], Origin.V[2]);
    MQube = MMulti(MTrans, MQube);
    var b = 0;
    for (; b < 9; b++) {
        Q[b].V = VMulti(MTrans, Q[b].V);
    }
    DrawQube();
    Testing.Init = true;
    Loop();
    var c = 0;
    for (var b = 0; b < Q.length; ++b) {
        var e = Q[b].V;
        for (var d = 0; d < e.length; ++d)
            c += e[d];
    }
    if (c != validation[a])
        throw 'Error: bad vector sum for CubeSize = ' + a + '; expected ' + validation[a] + ' but got ' + c;
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