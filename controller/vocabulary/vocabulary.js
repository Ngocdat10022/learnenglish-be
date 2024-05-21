import db from "../../database/db.js";
import { v4 as uuidv4 } from "uuid";

export const getAllVocabulary = async (req, res) => {
  const q =
    "SELECT v.vocaIdPK, v.lessonId, v.word, v.meaning, v.spelling, v.example, l.title FROM vocabularies v INNER JOIN lessons l ON v.lessonId = l.lessonIdPK ";
  db.query(q, [], (err, data) => {
    if (err)
      res.status(409).json({ err: err, message: "get vocabularies failed" });
    if (data) return res.status(200).json(data);
  });
};
export const addNewVocabulary = async (req, res) => {
  const vocaId = uuidv4();
  const { lessonId, word, meaning, spelling } = req?.body ?? {};
  const q = "SELECT * from vocabularies WHERE word=?";
  db.query(q, [word], (err, data) => {
    if (err) res.status(409).json({ err: err, message: "Word already exits" });
    if (data.length)
      return res.status(409).json({ err: err, message: "Word already exits" });
    if (data?.length === 0) {
      const q =
        "INSERT INTO vocabularies(`vocaIdPK`,`lessonId`,`word`,`meaning`,`spelling`) VALUES(?)";
      const values = [vocaId, lessonId, word, meaning, spelling];
      db.query(q, [values], (err, data) => {
        if (err) res.status(409).json({ err: err, message: "Add word failed" });
        if (data) return res.status(200).json("Add new word successfully");
      });
    }
  });
};
export const updateVocabulary = async (req, res) => {
  const q = "SELECT * from vocabularies";
  const queryLesson = "SELECT* from lessons WHERE title=?";
  const { lessonId, word, meaning, spelling } = req?.body ?? {};
  const { id } = req?.params ?? {};
  console.log("id", id);
  db.query(queryLesson, [lessonId], (err, data) => {
    if (err)
      return res.status(409).json({ err: err, message: "Lesson not found" });
    if (data) {
      const lessonIdNew = data[0].lessonIdPK;
      db.query(q, [], (err, data) => {
        if (err) return res.status(409).json(err);
        const newData = data
          .filter((item) => item?.vocaIdPK != id)
          .filter((item) => item?.word?.trim() === word?.trim());
        if (newData.length) {
          return res
            .status(409)
            .json({ err: err, message: "vocabularie already exits" });
        }
        if (newData.length === 0) {
          const q =
            "UPDATE vocabularies SET `lessonId` = ?, `word` = ?,`meaning`=?,`spelling` = ? WHERE `vocaIdPK`= ?";
          const values = [lessonIdNew, word, meaning, spelling, id];
          db.query(q, [...values], (err, data) => {
            if (err)
              return res
                .status(409)
                .json({ err: err, message: "Update vocabularies failed" });
            if (data)
              return res.status(200).json("Update vocabularies successfully");
          });
        }
      });
    }
  });
};
export const deleteVocabulary = async (req, res) => {
  const q = "DELETE from vocabularies WHERE vocaIdPK=?";
  const { id } = req?.params ?? {};
  db.query(q, [id], (err, data) => {
    if (err) {
      return res
        .status(409)
        .json({ err: err, message: "Delete vocabularies failed" });
    }
    return res.status(200).json("Delete vocabularies successfully");
  });
};
