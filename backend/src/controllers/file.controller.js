import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import convertPdfPageToImage from "../utils/thumbnail.js";

import { User } from "../models/user.model.js";

import drive from "../utils/Googledrive.js";

import { Book } from "../models/book.model.js";
import { StudyMaterial } from "../models/studyMaterial.model.js";
import { QuestionPaper } from "../models/questionPaper.model.js";

const uploadBook = asyncHandler(async (req, res, file) => {
  const { title, author, publisher } = req.body;
  if ([title, author, publisher].some((field) => !field.trim())) {
    throw new ApiError(400, "Please fill all fields");
  }
  try {
    const existedBook = await Book.findOne({ title });
    if (existedBook) {
      throw new ApiError(400, "Titled book already exists");
    }
    const bookLocalPath = req.files?.book[0]?.path;
    if (!bookLocalPath) {
      throw new ApiError(400, "PDF is required");
    }
    const thumbLocalPath = await convertPdfPageToImage(bookLocalPath);
    const book = await uploadOnCloudinary(thumbLocalPath);
    const pdfLink = await drive(title, bookLocalPath);
    const bookObject = await Book.create({
      title,
      author,
      publisher,
      uploadedBy: req.user._id,
      pdfLink: pdfLink,
      thumbLink: book.secure_url,
    });

    const createdBook = await Book.findById(bookObject._id);
    if (!createdBook) {
      throw new ApiError(500, "Something went wrong while creating object");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, createdBook, "Book uploaded successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while uploading Book");
  }
});

const uploadQuestionPaper = asyncHandler(async (req, res, file) => {
  const { title, subject, institute, yearOfExam } = req.body;
  if ([title, subject, institute, yearOfExam].some((field) => !field.trim())) {
    throw new ApiError(400, "Please fill all fields");
  }
  try {
    const existedQuestionPaper = await QuestionPaper.findOne({ title });
    if (existedQuestionPaper) {
      throw new ApiError(400, "Titled question paper already exists");
    }
    const questionPaperLocalPath = req.files?.questionPaper[0]?.path;
    if (!questionPaperLocalPath) {
      throw new ApiError(400, "PDF is required");
    }
    const thumbLocalPath = await convertPdfPageToImage(questionPaperLocalPath);
    const questionPaper = await uploadOnCloudinary(thumbLocalPath);
    const pdfLink = await drive(title, questionPaperLocalPath);
    const questionPaperObject = await QuestionPaper.create({
      title,
      institute,
      yearOfExam,
      subject,
      uploadedBy: req.user._id,
      pdfLink: pdfLink,
      thumbLink: questionPaper.secure_url,
    });
    const createdQuestionPaper = await QuestionPaper.findById(
      questionPaperObject._id
    );
    if (!createdQuestionPaper) {
      throw new ApiError(500, "Something went wrong while creating object");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdQuestionPaper,
          "Question paper uploaded successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while uploading Question Paper"
    );
  }
});

const uploadStudyMaterial = asyncHandler(async (req, res, file) => {
  const { title, institute, subject, description } = req.body;
  if ([title, institute, subject, description].some((field) => !field.trim())) {
    throw new ApiError(400, "Please fill all fields");
  }
  try {
    const existedStudyMaterial = await StudyMaterial.findOne({
      title,
    });
    if (existedStudyMaterial) {
      throw new ApiError(400, "Titled Study Material already exists");
    }
    const studyMaterialLocalPath = req.files?.studyMaterial[0]?.path;
    if (!studyMaterialLocalPath) {
      throw new ApiError(400, "PDF is required");
    }
    const thumbLocalPath = await convertPdfPageToImage(studyMaterialLocalPath);
    const studyMaterial = await uploadOnCloudinary(thumbLocalPath);
    const pdfLink = await drive(title, studyMaterialLocalPath);
    const studyMaterialObject = await StudyMaterial.create({
      title,
      institute,
      subject,
      description,
      uploadedBy: req.user._id,
      pdfLink: pdfLink,
      thumbLink: studyMaterial.secure_url,
    });
    const createdStudyMaterial = await StudyMaterial.findById(
      studyMaterialObject._id
    );
    if (!createdStudyMaterial) {
      throw new ApiError(500, "Something went wrong while creating object");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdStudyMaterial,
          "Study material uploaded successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while uploading PDF");
  }
});

