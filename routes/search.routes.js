import express from "express";
import searchCtrl from "../controllers/search.controller.js";
import paginateCtrl from "../controllers/paginate.controller.js";

const router = express.Router();

router.route("/api/search/:searchValue").get(searchCtrl.search, paginateCtrl.paginate);

export default router;
