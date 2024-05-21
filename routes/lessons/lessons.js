import { Router } from "express";
import {
  addNewLesson,
  deleteLesson,
  getAllLesson,
  updateLesson,
} from "../../controller/lesson/lesson.js";

const router = Router();

router.get("/getlessons/", getAllLesson);
router.post("/addlessons/", addNewLesson);
router.put("/updatelessons/:id", updateLesson);
router.delete("/deleteLessons/:id", deleteLesson);

export default router;
