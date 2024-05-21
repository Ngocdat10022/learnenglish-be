import jwt from "jsonwebtoken";

export const verifyTokenAdmin = (req, res, next) => {
  const authHeader = req?.header("Authorization");

  const token = authHeader || authHeader?.split(" ")[1];
  if (!token) return res.status(409).json("Token not found");
  const authAdmin = jwt?.verify(token, "jwtkey");

  req.adminId = authAdmin?.adminIdPK;
  req.adminUserName = authAdmin?.username;
  next();
};
