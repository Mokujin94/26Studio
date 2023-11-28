require("dotenv").config();
const express = require("express");
const path = require("path");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErroeHandlingMiddleware");
const http = require("http");
const socketIo = require("socket.io");

const { initSocket } = require("./socket"); // Подключаем функцию инициализации Socket.IO

const PORT = process.env.PORT || 5000;
const socketIoPort = 3001;

const app = express();
const httpServer = http.createServer(app);
const io = initSocket(httpServer);

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static/news")));
app.use(express.static(path.resolve(__dirname, "static/avatars")));
app.use(express.static(path.resolve(__dirname, "static/projects")));
app.use(express.static(path.resolve(__dirname, "extracted")));
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(path.resolve(__dirname, "static"));
    app.listen(PORT, () => console.log(`сервер стартанул на порте ${PORT}`));
    httpServer.listen(socketIoPort, () => {
      console.log(`Сервер Socket.IO стартовал на порту ${socketIoPort}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
