package eu.dlehmann.masterthesis.util

trait DataClass extends Product {
  def names: Seq[String] = this.getClass.getDeclaredFields.map(_.getName)
  def values: Seq[Any] = this.productIterator.toSeq
  def stringValues(floatDigits: Int = 1): Seq[String] = values.map {
    case double: Double => double.formatted(s"%.${floatDigits}f")
    case any => any.toString
  }
}
