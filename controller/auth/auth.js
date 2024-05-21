import jwt from "jsonwebtoken";
import db from "../../database/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { mailer } from "../../utils/mailer.js";
import { config } from "../../config/index.js";

export const register = (req, res) => {
  const q = "SELECT * from users WHERE email=? ";
  const username = req.body?.username;
  const email = req.body?.email;
  const password = req.body?.password;
  const role = req.body?.role;

  db.query(q, [email, username], async (err, data) => {
    if (err) return res.status(409).json(err);
    if (data.length) return res.status(200).json("user or email already exits");

    if (data.length === 0) {
      bcrypt.hash(email, parseInt(10)).then((hashEmail) => {
        console.log(
          `http://localhost:${config?.PORT}/api/auth/verify?email=${email}&password=${password}&role=${role}&token=${hashEmail}`
        );
        mailer(
          email,
          "Vui lòng Xác thực đăng ký",
          `<a href="http://localhost:${config?.PORT}/api/auth/verify?email=${email}&password=${password}&role=${role}&token=${hashEmail}">Vui lòng xác nhận email</a>`
        );
      });
      return res.status(200).json("Please verify your email");
    }
    return res.status(200).json("Please verify your email");
  });
};

export const login = (req, res) => {
  const q = "SELECT * from users WHERE email=?";
  const email = req.body?.email;
  console.log("email", email.trim());

  db.query(q, [email], (err, data) => {
    if (err) return res.status(409).json(err);
    console.log("data", data);
    if (data.length === 0)
      return res.status(401).json({ err: err, message: "email not found" });

    const isPassword = bcrypt.compareSync(req.body?.password, data[0].password);

    if (!isPassword)
      return res.status(401).json({ err: err, message: "Wrong Password" });

    const token = jwt.sign(
      { id: data[0].id, username: data[0].username },
      "jwtkey"
    );
    const { password, ...orther } = data[0];
    return res.status(200).json({
      findUser: { ...orther },
      accessToken: token,
    });
  });
};

export const verifyEmail = async (req, res) => {
  const email = req.query?.email;
  const password = req.query?.password;
  const role = req.query?.role;
  bcrypt.compare(req.query?.email, req.query?.token, async (err, result) => {
    if (result === true) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const idUser = uuidv4();
      const q =
        "INSERT INTO users(`userIdPK`,`fullName`,`email`,`password`,`role`) VALUES(?)";
      const value = [idUser, "fullName", email.trim(), hashedPassword, role];
      db.query(q, [value], (err, data) => {
        if (err) {
          return res.status(409).json(err);
        } else {
          // res?.redirect("http://localhost:4000/login");
          return res.status(200).json("register successfully");
        }
      });
    }
  });
};
