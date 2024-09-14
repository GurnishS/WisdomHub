import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendEmail.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import { User } from "../models/user.model.js";
import { Validation } from "../models/validation.model.js";

import { Book } from "./../models/book.model.js";
import { QuestionPaper } from "./../models/questionPaper.model.js";
import { StudyMaterial } from "../models/studyMaterial.model.js";
import { Connection } from "./../models/connection.model.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
const RESEND_TIMEOUT = 1 * 60 * 1000; // 1 minute

const generateOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const existingOtp = await Validation.findOne({ email });
  if (
    existingOtp &&
    Date.now() - new Date(existingOtp.createdAt).getTime() < RESEND_TIMEOUT
  ) {
    const timeLeft =
      RESEND_TIMEOUT - (Date.now() - new Date(existingOtp.createdAt).getTime());
    throw new ApiError(
      400,
      `Please wait before requesting a new OTP:${timeLeft}`
    );
  }

  if (existingOtp) {
    await existingOtp.deleteOne();
  }
  const expiresAt = new Date(Date.now() + OTP_EXPIRATION_TIME);
  const otpRecord = new Validation({ email, otp, expiresAt });
  await otpRecord.save();
  await sendOTP(email, otp);
  return res
    .status(200)
    .json(new ApiResponse(200, { RESEND_TIMEOUT }, "OTP sent successfully"));
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await Validation.findOne({ email, otp });
  if (!otpRecord) {
    throw new ApiError(400, "Invalid OTP");
  }
  if (Date.now() > new Date(otpRecord.expiresAt).getTime()) {
    await Validation.deleteOne({ email, otp });
    throw new ApiError(400, "OTP has expired");
  }
  await otpRecord.updateOne({ isVerified: true });
  return res
    .status(200)
    .json(new ApiResponse(200, { status: true }, "OTP verified"));
});

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username, institute, role, googleId } =
    req.body;
  if (
    [fullName, email, username, institute, role].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all fields");
  }
  if (googleId == "" && password == "") {
    throw new ApiError(400, "Please fill all fields");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(400, "Email or Username already exists");
  }
  const isVerified =
    googleId == ""
      ? await Validation.findOne({ email, isVerified: true })
      : true;
  if (!isVerified) {
    throw new ApiError(400, "Email is not verified");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Something went wrong while uploading avatar");
  }
  let user;
  if (googleId == "") {
    user = await User.create({
      fullName,
      avatar: avatar.secure_url,
      institute,
      role,
      email,
      password,
      username: username.toLowerCase(),
    });
  } else {
    user = await User.create({
      fullName,
      avatar: avatar.secure_url,
      institute,
      role,
      email,
      password,
      username: username.toLowerCase(),
      googleId,
    });
  }
  const createdUser = await User.findById(user._id).select(
    "username email fullName institute role"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "username email fullName"
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged In Successfully"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const incomingRefreshToken = refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }
    let accessToken;
    try {
      accessToken = user.generateAccessToken();
    } catch (error) {
      throw new ApiError(500, "Something went wrong while generating tokens");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
  } catch (error) {
    console.log(error);
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, {}, "Password changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User details"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username, role, institute } = req.body;
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log(avatarLocalPath);
  console.log(fullName, email, username, role, institute);
  // Check if any required fields are empty
  if (
    [fullName, email, username, institute, role].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all fields");
  }
  try {
    // Upload avatar to Cloudinary if an avatar file is provided
    if (avatarLocalPath) {
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new ApiError(500, "Something went wrong while uploading avatar");
      }
      // Update user's avatar URL in the database
      await User.findByIdAndUpdate(
        req.user._id,
        { $set: { avatar: avatar.secure_url } },
        { new: true }
      );
    }
    // Update user's details in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName,
          email,
          username,
          role,
          institute,
        },
      },
      { new: true }
    ).select("-password");
    // Respond with the updated user object and success message
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Account details updated"));
  } catch (error) {
    // Handle any errors that occur during avatar upload or database update
    console.error("Error updating account details:", error.message);
    throw new ApiError(500, "Failed to update account details");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  let username;
  if (req.params.username) {
    username = req.params.username;
  } else {
    username = req.user.username;
  }

  if (!username?.trim()) {
    throw new ApiError(400, "Username is required");
  }
  const userProfile = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "connections",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "connections",
        localField: "_id",
        foreignField: "followedBy",
        as: "follows",
      },
    },
    {
      $addFields: {
        followerCount: { $size: "$followers" },
        followingCount: { $size: "$follows" },
        isFollowing: {
          $cond: {
            if: { $in: [req.user._id, "$followers.followedBy"] },
            then: true,
            else: false,
          },
        },
        disableButton: {
          $cond: {
            if: { $eq: [req.user.username, username] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        followerCount: 1,
        followingCount: 1,
        isFollowing: 1,
        disableButton: 1,
        email: 1,
        role: 1,
        institute: 1,
      },
    },
  ]);

  if (!userProfile.length) {
    throw new ApiError(404, "User not found");
  }
  const user = userProfile[0];
  const books = await Book.find({ uploadedBy: user._id });
  const questionPapers = await QuestionPaper.find({ uploadedBy: user._id });
  const studyMaterials = await StudyMaterial.find({ uploadedBy: user._id });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { userProfile, items: { questionPapers, studyMaterials, books } },
        "User profile fetched successfully"
      )
    );
});

const followUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "User id is required");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (userId == req.user._id) {
    throw new ApiError(400, "You cannot follow yourself");
  }
  const connection = await Connection.findOne({
    followedBy: req.user._id,
    following: userId,
  });
  if (connection) {
    throw new ApiError(400, "Already following the user");
  }
  await Connection.create({
    followedBy: req.user._id,
    following: userId,
  });
  return res.status(200).json(new ApiResponse(200, {}, "User followed"));
});

const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "User id is required");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (userId == req.user._id) {
    throw new ApiError(400, "You cannot unfollow yourself");
  }
  const connection = await Connection.findOneAndDelete({
    followedBy: req.user._id,
    following: userId,
  });
  if (!connection) {
    throw new ApiError(400, "Not following the user");
  }
  return res.status(200).json(new ApiResponse(200, {}, "User unfollowed"));
});

const getFeed = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const following = user.following;
  const questionPaperFeed = await QuestionPaper.find({
    uploadedBy: { $in: following },
  }).sort({ createdAt: -1 });
  const studyMaterialFeed = await StudyMaterial.find({
    uploadedBy: { $in: following },
  }).sort({ createdAt: -1 });
  const bookFeed = await Book.find({ uploadedBy: { $in: following } }).sort({
    createdAt: -1,
  });
  const feed = [...questionPaperFeed, ...studyMaterialFeed, ...bookFeed].sort(
    (a, b) => b.createdAt - a.createdAt
  );
  return res.status(200).json(new ApiResponse(200, feed, "Feed"));
});

const getRecentItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const recentQuestionPapers = await QuestionPaper.find({
    _id: { $in: user.recentlyWatchedQuestionPapers },
  }).sort({ createdAt: -1 });
  const recentStudyMaterials = await StudyMaterial.find({
    _id: { $in: user.recentlyWatchedStudyMaterials },
  }).sort({ createdAt: -1 });
  const recentBooks = await Book.find({
    _id: { $in: user.recentlyWatchedBooks },
  }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { recentQuestionPapers, recentStudyMaterials, recentBooks },
        "Recent Items"
      )
    );
});

const checkUsernameExists = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    return res.status(200).json(new ApiResponse(200, true, "Username exists"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, false, "Username does not exist"));
});

const searchUser = asyncHandler(async (req, res) => {
  const { keyword } = req.body;
  if (!keyword) {
    res.status(400);
    throw new Error("Keyword is required");
  }
  const users = await User.aggregate([
    {
      $match: {
        $or: [
          { fullName: { $regex: keyword, $options: "i" } },
          { username: { $regex: keyword, $options: "i" } },
        ],
        username: { $ne: req.user.username },
      },
    },
    {
      $lookup: {
        from: "connections",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    {
      $addFields: {
        isFollowing: {
          $in: [req.user._id, "$followers.followedBy"],
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        isFollowing: 1,
        _id: 1,
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(200, users, "Search Results"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  checkUsernameExists,
  getUserProfile,
  searchUser,
  followUser,
  unfollowUser,
  updateAccountDetails,
  generateOTP,
  verifyOTP,
  refreshAccessToken,
};
