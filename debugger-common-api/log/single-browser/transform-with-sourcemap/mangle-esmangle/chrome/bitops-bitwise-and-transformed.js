bitwiseAndValue = 4294967296;
for (var i = 0; i < 600000; i++)
    bitwiseAndValue = bitwiseAndValue & i;
var result = bitwiseAndValue;
var expected = 0;
if (result != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + result;