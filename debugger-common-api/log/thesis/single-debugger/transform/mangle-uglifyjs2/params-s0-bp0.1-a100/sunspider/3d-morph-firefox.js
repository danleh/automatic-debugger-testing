var loops = 15;

var nx = 120;

var nz = 120;

function morph(t, a) {
    var r = Math.PI * 8 / nx;
    var o = Math.sin;
    var i = -(50 * o(a * Math.PI * 2));
    for (var n = 0; n < nz; ++n) {
        for (var e = 0; e < nx; ++e) {
            t[3 * (n * nx + e) + 1] = o((e - 1) * r) * -i;
        }
    }
}

var a = Array();

for (var i = 0; i < nx * nz * 3; ++i) a[i] = 0;

for (var i = 0; i < loops; ++i) {
    morph(a, i / loops);
}

testOutput = 0;

for (var i = 0; i < nx; i++) testOutput += a[3 * (i * nx + i) + 1];

a = null;

var epsilon = 1e-13;

if (Math.abs(testOutput) >= epsilon) throw "Error: bad test output: expected magnitude below " + epsilon + " but got " + testOutput;