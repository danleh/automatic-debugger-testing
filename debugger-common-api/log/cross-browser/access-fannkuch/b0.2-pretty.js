          /* The Great Computer Language Shootout
             http://shootout.alioth.debian.org/
             contributed by Isaac Gouy */
          
          function fannkuch(n) {
             var check = 0;
             var perm = Array(n);
/*   0 */    var perm1 = Array(n);
             var count = Array(n);
             var maxPerm = Array(n);
/*   1 */    var maxFlipsCount = 0;
             var m = n - 1;
          
             for (var i = 0;
               i < n;
/*   2 */      i++)
           perm1[i] = i;
             var r = n;
          
             while (true) {
                // write-out the first 30 permutations
                if (check < 30){
                   var s = "";
/*   3 */          for (var i=0;
                     i<n;
                     i++)
           s += (perm1[i]+1).toString();
                   check++;
                }
          
                while (r != 1) { count[r - 1] = r; r--; }
                if (!(perm1[0] == 0 || perm1[m] == m)) {
                   for (var i = 0;
/*   4 */            i < n;
                     i++)
           perm[i] = perm1[i];
          
                   var flipsCount = 0;
                   var k;
          
                   while (!((k = perm[0]) == 0)) {
                      var k2 = (k + 1) >> 1;
                      for (var i = 0;
                        i < k2;
                        i++)
/*   5 */  {
                         var temp = perm[i]; perm[i] = perm[k - i]; perm[k - i] = temp;
                      }
                      flipsCount++;
                   }
          
                   if (flipsCount > maxFlipsCount) {
/*   6 */             maxFlipsCount = flipsCount;
                      for (var i = 0;
                        i < n;
                        i++)
/*   7 */  maxPerm[i] = perm1[i];
/*   8 */          }
                }
          
                while (true) {
/*   9 */          if (r == n) return maxFlipsCount;
                   var perm0 = perm1[0];
                   var i = 0;
                   while (i < r) {
                      var j = i + 1;
                      perm1[i] = perm1[j];
                      i = j;
                   }
                   perm1[r] = perm0;
          
                   count[r] = count[r] - 1;
                   if (count[r] > 0) break;
/*  10 */          r++;
                }
             }
          }
/*  11 */ 
          var n = 8;
          var ret = fannkuch(n);
          
          var expected = 22;
          if (ret != expected)
              throw "ERROR: bad result: expected " + expected + " but got " + ret;
          
          
