import { type ErrorRequestHandler } from "express";
import { writeLogFileEntry } from "#utils";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  process.env.NODE_ENV !== "development" &&
    console.error(`\x1b[31m${err.stack}\x1b[0m`);

  const errormessages = err.message.split(" ++ ");
  const status = err.cause ? err.cause.status : 500;

  writeLogFileEntry(err, res, 1);
  res.status(status || 500).json({ message: errormessages });
  next();
};

export default errorHandler;
