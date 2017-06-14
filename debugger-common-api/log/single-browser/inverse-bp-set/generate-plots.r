#!/usr/bin/Rscript
require(ggplot2)
plot_browser_result <- function(filename, data) {
  # use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
  cairo_pdf(filename, family="DejaVu Sans", width=22, height=14)
  print(
    ggplot(
      data,
      aes(x = data$SunSpider.testcase, y = data$X..diff.lines)
    )
    + labs(x = "testcase", y = "changed lines/line sum (ϵ [0, 1])")
    + geom_bar(stat = "identity", aes(fill = data$SunSpider.testcase), width = .8)
    + guides(fill = FALSE)
    + theme(axis.text.x=element_text(angle=45, hjust=1, vjust=1))
  )
  dev.off()
}

plot_browser_quantiles <- function(filename, data) {
  # use cairo_pdf for UTF8 support, see http://stackoverflow.com/questions/12768176/unicode-characters-in-ggplot2-pdf-output
  cairo_pdf(filename, family="DejaVu Sans", width=10, height=6)
  print(
    ggplot(data, aes(X..diff.lines, color = Browser))
    + scale_colour_manual(values = c("#E66000"))
    + stat_ecdf(size=0.5)
    + labs(x = "changed lines/line sum", y = "cumulative probability", title = "Quantile Function") 
    + xlim(0, 1)
    + coord_flip() # flip for inverse = quantile function
  )
  dev.off()
}

results = read.csv("results.csv")
#results <- within(results, Transformation <- factor(Transformation, levels = c("hoist-funcs", "randomize-funcs", "hoist-randomize-funcs", "hoist-vars", "mangle-esmangle", "mangle-uglifyjs2")))
ff = results[results$Browser == "firefox",2:3]
chrome = results[results$Browser == "chrome",2:3]

plot_browser_result("firefox-plots.pdf", ff)
plot_browser_result("chrome-plots.pdf", chrome)
plot_browser_quantiles("distributions.pdf", results)
