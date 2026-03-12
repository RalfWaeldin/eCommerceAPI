import { z } from "zod/v4";

export const categoryCreateSchema = z.strictObject({
  categoryname: z.string().min(8).max(12),
});
