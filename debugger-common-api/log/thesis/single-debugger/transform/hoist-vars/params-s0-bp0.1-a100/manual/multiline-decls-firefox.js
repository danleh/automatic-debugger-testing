// stepIn/stepOut are completely equal in both
var expr = 42; // both pause here
var expr =     // FF pauses here
    42;        // both pause here
var arr =      // FF pauses here
    expr;      // both pause here
var arr =      // FF pauses here
    [ 1 ];     // both pause here
var arr =      // FF pauses here
    [ expr ];  // both pause here
var arr = [    // both pause here
    1          // nobody pauses here
];             // nobody pauses here
var arr = [    // both pause here
    expr       // FF pauses here
];             // nobody pauses here
console.log("begin");
console.log("end"); // both pause here