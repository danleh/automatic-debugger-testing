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
data <- results[results$cols == "false" & ((results$bpIds == "false" & results$actionsCount == 100 & results$breakpointsPerLine == 0.1) | (results$technique == "cascaded-0-bp-sliding" & results$bpIds == "true")), ]
data$technique_order = factor(data$technique, levels = c("naive", "cascaded-0-bp-sliding","cascaded-1-resolved-bp-locations", "cascaded-2-pause-locations-all", "cascaded-2-pause-locations-resume", "cascaded-2-pause-locations-resume-no-loops", "cascaded-3-call-stack", "cascaded-4-bindings"))
levels(data$technique_order) <- c("Naïve", "Cascade 1: Breakpoint Sliding", "Cascade 2: Only BPs, no Actions", "Cascade 2: All Actions", "Cascade 2: Resumes", "Cascade 2: Not Loop Resumes", "Cascade 3: Call Stack", "Cascade 4: Bindings")
# use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
cairo_pdf("cross-browser-effectiveness.pdf", family="Myriad Pro", width=4.5, height=9)
print(
  ggplot(data, aes(linesDiffByLinesSum, color = factor(data$technique_order)))
  + guides(color=FALSE)
  #+ guides(color = guide_legend(title="Breakpoints per Line"))
  + stat_myecdf(size=0.5)
  + labs(x = "Normalized Difference Rate", y = "Cumulative Probability of Test Programs")
  + xlim(0, 1)
  + ylim(0, 1)
  + facet_wrap(~data$technique_order, nrow = 4, strip.position="right")
  + coord_flip() # flip for inverse = quantile function
  + theme(aspect.ratio = 1)
  + theme(strip.background=element_rect(fill="white"))
)
dev.off()





# # plot_browser_result <- function(filename, data) {
# #   # use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
# #   cairo_pdf(filename, family="DejaVu Sans", width=12, height=8)
# #   print(ggplot(
# #     data, 
# #     aes(x = data$X..breakpoints, y = data$X..diff.lines.combination))
# #     + labs(x = "number of breakpoints (log scale)", y = "changed lines/line sum (ϵ [0, 1])")
# #     + scale_x_log10()
# #     + geom_line(aes(colour = data$SunSpider.testcase), size = 1.2)
# #     + geom_point(aes(colour = data$SunSpider.testcase))
# #     + facet_wrap(~data$SunSpider.testcase, nrow = 4)
# #     + guides(colour = FALSE)
# #   )
# #   dev.off()
# # }
# 
# results = read.csv("results.csv")
# data <- results[results$bpIds == "false" & results$cols == "false" & results$breakpointsPerLine == 0.1 & results$actionsCount == 10, ]
# data$technique_order = factor(data$technique, levels = c("naive", "cascaded-1-resolved-bp-locations", "cascaded-2-pause-locations-all", "cascaded-2-pause-locations-resume", "cascaded-2-pause-locations-resume-no-loops", "cascaded-3-call-stack", "cascaded-4-bindings"))
# ggplot(data, aes(x = data$testcase, y = data$linesDiffByLinesSum)) + geom_bar(stat = "identity", aes(fill = data$testcase), width = .8) + facet_wrap(~data$technique, nrow = 2) + theme(axis.text.x=element_text(angle=45, hjust=1, vjust=1)) + guides(fill = FALSE)
# 
# #plot_browser_result("firefox-plots.pdf", results[results$Browser == "firefox",2:4])
# #plot_browser_result("chrome-plots.pdf", results[results$Browser == "chrome",2:4])
# 
# # # quantile functions
# # # use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
# # cairo_pdf("distributions.pdf", family="DejaVu Sans", width=10, height=6)
# # print(
# #   ggplot(results, aes(X..diff.lines.combination, color = Browser))
# #   + scale_colour_manual(values = c("#0266C8", "#E66000"))
# #   + stat_ecdf(size=0.5)
# #   + labs(x = "changed lines/line sum", y = "cumulative probability", title = "Quantile Function") 
# #   + xlim(0, 1)
# #   + coord_flip() # flip for inverse = quantile function
# # )
# # dev.off()

