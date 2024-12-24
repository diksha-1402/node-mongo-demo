import dotenv from "dotenv";
dotenv.config();

// Database connection
import connect from "./config/dbConnection.js";
connect();

// custom created files
import constants from "./utils/constants.js";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  return res
    .status(constants.CONST_RESP_CODE_OK)
    .send(messages.CONST_FORBIDDEN);
});

import router from "./routes/index.js";
import messages from "./utils/messages.js";

app.use("/v1/user/", router);

app.use("*", (req, res, next) => {
  res.status(404).json({
    message:messages.CONST_ENDPOINT_ERROR ,
  });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server run on: ${process.env.APP_PORT}`);
});
