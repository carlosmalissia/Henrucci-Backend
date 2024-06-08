import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import userCtrl from "../controllers/user.controller.js";

const router = express.Router();

router
  .route("/api/isAdmin/:adminId")
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, authCtrl.isAdmin);

router.param("adminId", userCtrl.userByID);

export default router;
