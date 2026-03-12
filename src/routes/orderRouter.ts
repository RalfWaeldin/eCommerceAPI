import { Router } from "express";
import { allOrders, addOrder } from "#controllers";
import { isAuhorizedAsAdmin, isAuhorizedAsUser } from "#middleware";

const orderRouter = Router();

orderRouter.get("/", isAuhorizedAsAdmin, allOrders);
orderRouter.post("/", isAuhorizedAsUser, addOrder);

export default orderRouter;
