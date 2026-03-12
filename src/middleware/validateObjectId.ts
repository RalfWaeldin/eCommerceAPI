import { type Request, type Response, type NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { writeLogFileEntry } from "#utils";

const validateObjectId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  writeLogFileEntry(
    `Enter validateObjectId`,
    res,
    3,
    "middleware: validateObjectId",
  );

  const {
    params: { id },
  } = req;

  if (!isValidObjectId(id))
    throw new Error(`Id (${id}) is not a valid ObjectId`, { cause: 400 });
  writeLogFileEntry(
    `Object Id ${id} passed Validation Check`,
    res,
    2,
    "validation: objectIdCheck",
  );
  next();
};

export default validateObjectId;
