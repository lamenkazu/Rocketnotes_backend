require("dotenv/config");
require("express-async-errors");
const AppError = require("./utils/AppError");

const uploadConfig = require("./configs/upload");

const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");

const migrationsRun = require("./database/sqlite/migrations");

const app = express();

app.use(express.json());

app.use(cors());

app.use(routes);

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

migrationsRun();

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    //Se for um erro do cliente
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error);

  return response.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app listening on port ${port}!`));
