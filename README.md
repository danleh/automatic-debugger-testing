# Automatic Debugger Testing

Testing interactive JavaScript debuggers by randomly generating _debugging actions_ (breakpoints, steps, etc.) and comparing their outputs against each other (== _differential testing_).

Directory structure (see individual READMEs for details):

- ```bugreports/```: All reported debugger bugs/strange behaviors, each with minimal program-to-debug, report on how to reproduce it, and a video of it in the GUI of the debugger.
- ```implementation/``` in TypeScript.
- ```programs-to-debug/```: Programs we used for evaluation, feel free to choose other ones by editing ```implementation/testcases.ts```.
- ```splash-src/```: Material for SPLASH 2017 Student Research Competition, the approach was first presented.
