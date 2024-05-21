import { Router } from "express";
import {
  addNewCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../../controller/category/category.js";

const router = Router();

router.get("/getallcategory/", getCategory);
router.post("/addcategory/", addNewCategory);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deletecategory/:id", deleteCategory);

export default router;
