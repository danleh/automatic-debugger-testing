true;
!true;
!true;
!!true;
[] == false;
'' == false;
null == false;
+true;
true + 1;
true + true === 2;
'0' && {};
0 && {};
0 == '0';
null == undefined;
undefined = 42;
typeof a === 'undefined';
typeof 'abc' == 'string';
typeof String('abc') == 'string';
String('abc') == 'abc';
'I am a string' instanceof String;
String('abc') instanceof String;
new String('abc') instanceof String;
String('abc') == new String('abc');
'foo' + +'bar';
Object.prototype.toString.call([
    1,
    2,
    3
]);
({}.toString.call(new Date()));
10000000000000000;
0.1 + 0.2 === 0.3;
1 === 1;
Number.prototype.isOne = function () {
    return +this === 1;
};
3 > 2 > 1;
3 > 2;
true > 1;
3 > 2 >= 1;
'2' + 1;
'2' - 1;
'222' - -'111';
'222' - -1;
parseInt('06');
parseInt('08');
Number('Infinity');
parseFloat('Infinity');
parseInt('Infinity');
42.888.toFixed(2);
42..toFixed(2);
Math.round(4.2) === ~~4.2;
Infinity === 1 / 0;
Infinity - 1;
1 - Infinity;
0 === -0;
1 / 0 === 1 / -0;
Number.MAX_VALUE * 1;
Number.MAX_VALUE * 1.0000000000000002;
Number.MIN_VALUE > 0;
Math.max(0, 1, 2);
Math.max() > Math.min();
Math instanceof Math;
typeof NaN;
NaN instanceof Number;
isNaN(null);
isNaN(null) == 0;
+null;
NaN === NaN;
Date.now() === +new Date();
d = new Date('silent failures are the best');
d.getTime();
',,,' == new Array(4);
[
    0,
    1,
    2
][0, 1, 2];
[] == [];
[] == ![];
[] == 0;
+[] === 0;
+([] == 0);
2 == [2];
2 === Number([2].valueOf().toString());
typeof null;
null instanceof Object;
var args = [].slice.call(arguments);
4095..constructor;
var c = 'constructor';
c[c][c]('console.log(\'wtfjs!\')')();
function b() {
}
;
b() instanceof b;
new b() instanceof b;
function b() {
    if (!(this instanceof b))
        return new b();
}
;
b() instanceof b;