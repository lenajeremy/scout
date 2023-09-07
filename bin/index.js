#! /usr/bin/env node
const yargs = require("yargs");
const { spawn } = require("node:child_process");
const { readFile, writeFile } = require("node:fs");
const path = require("path");

yargs
  .scriptName("Probe")
  .usage("$0 <cmd> [args]")
  .command(
    "run [port]",
    "Runs Probe on selected port (defaults to 3001)",
    (yargs) => {
      yargs.positional("port", {
        type: "string",
        default: "3001",
        describe: "Port to run Probe",
      });
    },
    function (argv) {
      runScout(argv.port);
    }
  )
  .help().argv;

function runScout(port) {

  console.log('running invinsyble')

  try {
    const runApp = spawn("yarn", ["start"]);

    runApp.stdout.on("data", (data) => {
      console.log(`${data}`);
    });

    runApp.stderr.on("data", (data) => {
      console.error(`${data}`);
    });

    runApp.on("error", (err) => {
      console.error("error", err);
    });

    runApp.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } catch (error) {
    console.log(error);
  }
}
