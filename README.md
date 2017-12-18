# Automatic Debugger Testing

Testing interactive JavaScript debuggers by randomly generating _debugging actions_ (breakpoints, steps, etc.) and comparing their outputs against each other (== _differential testing_).

## Example Debugger Bug We Found

[![Bug Video Thumbnail](https://raw.githubusercontent.com/danleh/automatic-debugger-testing/master/bug-preview.jpg)](https://raw.githubusercontent.com/danleh/automatic-debugger-testing/master/bugreports/ff-loop-variable-shown-with-previous-val/screencapture.ogv)

## Setup in 1 Minute

[![Setup Video Thumbnail](https://raw.githubusercontent.com/danleh/automatic-debugger-testing/master/setup-preview.jpg)](https://raw.githubusercontent.com/danleh/automatic-debugger-testing/master/setup.mp4)

## Directory Structure

(See individual READMEs for details.)

- ```bugreports/```: All reported debugger bugs/strange behaviors, each with minimal program-to-debug, report on how to reproduce it, and a video of it in the GUI of the debugger.
- ```implementation/``` in TypeScript.
- ```programs-to-debug/```: Programs we used for evaluation, feel free to choose other ones by editing ```implementation/testcases.ts```.
- ```splash-src/```: Material for SPLASH 2017 Student Research Competition, the approach was first presented.
