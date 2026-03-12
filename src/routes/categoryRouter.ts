import { Router } from "express";
import { allCategories, addCategory } from "#controllers";
import { isAuhorizedAsAdmin } from "#middleware";

const categoryRouter = Router();

categoryRouter.get("/", allCategories);
categoryRouter.post("/", isAuhorizedAsAdmin, addCategory);

export default categoryRouter;
