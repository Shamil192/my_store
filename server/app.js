require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const sequelize = require("./db");
const PORT = process.env.PORT || 3030;
const models = require("./models/models");
const cors = require("cors");
const app = express();
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorMiddleware");
const fileUpload = require("express-fileupload");
const path = require('path')

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use("/api", router);

//Обработка ошибок, последний middleware
app.use(errorHandler);


const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Сервер стартанул на порте ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
