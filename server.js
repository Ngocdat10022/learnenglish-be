import path from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routerAuth from "./routes/auth/auth.js";
import routerUsers from "./routes/user/user.js";
import routerAdmin from "./routes/authAdmin/authAdmin.js";
import routerCategory from "./routes/category/category.js";
import routerLessons from "./routes/lessons/lessons.js";
import routerVoca from "./routes/vocabulary/vocabulary.js";

const app = express();
const port = process.env.PORT | 5000;
// Page Home
const __dirname = path.resolve(path.dirname(""));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
// Số lượng request hiện tại
let requestCount = 0;

// Middleware kiểm tra số lượng request
const checkRequestLimit = (req, res, next) => {
  requestCount++;

  if (requestCount > 1000) {
    return res.status(429).send("Too Many Requests");
  }

  next();
};

// use bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());

const customCors = (req, callback) => {
  let allowedOrigins = [];
  // Kiểm tra cổng yêu cầu và thêm nguồn gốc tương ứng
  if (req.headers.origin?.includes("http://localhost:4000")) {
    allowedOrigins.push("http://localhost:4000");
  }
  if (req.headers.origin?.includes("http://localhost:3000")) {
    allowedOrigins.push("http://localhost:3000");
  }

  const corsOptions = {
    origin: allowedOrigins,
  };
  return callback(null, corsOptions);
};

// Sử dụng middleware tùy chỉnh
app.use(cors(customCors));
//use cors
// app.use(
//   cors({
//     origin: "http://localhost:4000",
//   })
// );

// Sử dụng middleware cho tất cả các route
app.use(checkRequestLimit);
app.use("/api/auth/", routerAuth);
app.use("/api/user/", routerUsers);
app.use("/api/admin/", routerAdmin);
app.use("/api/category/", routerCategory);
app.use("/api/lessons/", routerLessons);
app.use("/api/vocabulary/", routerVoca);

app.listen(port, () => {
  console.log(`Start server listen at http://localhost:${port}`);
});
