import { Router } from "express";
import {
  uploadBook,
  uploadQuestionPaper,
  uploadStudyMaterial,
} from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// router
//   .route("/register")
//   .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

// router.route("/login").post(loginUser);
// router.route("/logout").post(verifyJWT, logoutUser);

router
  .route("/upload-book")
  .post(verifyJWT, upload.fields([{ name: "book", maxCount: 1 }]), uploadBook);

router
  .route("/upload-question-paper")
  .post(
    verifyJWT,
    upload.fields([{ name: "questionPaper", maxCount: 1 }]),
    uploadQuestionPaper
  );
router
  .route("/upload-study-material")
  .post(
    verifyJWT,
    upload.fields([{ name: "studyMaterial", maxCount: 1 }]),
    uploadStudyMaterial
  );
export default router;
