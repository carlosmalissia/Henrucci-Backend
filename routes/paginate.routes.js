import express from "express";
import paginateCtrl from "../controllers/paginate.controller.js";

const router = express.Router();

router.route("/api/paginado").get(paginateCtrl.paginate);

export default router;
