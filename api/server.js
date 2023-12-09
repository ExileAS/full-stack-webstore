const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cron = require("node-cron");
require("dotenv").config();
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productsRoutes");
const userRouter = require("./routes/userRegisterRoutes");
const orderedProductsRouter = require("./routes/orderedProductsRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const sellersRouter = require("./routes/sellerRoutes");
const { checkUser, csrfProtection } = require("./middleware/authMiddleware");
const { cleanupExpiredUsers, cleanExit } = require("./utils/cleanup");
const morgan = require("morgan");

const corsOptions = {
  origin: process.env.CLIENT_URI_DEV,
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  credentials: true,
};

// app.use(morgan("tiny"));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(fileUpload());

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    const PORT = process.env.PORT || 3007;
    app.listen(PORT);
    console.log(`listening on port ${PORT}`);
    cron.schedule("0 0 */2 * *", cleanupExpiredUsers);
    process.on("SIGINT", cleanExit);
  })
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));

app.get("/api/checkToken", checkUser);
app.get("/api/csrf-create-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.use(productRouter);
app.use(orderedProductsRouter);
app.use(userRouter);
app.use(sellersRouter);
app.use(reviewRouter);
app.use(authRouter);
app.use(paymentRouter);
