import { Router } from "express";
import { register, login, verifyEmail } from "../../controller/auth/auth.js";

const router = Router();

// create application/x-www-form-urlencoded parser
router.post("/register", register);
router.post("/login", login);
router.get("/verify", verifyEmail);

export default router;
