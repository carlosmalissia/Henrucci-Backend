import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
import productCtrl from "../controllers/product.controller.js";
import multer from "multer";
import cors from "cors";

const router = express.Router();

//Upload image to mongo
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Cors options
const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000"],
  credentials: true,
  methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
  ],
};
router.use(cors(corsOptions));

router
  .route("/api/product")
  .get(productCtrl.list)
  .post(upload.single("photo"), productCtrl.create);

router.route("/api/product/top/:end").get(productCtrl.top);

router
  .route("/api/product/:productId")
  .get(productCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, productCtrl.update)
  .delete(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    productCtrl.remove
  );

router.route("/api/product/photo/:productId").get(productCtrl.photo);

router.param("productId", productCtrl.productByID);

export default router;
