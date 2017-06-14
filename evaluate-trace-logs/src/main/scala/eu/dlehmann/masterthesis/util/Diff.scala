package eu.dlehmann.masterthesis.util

import java.nio.file.Path

object Diff {

  def diffLineSum(file1: Path, file2: Path): Int = {
    import sys.process._
    val output: String = (s"diff $file1 $file2" #| "diffstat -mt") // -t creates table, -m sums added and deleted lines up to modified
      .lineStream_!.drop(1) // remove header of table output
      .headOption.getOrElse("0,0,0,0") // for equal files, there is no second line, so add zeroes
    val Array(inserted, deleted, modified, _) = output.split(',')
    inserted.toInt + deleted.toInt + modified.toInt
  }

}
