const { Router } = require("express");
const NotesController = require("../controllers/NotesController");
const ensureAuth = require("../middlewares/ensureAuth");

const notesController = new NotesController();
const notesRouter = Router();

notesRouter.use(ensureAuth); //Aplica o Middleware pra todas as rotas
notesRouter.get("/", notesController.index);
notesRouter.get("/:note_id", notesController.show);
notesRouter.post("/", notesController.create);
notesRouter.delete("/:note_id", notesController.delete);

module.exports = notesRouter;
