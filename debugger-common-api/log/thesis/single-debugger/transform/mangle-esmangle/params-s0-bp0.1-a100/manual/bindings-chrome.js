const scriptConst = 3.14;
fnName('arg1', 'arg2', 'arg3');
function fnName(i, p, i) {
    var a = 1337;
    {
        var a = 12;
        let e = 42;
    }
    {
        let f = 1;
    }
    var g = 1337;
    let h = 'hello world';
    const b = true;
    var o;
    var k = { bla: 'test' };
    var l = [
        1,
        { bla: 'test' },
        'string'
    ];
    var m = function () {
    };
    var n = null;
    var j = undefined;
    var c = -0;
    var d = NaN;
}