import { User } from "#models";
import type { registerSchema } from "#schemas";
import type { RequestHandler, Response } from "express";
import { object, z } from "zod/v4";
import { writeLogFileEntry, hashPassword } from "#utils";

type UserDTO = z.infer<typeof registerSchema>;

function setAuthCookies(res: Response, accessToken: string) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

export const roleOrderedList: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter roleOrderedList`,
    res,
    3,
    "authController: roleOrderedList",
  );
  const { accessToken } = req.cookies;

  if (!accessToken)
    throw new Error("Access token is required", { cause: { status: 401 } });
  writeLogFileEntry(`Token found`, res, 2, "authController: roleOrderedList");

  const { roles } = req.body;
  writeLogFileEntry(
    `Requested roles ${roles}`,
    res,
    2,
    "authController: roleOrderedList",
  );

  const allusers = await User.find();

  // Loop through roles

  const output = await roles.map((item: string) => {
    writeLogFileEntry(
      `Loop "${item}"`,
      res,
      3,
      "authController: roleOrderedList",
    );

    const currentrole: string = item;
    const itemobjects = allusers.filter((item) =>
      item.roles.includes(currentrole),
    );

    writeLogFileEntry(
      `Users with role "${currentrole}": ${JSON.stringify(itemobjects)}`,
      res,
      3,
      "authController: roleOrderedList",
    );
    const itemoutput = { role: currentrole, users: itemobjects };

    return itemoutput;
  });

  //const rootusers = allusers.filter((item) => item.roles.includes("root"));

  res.json(output);
  next();
};

export const toggleActiveStatus: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter toggleActiveStatus`,
    res,
    3,
    "authController: toggleActiveStatus",
  );

  const { id } = req.params;

  const user = await User.findById({ _id: id });
  if (!user)
    throw new Error(`User (${id} not found)`, { cause: { status: 404 } });

  const toggleActive = !user?.active;

  const updateduser = await User.updateOne(
    { _id: id },
    { active: toggleActive },
  );

  writeLogFileEntry(
    `User Status for user (${id}) changed to '${toggleActive}'`,
    res,
    2,
    "authController: toggleActiveStatus",
  );
  res.json({ message: `User (${id}) active state: ${toggleActive} ` });
  next;
};

export const updateUserDetails: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter updateUserDetails`,
    res,
    3,
    "authController: updateUserDetails",
  );

  const {
    body,
    params: { id },
  } = req;

  //const { firstName, lastName, email, password } = req.body;

  const user = await User.findById({ _id: id });
  if (!user)
    throw new Error(`User (${id} not found)`, { cause: { status: 404 } });

  const updateduser = await User.updateOne({ _id: id }, body);
  if (!updateduser)
    throw new Error(`Update User details (${id}) has failed`, {
      cause: { status: 400 },
    });
  writeLogFileEntry(
    `User Details for user (${id}) successfully updated'`,
    res,
    2,
    "authController: updateUserDetails",
  );
  res.json({ message: `User (${id}) updated` });
  next;
};

export const updateUserRoles: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter updateUserRoles`,
    res,
    3,
    "authController: updateUserRoles",
  );

  const {
    body,
    params: { id },
  } = req;

  const user = await User.findById({ _id: id });
  if (!user)
    throw new Error(`User (${id} not found)`, { cause: { status: 404 } });

  const updateduser = await User.updateOne({ _id: id }, body);
  if (!updateduser)
    throw new Error(`Update Roles details (${id}) has failed`, {
      cause: { status: 400 },
    });
  writeLogFileEntry(
    `User Roles for user (${id}) successfully updated'`,
    res,
    2,
    "authController: updateUserDetails",
  );
  res.json({ message: `User (${id}) updated` });
  next;
};
