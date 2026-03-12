import { z } from "zod/v4";

export const productCreateSchema = z.strictObject({
  materialno: z.string().min(8).max(12),
  materialname: z.string().min(8).max(50),
  description: z.string().min(20).max(255),
  price: z.float32(),
  count: z.int().min(0).default(0),
  category_id: z.string(),
});
