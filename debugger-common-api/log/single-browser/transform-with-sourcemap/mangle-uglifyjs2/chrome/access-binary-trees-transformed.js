function TreeNode(e, t, r) {
    this.left = e;
    this.right = t;
    this.item = r;
}

TreeNode.prototype.itemCheck = function() {
    if (this.left == null) return this.item; else return this.item + this.left.itemCheck() - this.right.itemCheck();
};

function bottomUpTree(e, t) {
    if (t > 0) {
        return new TreeNode(bottomUpTree(2 * e - 1, t - 1), bottomUpTree(2 * e, t - 1), e);
    } else {
        return new TreeNode(null, null, e);
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

if (ret != expected) throw "ERROR: bad result: expected " + expected + " but got " + ret;