import { Router } from "express";

import {
  getBooks,
  getQuestionPaper,
  getStudyMaterial,
  likeItem,
  uploadBook,
  uploadQuestionPaper,
  uploadStudyMaterial,
  viewedItem,
} from "../controllers/file.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get((req, res) => {
  res.send("Server is up and running");
});
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

router.route("/like").post(verifyJWT, likeItem);
router.route("/get-books").get(getBooks);
router.route("/get-question-papers").get(getQuestionPaper);
router.route("/get-study-materials").get(getStudyMaterial);
router.route("/view").post(viewedItem);
export default router;
