# Automatic Debugger Testing

Abstract accepted to the [2017 SPLASH ACM Student Research Competition](http://2017.splashcon.org/track/splash-2017-Student-Research-Competition#SRC-Participants).

## Found Bugs

Will be updated as soon as more bugs are found or reported ones get confirmed and fixed.

| Browser | Description of the Bug | Bugtracker Link | Status |
| --- | --- | --- | --- |
| Chrome | No inline breakpoints visible with multi-line for-loop header | https://bugs.chromium.org/p/chromium/issues/detail?id=719912 | Fixed |
| Chrome | Let/const variables not shown before declaration in global scope | https://bugs.chromium.org/p/chromium/issues/detail?id=718827 | Reported |
| Chrome | Breakpoint in last line wraps around to first statement | https://bugs.chromium.org/p/chromium/issues/detail?id=730177 | Reported |
| Firefox | BP sliding broken if previous slided there | https://bugzilla.mozilla.org/show_bug.cgi?id=1343060 | Reported |
| Firefox | Step in jumps over for-of loop | https://bugzilla.mozilla.org/show_bug.cgi?id=1362403 | Fixed |
| Firefox | Cannot set breakpoint in for-in/for-of loop without var decl | https://bugzilla.mozilla.org/show_bug.cgi?id=1362416 | Fixed |
| Firefox | Let/const variables not shown on step out | https://bugzilla.mozilla.org/show_bug.cgi?id=1362428 | Reported |
| Firefox | Function parameter with same name has wrong value | https://bugzilla.mozilla.org/show_bug.cgi?id=1362432 | Reported |
| Firefox | Cannot remove breakpoint set after last statement | https://bugzilla.mozilla.org/show_bug.cgi?id=1362439 | Reported |
| Firefox | Let/const variables change value to null before decl | https://bugzilla.mozilla.org/show_bug.cgi?id=1362451 | Reported |
| Firefox | number of steps at for-loop depends on whitespace | https://bugzilla.mozilla.org/show_bug.cgi?id=1363325 | Reported |
| Firefox | for loop variable shown with wrong value | https://bugzilla.mozilla.org/show_bug.cgi?id=1363328 | Reported |
| Firefox | Pauses twice at single function call breakpoint | https://bugzilla.mozilla.org/show_bug.cgi?id=1370641 | Reported |
| Firefox | Debugger pauses at last statement, even if dead code | https://bugzilla.mozilla.org/show_bug.cgi?id=1370648 | Fixed |
| Firefox | number of steps at while loop depends on whitespace | https://bugzilla.mozilla.org/show_bug.cgi?id=1370655 | Reported |
| Firefox | Needs two steps for return value at closing brace | https://bugzilla.mozilla.org/show_bug.cgi?id=923975 | Already reported independently |