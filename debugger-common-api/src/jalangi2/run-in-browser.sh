#!/usr/bin/env bash
node /home/daniel/Documents/masterthesis/implementation/jalangi2-master/src/js/commands/instrument.js --inlineIID --inlineSource -i --inlineJalangi --analysis src/jalangi2/trace.js --outputDir /tmp /home/daniel/Documents/masterthesis/test/bugreports/chrome-issue568159/
firefox /tmp/chrome-issue568159/index.html