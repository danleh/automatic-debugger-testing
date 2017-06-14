          // The Great Computer Language Shootout
          // http://shootout.alioth.debian.org/
          //
          // contributed by Ian Osgood
          
          function A(i,j) {
            return 1/((i+j)*(i+j+1)/2+i+1);
/*   0 */ }
          
          function Au(u,v) {
            for (var i=0;
              i<u.length;
/*   1 */     ++i)
           {
              var t = 0;
              for (var j=0;
/*   2 */       j<u.length;
                ++j)
          
                t += A(i,j) * u[j];
              v[i] = t;
            }
          }
          
/*   3 */ function Atu(u,v) {
            for (var i=0;
              i<u.length;
              ++i)
           {
              var t = 0;
              for (var j=0;
                j<u.length;
                ++j)
          
                t += A(j,i) * u[j];
              v[i] = t;
            }
          }
          
          function AtAu(u,v,w) {
            Au(u,w);
            Atu(w,v);
          }
          
          function spectralnorm(n) {
            var i, u=[], v=[], w=[], vv=0, vBv=0;
            for (i=0;
/*   4 */     i<n;
              ++i)
           {
              u[i] = 1; v[i] = w[i] = 0;
/*   5 */   }
            for (i=0;
              i<10;
              ++i)
/*   6 */  {
              AtAu(u,v,w);
/*   7 */     AtAu(v,u,w);
            }
            for (i=0;
/*   8 */     i<n;
              ++i)
           {
              vBv += u[i]*v[i];
              vv  += v[i]*v[i];
            }
            return Math.sqrt(vBv/vv);
          }
          
          var total = 0;
          
          for (var i = 6;
/*   9 */   i <= 48;
            i *= 2)
           {
              total += spectralnorm(i);
/*  10 */ }
          
          var expected = 5.086694231303284;
          
          if (total != expected)
              throw "ERROR: bad result: expected " + expected + " but got " + total;
          
          
