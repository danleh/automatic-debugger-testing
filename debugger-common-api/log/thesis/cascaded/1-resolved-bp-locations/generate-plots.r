#!/usr/bin/Rscript
require(ggplot2)

# see https://github.com/tidyverse/ggplot2/issues/1467
stat_myecdf <- function(mapping = NULL, data = NULL, geom = "step",
                        position = "identity", n = NULL, na.rm = FALSE,
                        show.legend = NA, inherit.aes = TRUE, direction="vh", ...) {
  layer(
    data = data,
    mapping = mapping,
    stat = StatMyecdf,
    geom = geom,
    position = position,
    show.legend = show.legend,
    inherit.aes = inherit.aes,
    params = list(
      n = n,
      na.rm = na.rm,
      direction=direction,
      ...
    )
  )
}

StatMyecdf <- ggproto("StatMyecdf", Stat,
                      compute_group = function(data, scales, n = NULL) {
                        
                        # If n is NULL, use raw values; otherwise interpolate
                        if (is.null(n)) {
                          # Dont understand why but this version needs to sort the values
                          xvals <- sort(unique(data$x))
                        } else {
                          xvals <- seq(min(data$x), max(data$x), length.out = n)
                        }
                        
                        y <- ecdf(data$x)(xvals)
                        x1 <- max(xvals)
                        y0 <- 0                      
                        data.frame(x = c(xvals, x1), y = c(y0, y))
                      },
                      
                      default_aes = aes(y = ..y..),
                      
                      required_aes = c("x")
)

results = read.csv("results.csv")

# use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
cairo_pdf("bpIds-cols-influence.pdf", family="Myriad Pro", width=6, height=4)
print(
  ggplot(results[results$actionsCount == 10 & results$breakpointsPerLine == 1, ], aes(linesDiffByLinesSum, color = interaction(bpIds, cols)))
#  + scale_colour_manual(values = c("#0266C8", "#E66000"))
+ guides(color = guide_legend(title=NULL))
+ scale_color_discrete(labels = c("No Bp IDs & No Column Numbers", "No Column Numbers", "No Bp IDs", "Both Recorded"))
+ stat_myecdf(size=0.5)
+ labs(x = "Changed Lines / Sum Lines", y = "Cumulative Probability", title = "Quantile Function") 
  + xlim(0, 1)
  + ylim(0, 1)
  + coord_flip() # flip for inverse = quantile function
)
dev.off()

# # use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
# cairo_pdf("actionsCount-influence.pdf", family="Myriad Pro", width=6, height=4)
# print(
#   ggplot(results[results$bpIds == "false" & results$cols == "false" & results$breakpointsPerLine == 0.1, ], aes(linesDiffByLinesSum, color = factor(actionsCount)))
#   + guides(color = guide_legend(title="Number of Actions"))
#   + stat_myecdf(size=0.5)
#   + labs(x = "Changed Lines / Sum Lines", y = "Cumulative Probability", title = "Quantile Function")
#   + xlim(0, 1)
#   + ylim(0, 1)
#   + coord_flip() # flip for inverse = quantile function
# )
# dev.off()

# use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
cairo_pdf("breakpointsPerLine-influence-with-actions.pdf", family="Myriad Pro", width=6, height=4)
print(
  ggplot(results[results$bpIds == "false" & results$cols == "false" & results$actionsCount == 10, ], aes(linesDiffByLinesSum, color = factor(breakpointsPerLine)))
  + guides(color = guide_legend(title="Breakpoints / Line"))
  + stat_myecdf(size=0.5)
  + labs(x = "Changed Lines / Sum Lines", y = "Cumulative Probability", title = "Quantile Function")
  + xlim(0, 1)
  + ylim(0, 1)
  + coord_flip() # flip for inverse = quantile function
)
dev.off()

# # use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
# cairo_pdf("breakpointsPerLine-influence-only-bps.pdf", family="Myriad Pro", width=6, height=4)
# print(
#   ggplot(results[results$bpIds == "false" & results$cols == "false" & results$actionsCount == 0, ], aes(linesDiffByLinesSum, color = factor(breakpointsPerLine)))
#   + guides(color = guide_legend(title="Breakpoints / Line"))
#   + stat_myecdf(size=0.5)
#   + labs(x = "Changed Lines / Sum Lines", y = "Cumulative Probability", title = "Quantile Function") 
#   + xlim(0, 1)
#   + ylim(0, 1)
#   + coord_flip() # flip for inverse = quantile function
# )
# dev.off()
