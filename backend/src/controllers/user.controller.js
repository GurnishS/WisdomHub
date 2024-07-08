import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Book } from "./../models/book.model.js";
import { QuestionPaper } from "./../models/questionPaper.model.js";
import { StudyMaterial } from "../models/studyMaterial.model.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username, institute, role } = req.body;
  if (
    [fullName, email, password, username, institute, role].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all fields");
  }
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(400, "Email or Username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Something went wrong while uploading avatar");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    institute,
    role,
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
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
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
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

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
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
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Current password is incorrect");
  }
  user.password = newPassword;
  user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, {}, "Password changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User details"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "Full name and email are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName, email } },
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, user, "Avatar updated"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  let username;
  if (req.params.username) {
    username = req.params.username;
  } else {
    username = req.user.username;
  }

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
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
        foreignField: "followedBy",
        as: "followers",
      },
    },
    {
      $lookup: {
        from: "connections",
        localField: "_id",
        foreignField: "following",
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
        "User profile"
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

const getUploadedItems = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, false, "Username does not exist"));
  }

  const books = await Book.find({ uploadedBy: user._id });
  const questionPapers = await QuestionPaper.find({ uploadedBy: user._id });
  const studyMaterials = await StudyMaterial.find({ uploadedBy: user._id });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { questionPapers, studyMaterials, books },
        "User Items"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  checkUsernameExists,
  getUserProfile,
};
