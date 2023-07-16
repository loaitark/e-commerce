const express = require("express");
const apiError = require("./utils/apiError");
const globalError = require("./middleware/middlewareErrorHanling");
const userRouter = require("./routes/userRoutes");
const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new apiError(`can't find this route :${req.originalUrl}`, 400));
});

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
