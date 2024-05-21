import db from "../../database/db.js";

export const getDetailPosts = (req, res) => {
  const idPosts = req?.params?.id;
  const q =
    "SELECT  p.id,`title`,`date`,`des`,`img`,`cat`,`username`,`avatar`,`email` FROM posts p JOIN user u ON p.uid = u.id WHERE p.id=?";
  db.query(q, [idPosts], (err, data) => {
    if (err) return res.status(409).json(err);

    return res.status(200).json(data);
  });
};

export const searchPosts = (req, res) => {
  const { name } = req.query;
  const q = `SELECT * FROM posts WHERE title LIKE '%${name.trim()}%' OR cat LIKE '%${name.trim()}%'`;
  db.query(q, (err, data) => {
    if (err) return res.status(409).json(err);
    // console.log("data", data);
    if (data) res.status(200).json(data);
  });
};

export const getPostsSimilar = (req, res) => {
  const idPosts = req?.params?.id;

  const q = "SELECT * FROM posts where id=?";

  db.query(q, [idPosts], (err, data) => {
    if (err) return res.status(409).json(err);
    const cat = data[0]?.cat;

    const q = "SELECT * FROM posts WHERE cat=?";

    db.query(q, [cat], (err, data) => {
      if (err) return res.status(409).json(err);
      const newData = data.filter((item) => {
        return item?.id != req?.params?.id;
      });
      return res.status(200).json(newData);
    });
  });
};

export const addPosts = (req, res) => {
  const q =
    "INSERT INTO posts (`title`,`des`,`date`,`img`, `cat`,`uid`) VALUES(?)";
  const { title, des, date, img, cat } = req.body ?? {};
  const uid = req?.userId;
  const value = [title, des, date, img, cat, uid];
  db.query(q, [value], (err, data) => {
    if (err)
      return res
        .status("409")
        .json({ err: err, message: "Thêm không thành công" });
    return res.status(200).json("add post successfully");
  });
};

export const deletePosts = (req, res) => {
  const q = "DELETE from posts WHERE id=? AND `uid`=?";
  const id = req.params?.id;
  const userId = req?.userId ?? null;
  db.query(q, [id, userId], (err, data) => {
    if (err)
      return res
        .status(409)
        .json({ err: err, message: "Xoá không thành công" });
    return res.status(200).json("delete post successfully");
  });
};

export const updatePosts = (req, res) => {
  const q =
    "UPDATE posts SET `title`= ?,`des`= ?,`date`= ?,`img`= ?,`cat`=? WHERE `id`=? AND `uid`=?";
  const { id } = req.params;
  const { title, des, img, cat } = req.body ?? {};
  const userId = req.userId ?? null;
  const date = null;
  const values = [title, des, date, img, cat, id, userId];

  db.query(q, [...values], (err, data) => {
    if (err)
      return res
        .status(409)
        .json({ err: err, message: "Cập nhật không thành công" });
    return res.status(200).json("Update post successfully");
  });
};
