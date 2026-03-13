import { Router } from "express";
import { allOrders, addOrder, myOrders } from "#controllers";
import { isAuhorizedAsAdmin, isAuhorizedAsUser } from "#middleware";

const orderRouter = Router();

orderRouter.get("/", isAuhorizedAsAdmin, allOrders);
orderRouter.get("/myorders", isAuhorizedAsUser, myOrders);
orderRouter.post("/", isAuhorizedAsUser, addOrder);

export default orderRouter;
