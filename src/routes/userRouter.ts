import { Router } from "express";
import { rolesSchema, userUpdateSchema, userRoleUpdateSchema } from "#schemas";
import {
  validateBody,
  validateObjectId,
  validateUniqueUserEmail,
  isAuthenticated,
  isAuhorizedAsRoot,
  isAuhorizedAsAdmin,
} from "#middleware";
import {
  roleOrderedList,
  toggleActiveStatus,
  updateUserDetails,
  updateUserRoles,
  userById,
} from "#controllers";

const userRouter = Router();

userRouter.get(
  "/list",
  isAuthenticated,
  isAuhorizedAsRoot,
  validateBody(rolesSchema),
  roleOrderedList,
);

userRouter.get(
  "/:id",
  isAuthenticated,
  isAuhorizedAsRoot,
  validateObjectId,
  userById,
);

userRouter.patch(
  "/toggleStatus/:id",
  isAuthenticated,
  isAuhorizedAsRoot,
  validateObjectId,
  toggleActiveStatus,
);

userRouter.patch(
  "/userDetails/:id",
  isAuthenticated,
  isAuhorizedAsAdmin,
  validateObjectId,
  validateBody(userUpdateSchema),
  validateUniqueUserEmail,
  updateUserDetails,
);

userRouter.patch(
  "/userRoles/:id",
  isAuthenticated,
  isAuhorizedAsRoot,
  validateObjectId,
  validateBody(userRoleUpdateSchema),
  validateUniqueUserEmail,
  updateUserRoles,
);

export default userRouter;
