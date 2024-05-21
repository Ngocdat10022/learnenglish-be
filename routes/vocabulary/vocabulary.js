import { Router } from "express";
import {
  addNewVocabulary,
  deleteVocabulary,
  getAllVocabulary,
  updateVocabulary,
} from "../../controller/vocabulary/vocabulary.js";

const router = Router();

router.get("/getvocabulary/", getAllVocabulary);
router.post("/addvocabulary/", addNewVocabulary);
router.put("/updatevocabulary/:id", updateVocabulary);
router.delete("/deletevocabulary/:id", deleteVocabulary);

export default router;
