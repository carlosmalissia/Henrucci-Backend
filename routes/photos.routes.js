import express from "express";
import multer from "multer";
import cors from "cors";
import photosCtrl from "../controllers/photos.controller.js";
import authCtrl from "../controllers/auth.controller.js";

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
  .route("/api/photos")
  .get(photosCtrl.list)
  .post(upload.single("photoData"), photosCtrl.create);

router
  .route("/api/photos/:photoId")
  .get(photosCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, photosCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, photosCtrl.remove);

router.param("photoId", photosCtrl.photoById);

export default router;
