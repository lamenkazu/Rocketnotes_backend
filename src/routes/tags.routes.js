const { Router } = require("express");
const TagsController = require("../controllers/TagsController");
const ensureAuth = require("../middlewares/ensureAuth");

const tagsController = new TagsController();
const tagsRouter = Router();

tagsRouter.use(ensureAuth);

tagsRouter.get("/", tagsController.index);

module.exports = tagsRouter;
