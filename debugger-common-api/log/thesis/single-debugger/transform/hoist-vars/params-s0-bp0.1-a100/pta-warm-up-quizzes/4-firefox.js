var p1 = new Person("Peter");
var p2 = p1;
function Person(name) { this.name = name; }
Person.prototype = {
isJoe: function() {
return this.name === "Joe";
}
};
p1.name = "Joe";
console.log(p2.isJoe());