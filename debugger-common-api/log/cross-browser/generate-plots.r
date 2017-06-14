#!/usr/bin/Rscript
require(ggplot2)
source("~/R/multiplot.r")

olddata = read.csv("results-old.csv")
newdata = read.csv("results.csv")

newcum = ggplot(newdata, aes(newdata$changed.lines.sum)) + stat_ecdf(size=1.2) + labs(x = "changed lines/line sum", y = "cumulative probability", title = "ECDF of new data") + xlim(0, 1)
oldcum = ggplot(olddata, aes(olddata$X..chars.changed.sum)) + stat_ecdf(size=1.2) + labs(x = "changed chars/char sum", y = "cumulative probability", title = "ECDF of old data") + xlim(0, 1)

newperc = ggplot(newdata, aes(seq_along(newdata$changed.lines.sum)/nrow(newdata), sort(newdata$changed.lines.sum))) + geom_line(size=1.2) + labs(x = "percentile", y = "changed lines/line sum", title = "Quantile function of new data") + ylim(0, 1)
oldperc = ggplot(olddata, aes(seq_along(olddata$X..chars.changed.sum)/nrow(olddata), sort(olddata$X..chars.changed.sum))) + geom_line(size=1.2) + labs(x = "percentile", y = "changed lines/line sum", title = "Quantile function of old data") + ylim(0, 1)

ggsave("old-vs-new-distribution.pdf", multiplot(newcum, newperc, oldcum, oldperc, cols = 2), height = 10, width = 10)
