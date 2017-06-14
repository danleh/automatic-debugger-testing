function f(o, f) {
    var n;
    for (var l = 0; l < arguments.length; l++) {
        n += arguments[l];
    }
    console.log(n);
}

f(1, 2, 3);