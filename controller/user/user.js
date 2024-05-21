import db from "../../database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const getAllUsers = (req, res) => {
  const cat = req?.query?.cat;
  const q = cat ? "SELECT * FROM users" : "SELECT * FROM users";
  db.query(q, [cat], (err, data) => {
    if (err) return res.status(409).json(err);
    const newData = data?.filter((item) => item?.role === "client");
    return res.status(200).json(newData);
  });
};
export const getDetailUser = async (req, res) => {
  const idUser = req?.params?.id;
  if (idUser) {
    const q =
      "SELECT u.userIdPK, u.adminId, u.userName, u.email, u.password AS userPassword, u.avatar, a.userName AS userNameAdmin, a.email AS emailAdmin FROM users u JOIN admin a ON u.adminId = a.adminIdPK WHERE u.userIdPK = ?";
    db.query(q, [idUser], (err, data) => {
      if (err) return res.status(409).json(err);
      return res.status(200).json(...data);
    });
  }
};

export const addNewUser = async (req, res) => {
  const q = "SELECT * from users WHERE email=? OR userName=?";
  const { username, email, avatar, password, role } = req?.body ?? {};
  const adminId = req?.adminId;
  const avt = avatar ?? "";
  const idUser = uuidv4();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  db.query(q, [email, username], async (err, data) => {
    if (err) return res.status(409).json(err);
    if (data.length)
      return res.status(409).json({ message: "user or email already exits" });
    if (data?.length === 0) {
      const q =
        "INSERT INTO users(`userIdPK`,`adminId`,`userName`,`email`,`password`,`avatar`,`role`) VALUES(?)";
      const values = [
        idUser,
        adminId,
        username,
        email,
        hashedPassword,
        avatar,
        "client",
      ];
      db.query(q, [values], (err, data) => {
        if (err) {
          return res
            .status(409)
            .json({ err: err, message: "Add new user failed" });
        } else {
          return res.status(200).json("add new user successfully");
        }
      });
    }
  });
};

export const updateUser = (req, res) => {
  const q = "SELECT * from users";
  const { username, email, avatar, userId } = req?.body ?? {};
  const adminId = req?.adminId;
  db.query(q, [], (err, data) => {
    if (err) return res.status(409).json(err);
    const newData = data
      .filter((item) => item?.userIdPK != userId)
      .filter(
        (item) =>
          item?.userName?.trim() === username?.trim() ||
          item?.email?.trim() === email?.trim()
      );

    if (newData.length) {
      return res
        .status(409)
        .json({ err: err, message: "username or email already exits" });
    }
    if (newData.length === 0) {
      const q =
        "UPDATE users SET `adminId` = ?,`userName` = ?, `email` = ?, `avatar` = ? WHERE `userIdPK`= ?";
      const values = [adminId, username.trim(), email.trim(), avatar, userId];
      db.query(q, [...values], (err, data) => {
        if (err)
          return res.status(409).json({ err: err, message: "Update failed" });
        if (data) return res.status(200).json("Update successfully");
      });
    }
  });
};

export const deleteUser = (req, res) => {
  const q = "DELETE from users WHERE userIdPK=?";
  const { id } = req?.params ?? {};
  console.log("userId", id);
  db.query(q, [id], (err, data) => {
    if (err) {
      return res.status(409).json({ err: err, message: "Delete failed" });
    }
    return res.status(200).json("delete post successfully");
  });
};

export const updatePassword = (req, res) => {
  const q = "SELECT * FROM user WHERE id=?";
  const id = req?.userId ?? null;
  db.query(q, [id], async (err, data) => {
    if (err) return res.status(409).json(err);
    const { password, newPassword } = req?.body ?? {};
    const isPassword = bcrypt.compareSync(
      password.trim(),
      data[0].password.trim()
    );
    if (!isPassword)
      res.status(409).json({ err, message: "password is not correct" });
    if (isPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const values = [hashedPassword, req?.userId];
      const q = "UPDATE user SET `password`= ? WHERE `id`=? ";
      db.query(q, [...values], (err, data) => {
        if (err)
          return res
            .status(409)
            .json({ err: err, message: "Cập nhật không thành công" });
        return res.status(200).json("Update password successfully");
      });
    }
  });
};
