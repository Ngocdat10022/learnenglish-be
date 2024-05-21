import db from "../../database/db.js";
import { v4 as uuidv4 } from "uuid";

export const getAllLesson = async (req, res) => {
  const q =
    "SELECT l.lessonIdPK, l.catId,l.lessonPro, l.title, l.content, l.DifficultyLevel, c.catName FROM lessons l INNER JOIN category c ON l.catId = c.catIdPK;";
  db.query(q, [], (err, data) => {
    if (err) res.status(409).json({ err: err, message: "get category failed" });
    const newArray = data?.map((item) => ({
      ...item,
      lessonPro: item.lessonPro === 0 ? false : true,
    }));

    if (newArray) return res.status(200).json(newArray);
  });
};
export const addNewLesson = async (req, res) => {
  const lesonId = uuidv4();
  const { title, catId, level, lessonPro } = req?.body ?? {};
  const q = "SELECT * from lessons WHERE title=?";
  db.query(q, [title], (err, data) => {
    if (err)
      res.status(409).json({ err: err, message: "Lessons already exits" });
    if (data.length)
      return res
        .status(409)
        .json({ err: err, message: "Lessons already exits" });

    if (data?.length === 0) {
      const q =
        "INSERT INTO lessons(`lessonIdPK`,`catId`,`lessonPro`,`title`,`DifficultyLevel`) VALUES(?)";
      const values = [lesonId, catId, lessonPro, title, level];
      db.query(q, [values], (err, data) => {
        if (err)
          res.status(409).json({ err: err, message: "Add Lessons failed" });
        if (data) return res.status(200).json("Add new Lesson successfully");
      });
    }
  });
};
export const updateLesson = async (req, res) => {
  const q = "SELECT * from lessons";
  const { title, level, catName, lessonPro } = req?.body ?? {};
  const { id } = req?.params ?? {};
  const qCat = "SELECT * from category WHERE catName=?";
  db.query(qCat, [catName], (err, data) => {
    if (err)
      return res.status(409).json({ err: err, message: "Category not found" });
    if (data) {
      const catId = data[0]?.catIdPK;
      db.query(q, [], (err, data) => {
        if (err) return res.status(409).json(err);
        const newData = data
          .filter((item) => item?.lessonIdPK != id)
          .filter((item) => item?.title?.trim() === title?.trim());
        if (newData.length) {
          return res
            .status(409)
            .json({ err: err, message: "Lessons already exits" });
        }
        if (newData.length === 0) {
          const lessonProName = lessonPro === "Free" ? 0 : 1;
          const q =
            "UPDATE lessons SET `catId` = ?,`lessonPro` = ?,  `title` = ?,`DifficultyLevel` = ? WHERE `lessonIdPK`= ?";
          const values = [catId, lessonProName, title, level, id];
          db.query(q, [...values], (err, data) => {
            if (err)
              return res
                .status(409)
                .json({ err: err, message: "Update Lessons failed" });
            if (data)
              return res.status(200).json("Update Lessons successfully");
          });
        }
      });
    }
  });
};
export const deleteLesson = async (req, res) => {
  const q = "DELETE from lessons WHERE lessonIdPK=?";
  const { id } = req?.params ?? {};
  db.query(q, [id], (err, data) => {
    if (err) {
      return res
        .status(409)
        .json({ err: err, message: "Delete Lessons failed" });
    }
    return res.status(200).json("Delete Lessons successfully");
  });
};
