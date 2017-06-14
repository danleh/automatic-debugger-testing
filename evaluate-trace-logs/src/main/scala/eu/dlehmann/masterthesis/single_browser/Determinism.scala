package eu.dlehmann.masterthesis.single_browser

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Path, Paths}

import com.github.tototoshi.csv.CSVWriter
import eu.dlehmann.masterthesis.util.Extensions._
import eu.dlehmann.masterthesis.util.{DataClass, Diff, Outputs}

import scala.Ordering.Implicits._

object Determinism extends App {

  case class Parameters(browser: String, bpIds: Boolean, cols: Boolean, restart: Boolean, breakpointsPerLine: Double, actionsCount: Int, testcase: String) extends DataClass

  object Parameters {
    private val filenameMatcher = """params(-bpids)?(-cols)?-r([0-9]+)-bp([0-9\.]+)-a([0-9\.]+)(-restart)?/(.*)/(.*)-(firefox|chrome).trace.log""".r

    def fromFilename(filename: String): Option[Parameters] = filename match {
      case filenameMatcher(bpids, cols, run, breakpointsPerLine, actionsCount, restart, testDir, testcase, browser) =>
        Some(Parameters(browser, bpids != null, cols != null, restart != null, breakpointsPerLine.toDouble, actionsCount.toInt, (testDir + '-' + testcase).replace("pta-warm-up-quizzes","js-puzzle")))
      case _ => None
    }

  }

  val logsDir = Paths.get("/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/single-debugger/determinism")

  val experiments: Map[Parameters, Outputs] = logsDir.recursiveList
    // get parameters from filenames
    .flatMap(logFile => Parameters.fromFilename(logsDir.relativize(logFile).toString).map((logFile, _)))
    // group files by parameters
    .groupBy(_._2).mapValues(_.map(_._1))
    .mapValues {
      case filesGroup if filesGroup.size > 1 =>
        // generate all possible pairings of runs
        val pairs: Seq[Seq[Path]] = filesGroup.toSet.subsets(2).map(_.toSeq.sorted).toSeq.sorted
        val pairOutputs: Seq[Outputs] = pairs.map {
          case files@Seq(file1, file2) =>
            val lineSum = files.map(file => new String(Files.readAllBytes(file), StandardCharsets.UTF_8).lines.length).sum
            val lineDiff = Diff.diffLineSum(file1, file2)
            Outputs(lineSum, lineDiff, lineDiff.toDouble / lineSum)
        }
        Outputs(pairOutputs.map(_.linesSum).sum, pairOutputs.map(_.linesDiff).sum, pairOutputs.map(_.linesDiffByLinesSum).sum / pairOutputs.size)
      case files => throw new IllegalArgumentException(s"need at least two files per parameter set, got $files")
    }

  val header = experiments.head._1.names ++ experiments.head._2.names
  val table = header +: experiments
    .map { case (params, outputs) => params.stringValues() ++ outputs.stringValues(6) }
    .toSeq.sortBy(_.mkString)

  println(table.asTable())

  val csvFile = CSVWriter.open(s"$logsDir/results.csv")
  csvFile.writeAll(table)
}