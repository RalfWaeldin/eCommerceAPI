//import { registerSchema, loginSchema, rolesSchema, userSchema, postSchema, signInSchema } from "#schemas";
import {
  rolesSchema,
  loginSchema,
  registerSchema,
  rootAuthorizeSchema,
  orderCreateSchema,
  productCreateSchema,
} from "#schemas";
import { z } from "zod/v4";

declare global {
  type RolesBody = z.infer<typeof rolesSchema>;
  type LoginRequestBody = z.infer<typeof loginSchema>;
  type RegisterRequestBody = z.infer<typeof registerSchema>;
  type RoleRequestBody = z.infer<typeof rootAuthorizeSchema>;
  type OrderRequestBody = z.infer<typeof orderCreateSchema>;
  type ProductCreateBody = z.infer<typeof productCreateSchema>;

  type SanitizedBody =
    | LoginRequestBody
    | RolesBody
    | RegisterRequestBody
    | RoleRequestBody
    | OrderRequestBody
    | ProductCreateBody;
}

export {};
