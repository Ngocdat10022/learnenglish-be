import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import db from "../../database/db.js";
import { mailer } from "../../utils/mailer.js";
import { config } from "../../config/index.js";

export const registerAdmin = (req, res) => {
  const q = "SELECT * from admin WHERE email=? ";
  const username = req.body?.username;
  const email = req.body?.email;
  const password = req.body?.password;
  const role = req.body?.role;

  db.query(q, [email, username], async (err, data) => {
    if (err) return res.status(409).json(err);
    if (data.length) return res.status(200).json("user or email already exits");

    if (data.length === 0) {
      bcrypt.hash(email, parseInt(10)).then((hashEmail) => {
        mailer(
          email,
          "Vui lòng Xác thực đăng ký",
          `<a href="http://localhost:${config?.PORT}/api/admin/verifyAdmin?email=${email}&password=${password}&role=${role}&token=${hashEmail}">Vui lòng xác nhận email</a>`
        );
      });
      return res.status(200).json("Please verify your email");
    }
    return res.status(200).json("Please verify your email");
  });
};

export const loginAdmin = (req, res) => {
  const q = "SELECT * from admin WHERE  email=?";
  const email = req.body?.email;

  db.query(q, [email.trim()], (err, data) => {
    if (err) return res.status(409).json(err);
    if (data.length === 0) return res.status(401).json("email not found");

    const isPassword = bcrypt.compareSync(req.body?.password, data[0].password);

    if (!isPassword) return res.status(401).json("Wrong password ");

    const token = jwt.sign(
      {
        adminIdPK: data[0]?.adminIdPK,
        username: data[0]?.userName,
        email: data[0]?.email,
      },
      "jwtkey"
    );
    const { password, ...orther } = data[0];
    return res.status(200).json({
      findUser: { ...orther },
      accessToken: token,
    });
  });
};

export const verifyEmailAdmin = async (req, res) => {
  const email = req.query?.email;
  const password = req.query?.password;
  const role = req.query?.role;
  const avatar =
    "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.2082370165.1715904000&semt=sph";
  bcrypt.compare(req.query?.email, req.query?.token, async (err, result) => {
    if (result === true) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const idUser = uuidv4();

      const q =
        "INSERT INTO admin(`adminIdPK`,`userName`,`email`,`password`,`avatar`,`role`) VALUES(?)";
      const value = [idUser, "fullName", email, hashedPassword, avatar, role];
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
