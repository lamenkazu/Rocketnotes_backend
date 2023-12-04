const { Router } = require("express");
const notesRouter = require("./notes.routes");
const tagsRouter = require("./tags.routes");
const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/Users", usersRouter);
routes.use("/Notes", notesRouter);
routes.use("/Tags", tagsRouter);
routes.use("/Sessions", sessionsRouter);

module.exports = routes;
