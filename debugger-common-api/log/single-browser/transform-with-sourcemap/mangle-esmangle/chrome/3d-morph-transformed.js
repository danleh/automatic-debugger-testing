var loops = 15;
var nx = 120;
var nz = 120;
function morph(f, g) {
    var d = Math.PI * 8 / nx;
    var c = Math.sin;
    var e = -(50 * c(g * Math.PI * 2));
    for (var b = 0; b < nz; ++b) {
        for (var a = 0; a < nx; ++a) {
            f[3 * (b * nx + a) + 1] = c((a - 1) * d) * -e;
        }
    }
}
var a = Array();
for (var i = 0; i < nx * nz * 3; ++i)
    a[i] = 0;
for (var i = 0; i < loops; ++i) {
    morph(a, i / loops);
}
testOutput = 0;
for (var i = 0; i < nx; i++)
    testOutput += a[3 * (i * nx + i) + 1];
a = null;
var epsilon = 1e-13;
if (Math.abs(testOutput) >= epsilon)
    throw 'Error: bad test output: expected magnitude below ' + epsilon + ' but got ' + testOutput;