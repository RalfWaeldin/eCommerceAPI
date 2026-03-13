import { Router } from "express";
import {
  storageProducts,
  productsByCategoryName,
  addProduct,
  productById,
  shopProducts,
} from "#controllers";
import { isAuhorizedAsAdmin, validateObjectId } from "#middleware";

const productRouter = Router();

productRouter.get("/availableproducts", shopProducts);
productRouter.get("/", isAuhorizedAsAdmin, storageProducts);
productRouter.get("/:id", isAuhorizedAsAdmin, validateObjectId, productById);
productRouter.get("/byCategory", isAuhorizedAsAdmin, productsByCategoryName);
productRouter.post("/", isAuhorizedAsAdmin, addProduct);

export default productRouter;
