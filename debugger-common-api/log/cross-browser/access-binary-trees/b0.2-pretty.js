          /* The Great Computer Language Shootout
             http://shootout.alioth.debian.org/
             contributed by Isaac Gouy */
          
          function TreeNode(left,right,item){
             this.left = left;
/*   0 */    this.right = right;
             this.item = item;
/*   1 */ }
          
          TreeNode.prototype.itemCheck = function(){
             if (this.left==null) return this.item;
             else return this.item + this.left.itemCheck() - this.right.itemCheck();
          }
          
          function bottomUpTree(item,depth){
             if (depth>0){
                return new TreeNode(
                    bottomUpTree(2*item-1, depth-1)
                   ,bottomUpTree(2*item, depth-1)
                   ,item
/*   2 */       );
             }
             else {
                return new TreeNode(null,null,item);
             }
          }
          
          var ret = 0;
          
          for ( var n = 4;
            n <= 7;
            n += 1 )
           {
              var minDepth = 4;
              var maxDepth = Math.max(minDepth + 2, n);
              var stretchDepth = maxDepth + 1;
/*   3 */     
              var check = bottomUpTree(0,stretchDepth).itemCheck();
              
              var longLivedTree = bottomUpTree(0,maxDepth);
              for (var depth=minDepth;
/*   4 */       depth<=maxDepth;
                depth+=2)
          {
                  var iterations = 1 << (maxDepth - depth + minDepth);
/*   5 */ 
                  check = 0;
                  for (var i=1;
                    i<=iterations;
                    i++)
          {
                      check += bottomUpTree(i,depth).itemCheck();
                      check += bottomUpTree(-i,depth).itemCheck();
                  }
              }
          
              ret += longLivedTree.itemCheck();
/*   6 */ }
          
          var expected = -4;
          if (ret != expected)
              throw "ERROR: bad result: expected " + expected + " but got " + ret;
