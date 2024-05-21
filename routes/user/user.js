import { Router } from "express";
import {
  addNewUser,
  deleteUser,
  getAllUsers,
  getDetailUser,
  updatePassword,
  updateUser,
} from "../../controller/user/user.js";
import { verifyToken } from "../../middleware/auth.js";
import { verifyTokenAdmin } from "../../middleware/admin/verifyTokenAdmin.js";

const router = Router();

router.put("/update/", verifyTokenAdmin, updateUser);
router.put("/updatepassword/", verifyToken, updatePassword);
router.get("/getallusers/", getAllUsers);
router.post("/adduser", verifyTokenAdmin, addNewUser);
router.get("/getdetailuser/:id", getDetailUser);
router.delete("/delete/:id", deleteUser);

export default router;
