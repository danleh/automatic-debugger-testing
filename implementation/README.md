# Implementation

Setup:

```
git clone https://github.com/danleh/automatic-debugger-testing
cd automatic-debugger-testing/implementation

yarn install                         # install dependencies (e.g. TypeScript compiler)
yarn download-and-extract-browsers   # local installation of browser versions that we used for testing, see browsers/
yarn build                           # compile TypeScript to JavaScript, see build/
node build/eval/run-tests.js         # run differential testing (opens Firefox and Chromium, edit package.json if not)
```

[![Setup Video Thumbnail](https://raw.githubusercontent.com/danleh/automatic-debugger-testing/master/setup-preview.jpg)](https://raw.githubusercontent.com/danleh/automatic-debugger-testing/master/setup.mp4)

Optionally group "similar" differences to equivalence classes and sample those for manual inspection (opens Sublime Text for manual inspection): ```node build/eval/eq-class.js```. Check traces in more detail in ```results/```.
