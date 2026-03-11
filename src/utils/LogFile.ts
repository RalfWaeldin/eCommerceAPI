import type { ErrorRequestHandler, Response } from "express";
import fs from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { LOGLEVEL, LOGFILEDIR } from "#config";

export async function writeLogFileEntry(
  err: Error | string,
  res: Response,
  logType: number,
  location: string = "",
) {
  const configLogLevel = LOGLEVEL;
  let loglinelabel: string = "[Info] ";

  if (logType > configLogLevel) {
    return;
  }

  const isodate: string = new Date().toISOString();

  const logfilename = isodate.split("T")[0] + ".log";
  const logline: string = createLogLine(err, res, logType, isodate, location);

  const logDirectory = LOGFILEDIR;
  mkdir(logDirectory, { recursive: true });

  fs.appendFile(join(logDirectory, logfilename), logline + "\n", (err) => {
    if (err) {
      console.error(err);
    } else {
      // done!
    }
  });
}

function createLogLine(
  content: Error | string,
  res: Response,
  logType: number,
  isodate: string,
  location: string,
): string {
  let loglinelabel: string = "[Info] ";

  switch (logType) {
    case 1:
      loglinelabel = "[Error]";
      break;
    case 2:
      loglinelabel = "[Info] ";
      break;
  }

  const contentType: string = typeof content;

  const loglinemessage =
    contentType == "string" ? content : (content as Error).message; //(content instanceOf Error)? content.message: content;
  const loglinelocation =
    contentType == "string"
      ? location
      : content
        ? (content as Error).stack.split("\n")[1].split("at ")[1]
        : "no location";

  const orgurl = res.req.originalUrl;
  const loglinecause = `[${res.statusCode}]`;
  const errorstack = (content as Error).stack;
  const reqmethod = `[${res.req.method}]`.padEnd(9, " ");
  return `${loglinelabel} ${loglinecause} [${isodate}] ${reqmethod}  | ${loglinemessage} | ${loglinelocation} | ${orgurl}`;
}
