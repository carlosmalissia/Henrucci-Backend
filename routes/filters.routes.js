import express from "express";
import filtersCtrl from "../controllers/filters.controller.js";
import paginateCtrl from "../controllers/paginate.controller.js";

const router = express.Router();

router.route("/api/filter").get(filtersCtrl.filter, paginateCtrl.paginate);

export default router;
