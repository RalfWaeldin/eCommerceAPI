import { User } from "#models";
import type { registerSchema } from "#schemas";
import { createAccessToken, hashPassword } from "#utils";
import type { RequestHandler, Response } from "express";
import { object, z } from "zod/v4";
import bcrypt from "bcrypt";
import { ACCESS_JWT_SECRET } from "#config";
import jwt from "jsonwebtoken";
import { writeLogFileEntry } from "#utils";

type UserDTO = z.infer<typeof registerSchema>;

function setAuthCookies(res: Response, accessToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

export const register: RequestHandler = async (req, res) => {
  writeLogFileEntry(`Enter register`, res, 3, "authController: register");
  const { firstName, lastName, email, password } = req.body;

  const userExists = await User.exists({ email });
  if (userExists) throw new Error("Email already exists", { cause: 400 });

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    roles: ["user"],
    active: true,
  } satisfies Omit<UserDTO, "confirmPassword">);

  const accessToken = createAccessToken({
    id: newUser._id,
    roles: newUser.roles,
    active: newUser.active as boolean,
  });

  setAuthCookies(res, accessToken);

  writeLogFileEntry(`Registered`, res, 2, "authController: register");

  res.status(201).json({ message: "Registered" });
};

export const login: RequestHandler = async (req, res) => {
  writeLogFileEntry(`Enter login`, res, 3, "authController: login");
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("User not found", { cause: { status: 404 } });

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) throw new Error("Incorrect credentials");

  if (!user.active) throw new Error("User is deactivated");

  const accessToken = createAccessToken({
    id: user._id,
    roles: user.roles,
    active: user.active as boolean,
  });

  setAuthCookies(res, accessToken);

  writeLogFileEntry(`Logged in`, res, 2, "authController: login");
  res.status(200).json({ message: "Logged in" });
};

export const logout: RequestHandler = async (req, res) => {
  writeLogFileEntry(`Enter logout`, res, 3, "authController: logout");
  res.clearCookie("accessToken");
  writeLogFileEntry(`Successfully logout`, res, 2, "authController: logout");
  res.status(200).json({ message: "Successfully logged out" });
};

export const me: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(`Enter me`, res, 3, "authController: me");
  const { accessToken } = req.cookies;

  if (!accessToken)
    throw new Error("Access token is required", { cause: { status: 401 } });
  writeLogFileEntry(`Token found`, res, 3, "authController: me");
  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET);

    if (!decoded.sub)
      throw new Error("Invalid or expired access token", {
        cause: { status: 403 },
      });
    writeLogFileEntry(`Decoded`, res, 3, "authController: me");
    const user = await User.findById(decoded.sub);

    if (!user) throw new Error("User not found", { cause: { status: 404 } });
    writeLogFileEntry(`User found`, res, 2, "authController: me");
    res.status(200).json({ message: "Valid token", user });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new Error("Expired access token", {
          cause: { status: 401, code: "ACCESS_TOKEN_EXPIRED" },
        }),
      );
    }

    return next(new Error("Invalid access token", { cause: { status: 401 } }));
  }
};
