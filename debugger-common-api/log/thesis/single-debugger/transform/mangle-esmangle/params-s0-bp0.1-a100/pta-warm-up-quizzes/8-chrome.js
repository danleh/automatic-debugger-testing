function f(c, d) {
    var b;
    for (var a = 0; a < arguments.length; a++) {
        b += arguments[a];
    }
    console.log(b);
}
f(1, 2, 3);