const likeItem = asyncHandler((req, res) => {
  const { id, type } = req.body;
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "You must be logged In to like an item");
  }
  let model;
  switch (type) {
    case "Books":
      model = Book;
      break;
    case "Question Papers":
      model = QuestionPaper;
      break;
    case "Study Materials":
      model = StudyMaterial;
      break;
    default:
      throw new ApiError(400, "Invalid type");
  }
  model
    .findById(id)
    .then((item) => {
      if (!item) {
        throw new ApiError(404, "Item not found");
      }
      if (item.likes.includes(user._id)) {
        item.likes.pull(user._id);
      } else {
        item.likes.push(user._id);
      }
      return item.save();
    })
    .then((item) => {
      return res.status(200).json(new ApiResponse(200, {}, "Success"));
    })
    .catch((error) => {
      throw new ApiError(500, "Something went wrong while liking item");
    });
});

const viewedItem = asyncHandler((req, res) => {
  const { id, type } = req.body;
  let model;
  switch (type) {
    case "Books":
      model = Book;
      break;
    case "Question Papers":
      model = QuestionPaper;
      break;
    case "Study Materials":
      model = StudyMaterial;
      break;
    default:
      throw new ApiError(400, "Invalid type");
  }
  model
    .findById(id)
    .then((item) => {
      if (!item) {
        throw new ApiError(404, "Item not found");
      }
      item.views += 1;
      return item.save();
    })
    .then((item) => {
      return res.status(200).json(new ApiResponse(200, {}, "Success"));
    })
    .catch((error) => {
      throw new ApiError(
        500,
        "Something went wrong while increamenting view count"
      );
    });
});

const getBooks = asyncHandler(async (req, res) => {
  try {
    // Fetch all books
    const books = await Book.find();
    // Extract all unique user IDs from books
    const userIds = [...new Set(books.map((book) => book.uploadedBy))];
    // Fetch all users corresponding to the userIds and select only username and avatar
    const users = await User.find({ _id: { $in: userIds } }).select(
      "username avatar fullName"
    );
    // Map users to a map for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});
    // Map each book to include the corresponding user's username and avatar
    const booksWithUsers = books.map((book) => ({
      ...book.toObject(),
      userId: book.uploadedBy,
      username: userMap[book.uploadedBy].username,
      avatar: userMap[book.uploadedBy].avatar,
      fullName: userMap[book.uploadedBy].fullName,
    }));

    // Respond with the modified books array
    return res
      .status(200)
      .json(new ApiResponse(200, booksWithUsers, "Successfully fetched books"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching books");
  }
});

const getStudyMaterial = asyncHandler(async (req, res) => {
  try {
    // Fetch all study materials
    const studyMaterials = await StudyMaterial.find();

    // Extract all unique user IDs from studyMaterials
    const userIds = [
      ...new Set(studyMaterials.map((material) => material.uploadedBy)),
    ];

    // Fetch all users corresponding to the userIds and select only necessary fields
    const users = await User.find({ _id: { $in: userIds } }).select(
      "username avatar fullName"
    );

    // Map users to a map for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    // Map each study material to include the corresponding user's username and avatar
    const studyMaterialsWithUsers = studyMaterials.map((material) => ({
      ...material.toObject(),
      userId: material.uploadedBy,
      username: userMap[material.uploadedBy].username,
      avatar: userMap[material.uploadedBy].avatar,
      fullName: userMap[material.uploadedBy].fullName,
    }));

    // Respond with the modified study materials array
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          studyMaterialsWithUsers,
          "Successfully fetched study materials"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while fetching studyMaterials"
    );
  }
});

const getQuestionPaper = asyncHandler(async (req, res) => {
  try {
    // Fetch all question papers
    const questionPapers = await QuestionPaper.find();

    // Extract all unique user IDs from questionPapers
    const userIds = [
      ...new Set(questionPapers.map((paper) => paper.uploadedBy)),
    ];

    // Fetch all users corresponding to the userIds and select only username and avatar
    const users = await User.find({ _id: { $in: userIds } }).select(
      "username avatar fullName"
    );

    // Map users to a map for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    // Map each question paper to include the corresponding user's username and avatar
    const questionPapersWithUsers = questionPapers.map((paper) => ({
      ...paper.toObject(),
      userId: paper.uploadedBy,
      username: userMap[paper.uploadedBy].username,
      avatar: userMap[paper.uploadedBy].avatar,
      fullName: userMap[paper.uploadedBy].fullName,
    }));

    // Respond with the modified question papers array
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          questionPapersWithUsers,
          "Successfully fetched question papers"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while fetching questionPapers"
    );
  }
});

export {
  uploadBook,
  uploadQuestionPaper,
  uploadStudyMaterial,
  likeItem,
  getBooks,
  getQuestionPaper,
  getStudyMaterial,
  viewedItem,
};
