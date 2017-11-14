# Automatic Debugger Testing

Abstract accepted to the [2017 SPLASH ACM Student Research Competition](http://2017.splashcon.org/track/splash-2017-Student-Research-Competition#SRC-Participants). You can also find the poster [here](https://github.com/danleh/automatic-debugger-testing/blob/master/poster.pdf):

[![Poster Thumbnail](https://raw.githubusercontent.com/danleh/automatic-debugger-testing/master/poster-thumbnail.png)](https://github.com/danleh/automatic-debugger-testing/blob/master/poster.pdf)

## Found Bugs

Will be updated as soon as more bugs are found or reported ones get confirmed and fixed.

| Browser | Description of the Bug | Bugtracker Link | Status |
| --- | --- | --- | --- |
| Chromium | Breakpoint slides over function and to next variable declaration instead | https://bugs.chromium.org/p/chromium/issues/detail?id=784852 | Reported |
| Chromium | Inline breakpoint markers missing with multi-line ```for```-loop header | https://bugs.chromium.org/p/chromium/issues/detail?id=719912 | Fixed |
| Chromium | Inline breakpoint marker missing on ```for```-loop with ```var```-declared variable | https://bugs.chromium.org/p/chromium/issues/detail?id=752443 | Fixed |
| Chromium | ```let```/```const``` variables not shown before declaration in global scope | https://bugs.chromium.org/p/chromium/issues/detail?id=718827 | Reported |
| Chromium | Breakpoint in last line wraps around to first statement | https://bugs.chromium.org/p/chromium/issues/detail?id=730177 | Fixed |
| Firefox | Breakpoint sliding broken if previous breakpoint slided to same line | https://bugzilla.mozilla.org/show_bug.cgi?id=1343060 | Reported |
| Firefox | Cannot set breakpoint in ```for in```/```for of```-loop without loop variable declaration | https://bugzilla.mozilla.org/show_bug.cgi?id=1362416 | Fixed |
| Firefox | Cannot remove breakpoint set after last statement | https://bugzilla.mozilla.org/show_bug.cgi?id=1362439 | Reported |
| Firefox | ```let```/```const``` variables not shown on step out | https://bugzilla.mozilla.org/show_bug.cgi?id=1362428 | Reported |
| Firefox | ```let```/```const``` variables change value to ```null``` before reaching declaration | https://bugzilla.mozilla.org/show_bug.cgi?id=1362451 | Reported |
| Firefox | Pauses twice at single function call breakpoint | https://bugzilla.mozilla.org/show_bug.cgi?id=1370641 | Reported |
| Firefox | Single step in jumps over ```for of```-loop | https://bugzilla.mozilla.org/show_bug.cgi?id=1362403 | Fixed |
| Firefox | Number of steps at ```for```-loop depends on whitespace | https://bugzilla.mozilla.org/show_bug.cgi?id=1363325 | Reported |
| Firefox | Number of steps at ```while```-loop depends on whitespace | https://bugzilla.mozilla.org/show_bug.cgi?id=1370655 | Reported |
| Firefox | ```for```-loop variable shown with wrong value | https://bugzilla.mozilla.org/show_bug.cgi?id=1363328 | Reported |
| Firefox | Function parameter with same name has wrong value | https://bugzilla.mozilla.org/show_bug.cgi?id=1362432 | Reported |
| Firefox | Debugger pauses at last statement, even if dead code | https://bugzilla.mozilla.org/show_bug.cgi?id=1370648 | Fixed |
| Firefox | Two steps needed to show return value at closing brace | https://bugzilla.mozilla.org/show_bug.cgi?id=923975 | Already reported independently |
| Firefox | Cannot set breakpont at some operators like && and === | https://bugzilla.mozilla.org/show_bug.cgi?id=1417196 | Reported |
| Firefox | Breakpoint is hit again after a step, line seems to be executed twice | https://bugzilla.mozilla.org/show_bug.cgi?id=1417240 | Reported |

## Noteworthy Differences (But Possibly Not Bugs) Between Firefox and Chromium
| Id | Description | Example Program | Behavior: Chromium | Behavior: Firefox |
| --- | --- | --- | --- | --- |
| 1 | Breakpoints at multiline variable init expressions | <pre>var foo = [1,<br>  2,<br>  3];<br>// next stmts</pre> | slides bp in line 2 and 3 to following stmts | possible to set bp at line 2 and 3 |
| 2 | Breakpoint at `while(true)` or `if(23)` or `if("string")` | <pre>while(true) {<br>  // some stmt<br>}</pre> | slides bp from line 1 to 2 | allows setting bp at line 1 |
| 3 | Breakpoint sliding empty/comment lines | <pre>// some comment or empty line<br>function(args) {<br>  // some stmt<br>} // ...<br>var foo = 3; // or any other statement</pre> | slides bp from empty line to next top-level statement (i.e., line 5) | slides bp from empty line to next function decl body (line 3) |
| 4 | Breakpoint at variable declaration without init | <pre>var foo;<br>// some stmt</pre> | bp at line 1 slides to 2 | possible to set bp at line 1 |
| 5 | Breakpoint at multiline function call arguments | <pre>foo(<br>  true,<br>  bar()<br>);</pre> | bp at line 2 slides to 3 (cannot set breakpoint at literal argument) | bp at line 2 possible (but what should happen there?) |
| 6 | Breakpoint at function declaration | <pre>function foo() {<br>  // some stmt<br>}</pre> | bp at line 1 slides to 2 (not possible to set at declaration line itself) | possible to set bp at line 1 |
