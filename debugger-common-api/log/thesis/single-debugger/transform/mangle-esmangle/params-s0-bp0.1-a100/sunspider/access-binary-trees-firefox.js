function TreeNode(a, b, c) {
    this.left = a;
    this.right = b;
    this.item = c;
}
TreeNode.prototype.itemCheck = function () {
    if (this.left == null)
        return this.item;
    else
        return this.item + this.left.itemCheck() - this.right.itemCheck();
};
function bottomUpTree(a, b) {
    if (b > 0) {
        return new TreeNode(bottomUpTree(2 * a - 1, b - 1), bottomUpTree(2 * a, b - 1), a);
    } else {
        return new TreeNode(null, null, a);
    }
}
var ret = 0;
for (var n = 4; n <= 7; n += 1) {
    var minDepth = 4;
    var maxDepth = Math.max(minDepth + 2, n);
    var stretchDepth = maxDepth + 1;
    var check = bottomUpTree(0, stretchDepth).itemCheck();
    var longLivedTree = bottomUpTree(0, maxDepth);
    for (var depth = minDepth; depth <= maxDepth; depth += 2) {
        var iterations = 1 << maxDepth - depth + minDepth;
        check = 0;
        for (var i = 1; i <= iterations; i++) {
            check += bottomUpTree(i, depth).itemCheck();
            check += bottomUpTree(-i, depth).itemCheck();
        }
    }
    ret += longLivedTree.itemCheck();
}
var expected = -4;
if (ret != expected)
    throw 'ERROR: bad result: expected ' + expected + ' but got ' + ret;