import { z } from "zod/v4";

const orderitem = z.strictObject({
  product_id: z.string(),
  ordered: z.int(),
});

export const orderCreateSchema = z.strictObject({
  user_id: z.string(),
  orders: z.array(orderitem),
});
