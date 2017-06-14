package eu.dlehmann.masterthesis.single_browser

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Path, Paths}

import com.github.tototoshi.csv.CSVWriter
import eu.dlehmann.masterthesis.util.Extensions._
import eu.dlehmann.masterthesis.util.{DataClass, Diff, Outputs}

object ProgramTransformations extends App {
  case class Parameters(transformation: String, browser: String, bpIds: Boolean, cols: Boolean, seed: Int, breakpointsPerLine: Double, actionsCount: Int, testcase: String) extends DataClass

  object Parameters {

    private val validTransformations = Seq(
      "hoist-vars",
      "hoist-funcs",
      "randomize-funcs",
      "hoist-randomize-funcs",
      "mangle-esmangle",
      "mangle-uglifyjs2")

    private val filenameMatcher = (validTransformations.mkString("(", "|", ")")
      +
      """/params(-bpids)?(-cols)?-s([0-9]+)-bp([0-9\.]+)-a([0-9\.]+)(-orig)?/(.*)/(.*)-(firefox|chrome).trace.log""").r

    def fromFilename(filename: String): Option[Parameters] = filename match {
      case filenameMatcher(transformation, bpids, cols, seed, breakpointsPerLine, actionsCount, orig, testDir, testcase, browser) =>
        Some(Parameters(transformation, browser, bpids != null, cols != null, seed.toInt, breakpointsPerLine.toDouble, actionsCount.toInt, (testDir + '-' + testcase).replace("pta-warm-up-quizzes","js-puzzle")))
      case _ => None
    }
  }

  val logsDir = Paths.get("/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/single-debugger/transform")

  val experiments: Map[Parameters, Outputs] = logsDir.recursiveList
    // get parameters from filenames
    .flatMap(logFile => Parameters.fromFilename(logsDir.relativize(logFile).toString).map((logFile, _)))
    // group files by parameters
    .groupBy(_._2).mapValues(_.map(_._1))
    .mapValues {
      case files@Seq(file1, file2) =>
        val lineSum = files.map(file => new String(Files.readAllBytes(file), StandardCharsets.UTF_8).lines.length).sum
        val lineDiff = Diff.diffLineSum(file1, file2)
        Outputs(lineSum, lineDiff, if (lineSum == 0.0) {0.0} else {lineDiff.toDouble / lineSum})
      case files => throw new IllegalArgumentException(s"need two files per parameter set, got $files")
    }

  val header = experiments.head._1.names ++ experiments.head._2.names
  val table: Seq[Seq[String]] = header +: experiments
    .map { case (params, outputs) => params.stringValues() ++ outputs.stringValues(6) }
    .toSeq.sortBy(_.mkString)

  println(table.asTable())

  val csvFile = CSVWriter.open(s"$logsDir/results.csv")
  csvFile.writeAll(table)
}