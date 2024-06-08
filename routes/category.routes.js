import express from "express";
import categoryCtrl from "../controllers/category.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router
  .route("/api/category")
  .get(categoryCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, categoryCtrl.create);

router
  .route("/api/category/:categoryId")
  .get(authCtrl.requireSignin, categoryCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, categoryCtrl.update)
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    categoryCtrl.remove
  );

router.param("categoryId", categoryCtrl.categoryById);

export default router;
