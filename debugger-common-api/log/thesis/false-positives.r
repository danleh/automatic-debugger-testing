results = read.csv("results.csv")

data_cascade0 <- results[results$technique == "cascaded-0-bp-sliding" & results$cols == "false" & results$bpIds == "true" & results$linesDiff > 0,]
data <- results[results$actionsCount == 100 & results$breakpointsPerLine == 0.1 & results$cols == "false" & results$bpIds == "false" & results$linesDiff > 0,]

