letters = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
numbers = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26);
colors = new Array('FF', 'CC', '99', '66', '33', '00');
var endResult;
function doTest() {
    endResult = '';
    for (var d = 0; d < 4000; d++) {
        username = makeName(6);
        d % 2 ? email = username + '@mac.com' : email = username + '(at)mac.com';
        var h = /^[a-zA-Z0-9\-\._]+@[a-zA-Z0-9\-_]+(\.?[a-zA-Z0-9\-_]*)\.[a-zA-Z]{2,3}$/;
        if (h.test(email)) {
            var b = email + ' appears to be a valid email address.';
            addResult(b);
        } else {
            b = email + ' does NOT appear to be a valid email address.';
            addResult(b);
        }
    }
    for (var e = 0; e < 4000; e++) {
        var c = true;
        var a = makeNumber(4);
        e % 2 ? a = a + 'xyz' : a = a.concat('7');
        for (var f = 0; f < a.length; f++) {
            var g = a.charAt(f);
            if (g < '0' || g > '9') {
                c = false;
                b = a + ' contains letters.';
                addResult(b);
            }
        }
        if (c && a.length > 5) {
            c = false;
            b = a + ' is longer than five characters.';
            addResult(b);
        }
        if (c) {
            b = a + ' appears to be a valid ZIP code.';
            addResult(b);
        }
    }
}
function makeName(d) {
    var a = '';
    for (var b = 0; b < d; b++) {
        var c = Math.floor(26 * Math.random());
        a += letters[c];
    }
    return a;
}
function makeNumber(d) {
    var a = '';
    for (var b = 0; b < d; b++) {
        var c = Math.floor(9 * Math.random());
        a = a.concat(c);
    }
    return a;
}
function addResult(a) {
    endResult += '\n' + a;
}
doTest();