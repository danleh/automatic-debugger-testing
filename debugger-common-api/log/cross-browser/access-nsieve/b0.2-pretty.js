          // The Great Computer Language Shootout
          // http://shootout.alioth.debian.org/
          //
          // modified by Isaac Gouy
          
          function pad(number,width){
             var s = number.toString();
/*   0 */    var prefixWidth = width - s.length;
             if (prefixWidth>0){
/*   1 */       for (var i=1;
                  i<=prefixWidth;
                  i++)
           s = " " + s;
             }
             return s;
          }
          
          function nsieve(m, isPrime){
/*   2 */    var i, k, count;
          
             for (i=2;
               i<=m;
               i++)
           { isPrime[i] = true; }
             count = 0;
          
             for (i=2;
               i<=m;
               i++)
          {
                if (isPrime[i]) {
                   for (k=i+i;
                     k<=m;
/*   3 */            k+=i)
           isPrime[k] = false;
/*   4 */          count++;
                }
/*   5 */    }
             return count;
          }
          
/*   6 */ function sieve() {
              var sum = 0;
              for (var i = 1;
                i <= 3;
                i++ )
           {
                  var m = (1<<i)*10000;
                  var flags = Array(m+1);
                  sum += nsieve(m, flags);
              }
              return sum;
          }
          
          var result = sieve();
/*   7 */ 
          var expected = 14302;
          if (result != expected)
              throw "ERROR: bad result: expected " + expected + " but got " + result;
          
          
          
