import { type Request, type Response, type NextFunction } from "express";
import { User } from "#models";
import { writeLogFileEntry } from "#utils";

const validateUniqueUserEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  writeLogFileEntry(
    `Enter validateUniqueUserEmail`,
    res,
    3,
    "validation: validateUniqueUserEmail",
  );
  const { body } = req;

  const { email } = body;

  if (email) {
    const user = await User.findOne({ email: email });
    if (user) {
      writeLogFileEntry(
        `User with Email (${email}) is found`,
        res,
        3,
        "validation: validateUniqueUserEmail",
      );
      throw new Error(`Email (${email}) already assigned to a user`, {
        cause: 404,
      });
    } else {
      writeLogFileEntry(
        `No user with Email (${email}) is found`,
        res,
        3,
        "validation: validateUniqueUserEmail",
      );
    }
  }

  writeLogFileEntry(
    `Email (${email}) is not assigned to a user`,
    res,
    2,
    "validation: validateUniqueUserEmail",
  );
  next();
};

export default validateUniqueUserEmail;
