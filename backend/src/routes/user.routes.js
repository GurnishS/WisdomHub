import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  checkUsernameExists,
  getUserProfile,
  searchUser,
  followUser,
  unfollowUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser);
router.route("/search-user").post(verifyJWT, searchUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/check-username-exists").post(checkUsernameExists);
router.route("/get-user-profile").post(verifyJWT, getUserProfile);
router.route("/:username").post(verifyJWT, getUserProfile);
router.route("/follow/:userId").post(verifyJWT, followUser);
router.route("/unfollow/:userId").post(verifyJWT, unfollowUser);
export default router;
