import { Router } from "express";
import {
  loginAdmin,
  registerAdmin,
  verifyEmailAdmin,
} from "../../controller/authAdmin/authAdmin.js";

const router = Router();

// create application/x-www-form-urlencoded parser
router.post("/registerAdmin", registerAdmin);
router.post("/loginAdmin", loginAdmin);
router.get("/verifyAdmin", verifyEmailAdmin);

export default router;
