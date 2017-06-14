#!/usr/bin/Rscript
require(ggplot2)
plot_browser_result <- function(filename, data) {
  # use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
  cairo_pdf(filename, family="DejaVu Sans", width=12, height=8)
  print(ggplot(
    data, 
    aes(x = data$X..breakpoints, y = data$X..diff.lines.combination))
    + labs(x = "number of breakpoints (log scale)", y = "changed lines/line sum (ϵ [0, 1])")
    + scale_x_log10()
    + geom_line(aes(colour = data$SunSpider.testcase), size = 1.2)
    + geom_point(aes(colour = data$SunSpider.testcase))
    + facet_wrap(~data$SunSpider.testcase, nrow = 4)
    + guides(colour = FALSE)
  )
  dev.off()
}

results = read.csv("results.csv")
plot_browser_result("firefox-plots.pdf", results[results$Browser == "firefox",2:4])
plot_browser_result("chrome-plots.pdf", results[results$Browser == "chrome",2:4])

# quantile functions
# use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
cairo_pdf("distributions.pdf", family="DejaVu Sans", width=10, height=6)
print(
  ggplot(results, aes(X..diff.lines.combination, color = Browser))
  + scale_colour_manual(values = c("#0266C8", "#E66000"))
  + stat_ecdf(size=0.5)
  + labs(x = "changed lines/line sum", y = "cumulative probability", title = "Quantile Function") 
  + xlim(0, 1)
  + coord_flip() # flip for inverse = quantile function
)
dev.off()
