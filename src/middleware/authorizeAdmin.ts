import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "#config";
import { writeLogFileEntry } from "#utils";

const authorizeAdmin: RequestHandler = (req, res, next) => {
  writeLogFileEntry(
    `Enter authorizeAdmin`,
    res,
    3,
    "middleware: authorizeAdmin",
  );
  const { accessToken } = req.cookies;
  if (!accessToken)
    throw new Error("Not authenticated", { cause: { status: 401 } });

  try {
    writeLogFileEntry(
      `analyze Access Token`,
      res,
      2,
      "middleware: authorizeAdmin",
    );
    const decoded = jwt.verify(
      accessToken,
      ACCESS_JWT_SECRET,
    ) as jwt.JwtPayload;
    if (!decoded.sub) throw new Error();

    writeLogFileEntry(
      `Access Token decoded`,
      res,
      3,
      "middleware: authorizeAdmin",
    );
    const user = {
      id: decoded.sub,
      roles: decoded.roles,
      active: decoded.active,
    } as { id: string; roles: string[]; active: boolean };

    writeLogFileEntry(
      `User data from Token id:${user.id}, roles:${user.roles}, active:${user.active}`,
      res,
      3,
      "middleware: authorizeAdmin",
    );

    if (!user.active)
      throw (new Error(`User is deactivated`), { cause: { status: 400 } });
    writeLogFileEntry(
      `User ${user.id} is active`,
      res,
      3,
      "middleware: authorizeAdmin",
    );

    if (!user.roles.includes("admin"))
      throw new Error(`No sufficient role! "admin" required`, {
        cause: { status: 401 },
      });
    req.user = user;
    writeLogFileEntry(
      `Authorized with roles ${user.roles}`,
      res,
      2,
      "middleware: authorizeAdmin",
    );
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new Error("Expired access token", {
          cause: { status: 401, code: "ACCESS_TOKEN_EXPIRED" },
        }),
      );
    }
    return next(
      new Error(`Authorization Error: Role Admin required' `, {
        cause: { status: 401 },
      }),
    );
  }
};

export default authorizeAdmin;
