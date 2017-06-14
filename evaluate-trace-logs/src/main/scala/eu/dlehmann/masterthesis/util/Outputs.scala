package eu.dlehmann.masterthesis.util

case class Outputs(linesSum: Int, linesDiff: Int, linesDiffByLinesSum: Double) extends DataClass {
  require(linesDiffByLinesSum >= 0.0 && linesDiffByLinesSum <= 1.0, s"percent not in interval [0, 1], was $linesDiffByLinesSum")
}
