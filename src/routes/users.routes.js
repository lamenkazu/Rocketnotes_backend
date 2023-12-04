const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuth = require("../middlewares/ensureAuth");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const usersRouter = Router();

const upload = multer(uploadConfig.MULTER);

usersRouter.post("/", usersController.create);
usersRouter.put("/", ensureAuth, usersController.update);
usersRouter.patch(
  "/avatar",
  ensureAuth,
  upload.single("avatar"),
  userAvatarController.update
);

module.exports = usersRouter;
