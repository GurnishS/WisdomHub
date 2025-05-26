import { Router } from "express";
import {
  registerUser,
  getCurrentUser,
  checkUsernameExists,
  getUserProfile,
  searchUser,
  followUser,
  unfollowUser,
  updateAccountDetails,
  verifyUser
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/search-user").post(verifyJWT, searchUser);
router
  .route("/update-profile")
  .post(
    verifyJWT,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    updateAccountDetails
  );

// router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/verify-user").post(verifyJWT, verifyUser);
router.route("/check-username-exists").post(checkUsernameExists);
router.route("/get-user-profile").post(verifyJWT, getUserProfile);
router.route("/:username").post(verifyJWT, getUserProfile);
router.route("/follow/:uid").post(verifyJWT, followUser);
router.route("/unfollow/:uid").post(verifyJWT, unfollowUser);
export default router;
