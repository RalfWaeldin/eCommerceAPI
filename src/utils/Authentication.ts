import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET, SALT_ROUNDS } from "#config";
import { Types } from "mongoose";

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}

export function createAccessToken(payload: {
  id: Types.ObjectId;
  roles: string[];
  active: boolean;
}) {
  return jwt.sign(
    { sub: payload.id, roles: payload.roles, active: payload.active },
    ACCESS_JWT_SECRET,
    {
      expiresIn: "15min",
    },
  );
}
