package eu.dlehmann.masterthesis.util

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Path}

/**
  * Created by daniel on 07.03.17.
  */
object Extensions {

  implicit class PathExtensions(path: Path) {
    def recursiveList: Stream[Path] = Files.walk(path).asScala
    def readToString: String = new String(Files.readAllBytes(path), StandardCharsets.UTF_8)
  }

  implicit class JavaStreamExtension[T](stream: java.util.stream.Stream[T]) {
    import scala.collection.JavaConverters._
    def asScala: Stream[T] = stream.iterator.asScala.toStream
  }

  implicit class SetExtension[T](set: Set[T]) {
    def jiccardIndex(other: Set[T]): Double = set.intersect(other).size.toDouble / set.union(other).size
  }

  implicit class SeqExtension[T](seq: Seq[T]) {

    // similar to Jiccard, but with order
    def orderedJiccardIndex(other: Seq[T]): Double = seq.commonElementsInOrder(other).size.toDouble / seq.merge(other).size

    // NOTE max(a.size, b.size) < (a merge b).size < a.size + b.size
    def merge(other: Seq[T]): Seq[T] = (seq, other) match {
      case (Seq(), _) => other
      case (_, Seq()) => seq
      case (Seq(head1, tail1@_*), Seq(head2, tail2@_*)) if head1 == head2 => head1 +: tail1.merge(tail2)
      case (Seq(head1, tail1@_*), Seq(head2, tail2@_*)) => head1 +: head2 +: tail1.merge(tail2)
    }

    // NOTE 0 < (a common b).size < min(a.size, b.size)
    def commonElementsInOrder(other: Seq[T]): Seq[T] = (seq, other) match {
      case (Seq(), _) | (_, Seq()) => Seq()
      case (Seq(head1, tail1@_*), Seq(head2, tail2@_*)) if head1 == head2 => head1 +: tail1.commonElementsInOrder(tail2)
      case (Seq(head1, tail1@_*), Seq(head2, tail2@_*)) => tail1.commonElementsInOrder(tail2)
    }
  }

  // see http://stackoverflow.com/a/7542476 and http://pastebin.com/WUMaZ9Fy
  implicit class SeqSeq2Table(table: Seq[Seq[Any]]) {
    private def mkStringWithSpacing(seq: Seq[Any], c: String, spacing: Int) = {
      val s = " " * spacing
      seq.mkString(c + s, s + c + s, s + c)
    }

    def asTable(): String = asTable(1)

    def asTable(spacing: Int): String = table match {
      case Seq() => ""
      case _ =>
        val sizes = for (row <- table) yield (for (cell <- row) yield if (cell == null) 0 else cell.toString.length)
        val colSizes = for (col <- sizes.transpose) yield col.max
        val rows = for (row <- table) yield formatRow(row, colSizes, spacing)
        formatRows(rowSeparator(colSizes, spacing), rows)
    }

    def formatRows(rowSeparator: String, rows: Seq[String]): String =
      (rowSeparator :: rows.head :: rowSeparator :: rows.tail.toList ::: rowSeparator :: List()).mkString("\n")

    def formatRow(row: Seq[Any], colSizes: Seq[Int], spacing: Int) = {
      val cells = (for ((item, size) <- row.zip(colSizes)) yield if (size == 0) "" else ("%" + size + "s").format(item))
      mkStringWithSpacing(cells, "|", spacing)
    }

    def rowSeparator(colSizes: Seq[Int], spacing: Int) = colSizes map {
      "-" * _
    } mkString("+ ", " + ", " +")
  }

}
