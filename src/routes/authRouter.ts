import { Router } from "express";
import { loginSchema, registerSchema } from "#schemas";
import { validateBody, isAuthenticated } from "#middleware";
import { login, logout, me, register } from "#controllers";

const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.delete("/logout", isAuthenticated, logout);
authRouter.get("/me", isAuthenticated, me);

export default authRouter;
