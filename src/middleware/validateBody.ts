import type { RequestHandler } from "express";
import type { ZodError, ZodObject } from "zod/v4";
import { z } from "zod/v4";
import { writeLogFileEntry } from "#utils";

const validateBody =
  (zodSchema: ZodObject): RequestHandler =>
  (req, _res, next) => {
    writeLogFileEntry(
      `Enter validateBody`,
      _res,
      3,
      "middleware: validateBody",
    );

    console.log(req.body);
    const { data, error, success } = zodSchema.safeParse(req.body);

    if (!success) {
      const joinedmessge = error.issues
        .map((item) => `${item.path}: ${item.message}`)
        .join(" ++ ");

      next(
        //new Error(z.prettifyError(error), {
        new Error(joinedmessge, {
          cause: {
            status: 400,
          },
        }),
      );
    } else {
      writeLogFileEntry(`Body validated`, _res, 2, "middleware: validateBody");
      req.body = data;
      next();
    }
  };

export default validateBody;
