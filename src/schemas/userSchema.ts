import { z } from "zod/v4";

const emailSchema = z.email({ error: "Please provide a valid email address" });

const passwordSchema = z
  .string({ error: "Password must be a string" })
  .min(10, { error: "Password must be at least 10 characters long" })
  .max(50, { error: "The length of this Password is excessive." })
  .regex(/[a-z]/, {
    error: "Password must include at least one lowercase letter.",
  })
  .regex(/[A-Z]/, {
    error: "Password must include at least one uppercase letter.",
  })
  .regex(/[0-9]/, { error: "Password must include at least one number." })
  .regex(/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>/?`~]/, {
    error: "Password must include at least one special character",
  });

export const userUpdateSchema = z.strictObject({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
});

export const userRoleUpdateSchema = z.strictObject({
  roles: z.array(z.string()).min(1).max(3),
});
