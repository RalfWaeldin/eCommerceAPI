import { Router } from "express";
import {
  allProducts,
  productsByCategoryName,
  addProduct,
  productById,
} from "#controllers";
import { isAuhorizedAsAdmin, validateObjectId } from "#middleware";

const productRouter = Router();

productRouter.get("/", allProducts);
productRouter.get("/:id", validateObjectId, productById);
productRouter.get("/byCategory", productsByCategoryName);
productRouter.post("/", isAuhorizedAsAdmin, addProduct);

export default productRouter;
