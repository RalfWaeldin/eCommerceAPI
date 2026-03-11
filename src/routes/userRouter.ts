import { Router } from "express";
import { rolesSchema } from "#schemas";
import { validateBody, isAuthenticated, isAuhorizedAsRoot } from "#middleware";
import { roleOrderedList, toggleActiveStatus } from "#controllers";

const userRouter = Router();

userRouter.get(
  "/list",
  isAuthenticated,
  isAuhorizedAsRoot,
  validateBody(rolesSchema),
  roleOrderedList,
);
userRouter.patch(
  "/toggleStatus/:id",
  isAuthenticated,
  isAuhorizedAsRoot,
  toggleActiveStatus,
);

export default userRouter;
