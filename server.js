const express = require("express");
const apiError = require("./utils/apiError");
const globalError = require("./middleware/middlewareErrorHanling");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const catgoryRoute = require("./routes/categoryRoutes");
const SubCatgoryRoute = require("./routes/subCategoryRoutes");
const productRoute = require("./routes/productRoutes");
const brandRoute = require("./routes/brandRoutes");

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", catgoryRoute);
app.use("/api/v1/Subcategories", SubCatgoryRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/brands", brandRoute);

app.all("*", (req, res, next) => {
  next(new apiError(`can't find this route :${req.originalUrl}`, 400));
});

app.use(globalError);

const server = app.listen(3000, () => {
  console.log("server connected.... ");
});

//handle recjection outside express
process.on("unhandeledRejection", (err) => {
  console.error(`unhandeledRejection Errors :${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`shutting down`);
    process.exit(1);
  });
});
