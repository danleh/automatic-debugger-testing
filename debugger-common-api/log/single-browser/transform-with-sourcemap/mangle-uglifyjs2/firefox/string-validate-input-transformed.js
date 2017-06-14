letters = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");

numbers = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26);

colors = new Array("FF", "CC", "99", "66", "33", "00");

var endResult;

function doTest() {
    endResult = "";
    for (var a = 0; a < 4e3; a++) {
        username = makeName(6);
        a % 2 ? email = username + "@mac.com" : email = username + "(at)mac.com";
        var e = /^[a-zA-Z0-9\-\._]+@[a-zA-Z0-9\-_]+(\.?[a-zA-Z0-9\-_]*)\.[a-zA-Z]{2,3}$/;
        if (e.test(email)) {
            var r = email + " appears to be a valid email address.";
            addResult(r);
        } else {
            r = email + " does NOT appear to be a valid email address.";
            addResult(r);
        }
    }
    for (var t = 0; t < 4e3; t++) {
        var s = true;
        var l = makeNumber(4);
        t % 2 ? l = l + "xyz" : l = l.concat("7");
        for (var n = 0; n < l.length; n++) {
            var o = l.charAt(n);
            if (o < "0" || o > "9") {
                s = false;
                r = l + " contains letters.";
                addResult(r);
            }
        }
        if (s && l.length > 5) {
            s = false;
            r = l + " is longer than five characters.";
            addResult(r);
        }
        if (s) {
            r = l + " appears to be a valid ZIP code.";
            addResult(r);
        }
    }
}

function makeName(a) {
    var e = "";
    for (var r = 0; r < a; r++) {
        var t = Math.floor(26 * Math.random());
        e += letters[t];
    }
    return e;
}

function makeNumber(a) {
    var e = "";
    for (var r = 0; r < a; r++) {
        var t = Math.floor(9 * Math.random());
        e = e.concat(t);
    }
    return e;
}

function addResult(a) {
    endResult += "\n" + a;
}

doTest();