// Firefox shows this as === null before the definition
// Why not undefined like Chrome?
// Why show it at all if it is lexically scoped?
const scriptConst = 3.14;

// non-strict JavaScript allows repeated parameters
// Chrome: last is bound
// Firefox: first is bound
fnName("arg1", "arg2", "arg3");
function fnName(param, param2, param) {
	// scope chain structure is different
	// Firefox: "block" scope type for let/const-bound
	// Chrome: integrates them into regular function scope, but undefined until reached

	// both show all local variables in this block as undefined here

    var shadowedVarBound = 1337;

    {
    	// Firefox initializes outer block-scoped bindings (via let/const) to null here!?
    	// i.e. now letBound and constBound === null instead of === undefined before

        // in both browsers it overwrites the binding in the parent scope
    	var shadowedVarBound = 12;

    	// after leaving this block, Firefox sets LetInNestedBlockBound === null
    	// why not undefined?
        let LetInNestedBlockBound = 42;
    }

    {
        let secondBlock = 1;
    }

    var varBound = 1337;
    let letBound = "hello world";
    const constBound = true;

    var notInitialized;

	var someObject = { bla: "test" };
    var someArray = [1, { bla: "test" }, "string" ];
	var someFunction = function() {};
	var someNull = null;
	var someUndefined = undefined;
	var someNotJsonSerializable1 = -0;
	var someNotJsonSerializable2 = NaN;
}