import db from "../../database/db.js";
import { v4 as uuidv4 } from "uuid";

export const getCategory = async (req, res) => {
  const q = "SELECT * from category";
  db.query(q, [], (err, data) => {
    if (err) res.status(409).json({ err: err, message: "get category failed" });
    if (data) return res.status(200).json(data);
  });
};
export const addNewCategory = async (req, res) => {
  const catId = uuidv4();
  const { catName } = req?.body ?? {};
  const q = "SELECT * from category WHERE catName=?";
  db.query(q, [catName], (err, data) => {
    if (err)
      res.status(409).json({ err: err, message: "category already exits" });
    if (data.length) {
      return res.status(409).json({ message: "category already exits" });
    } else {
      const q = "INSERT INTO category(`catIdPK`,`catName`) VALUES(?)";
      const values = [catId, catName];
      db.query(q, [values], (err, data) => {
        if (err)
          res.status(409).json({ err: err, message: "Add category failed" });
        if (data) return res.status(200).json("Add new category successfully");
      });
    }
  });
};
export const updateCategory = async (req, res) => {
  const q = "SELECT * from category";
  const { catName } = req?.body ?? {};
  const { id } = req?.params ?? {};
  db.query(q, [], (err, data) => {
    if (err) return res.status(409).json(err);
    const newData = data
      .filter((item) => item?.catIdPK != id)
      .filter((item) => item?.catName?.trim() === catName?.trim());
    if (newData.length) {
      return res
        .status(409)
        .json({ err: err, message: "Category name already exits" });
    }
    if (newData.length === 0) {
      const q = "UPDATE category SET `catName` = ? WHERE `catIdPK`= ?";
      const values = [catName, id];
      db.query(q, [...values], (err, data) => {
        if (err)
          return res
            .status(409)
            .json({ err: err, message: "Update category failed" });
        if (data) return res.status(200).json("Update category successfully");
      });
    }
  });
};
export const deleteCategory = async (req, res) => {
  const q = "DELETE from category WHERE catIdPK=?";
  const { id } = req?.params ?? {};
  console.log("id", id);
  db.query(q, [id], (err, data) => {
    if (err) {
      return res
        .status(409)
        .json({ err: err, message: "Delete category failed" });
    }
    return res.status(200).json("delete catrgory successfully");
  });
};
