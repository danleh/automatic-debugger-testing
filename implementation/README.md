# Implementation

1. Download and install dependencies to ```node_modules/```: ```yarn install```.
2. Compile TypeScript (in ```src/```) to JavaScript (in ```build/```): ```tsc```.
3. Run differential testing: ```node build/eval/run-tests.js```.
4. Group "similar" differences to equivalence classes and sample those for manual inspection: ```node build/eval/eq-class.js```.
