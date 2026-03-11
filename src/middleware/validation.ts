import { type Request, type Response, type NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { writeLogFileEntry } from "#utils";
import { type UserType } from "#types";
import { User } from "#models";

/////////////////////////////////////////////////////////////////////////////////////////////
// GENERELL
/////////////////////////////////////////////////////////////////////////////////////////////
// generell validation of Object Id
//-------------------------------------------------------------------------------------------
export const validateObjectId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  writeLogFileEntry(
    `Enter validateObjectId`,
    res,
    3,
    "validation: validateObjectId",
  );
  const {
    params: { id },
  } = req;

  if (!isValidObjectId(id))
    throw new Error(`Id (${id}) is not a valid ObjectId`, { cause: 404 });
  writeLogFileEntry(
    `Object Id ${id} passed Validation Check`,
    res,
    2,
    "validation: validateObjectId",
  );
  next();
};

/////////////////////////////////////////////////////////////////////////////////////////////
// USER
/////////////////////////////////////////////////////////////////////////////////////////////
// users specific request body validation
//-------------------------------------------------------------------------------------------
export const validateUserRequestBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  writeLogFileEntry(
    `Enter validateUserRequestBody`,
    res,
    3,
    "validation: validateUserRequestBody",
  );
  const { body } = req;
  const { name, email } = body as UserType;
  writeLogFileEntry(
    `firstName: '${name}', lastName: '${email}', email: '${email}'`,
    res,
    2,
    "validation: validateUserRequestBody",
  );
  if (!name || !email)
    throw new Error("FirstName, lastName, and email are required", {
      cause: 400,
    });
  writeLogFileEntry(
    `FirstName, lastName, and email are available`,
    res,
    2,
    "validation: validateUserRequestBody",
  );
  next();
};

//-------------------------------------------------------------------------------------------
// users specific existence check of a user identified by its id
//-------------------------------------------------------------------------------------------
export const existsUserById = async (
  req: Request<{ id: string; addobject?: {} }>,
  res: Response,
  next: NextFunction,
) => {
  writeLogFileEntry(
    `Enter existsUserById`,
    res,
    3,
    "validation: existsUserById",
  );
  const {
    params: { id },
  } = req;
  const user = await User.findById(id);
  if (!user) throw new Error(`User (${id}) not found`, { cause: 404 });
  writeLogFileEntry(
    `User (${id}) found`,
    res,
    2,
    "validation: userByIdExistanceCheck",
  );
  writeLogFileEntry(
    `Add User (${id}) to request`,
    res,
    2,
    "validation: existsUserById",
  );

  req.params.addobject = user;

  next();
};
