//import { registerSchema, loginSchema, rolesSchema, userSchema, postSchema, signInSchema } from "#schemas";
import {
  rolesSchema,
  loginSchema,
  registerSchema,
  rootAuthorizeSchema,
} from "#schemas";
import { z } from "zod/v4";

declare global {
  type RolesBody = z.infer<typeof rolesSchema>;
  type LoginRequestBody = z.infer<typeof loginSchema>;
  type RegisterRequestBody = z.infer<typeof registerSchema>;
  type RoleRequestBody = z.infer<typeof rootAuthorizeSchema>;

  type SanitizedBody =
    | LoginRequestBody
    | RolesBody
    | RegisterRequestBody
    | RoleRequestBody;
}

export {};
