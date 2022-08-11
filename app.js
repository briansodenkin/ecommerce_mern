require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const upload = require("express-fileupload");

//database
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("./public"));
app.use(upload());

app.get("/", (req, res) => {
  res.send("ecommerce api");
});

app.get("/api/v1", (req, res) => {
  console.log(req.cookies);
  res.send("ecommerce api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server starts at ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
