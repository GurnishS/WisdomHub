// Import necessary modules
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Book } from "../models/book.model.js";
import { User } from "../models/user.model.js";
import { StudyMaterial } from "../models/studyMaterial.model.js";
import { QuestionPaper } from "../models/questionPaper.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Define the uploadBook handler function
const uploadBook = asyncHandler(async (req, res, file) => {
  const { title, author, publisher } = req.body;

  // Validate required fields
  if ([title, author, publisher].some((field) => !field.trim())) {
    throw new ApiError(400, "Please fill all fields");
  }

  try {
    // Check if a book with the same title already exists
    const existedBook = await Book.findOne({ title });
    if (existedBook) {
      throw new ApiError(400, "Book with same title already exists");
    }

    // Get the local path of the uploaded PDF file
    const bookLocalPath = req.files?.book[0]?.path;
    if (!bookLocalPath) {
      throw new ApiError(400, "PDF file is required");
    }
    const book = await uploadOnCloudinary(bookLocalPath);
    console.log("Book:", book);

    // Generate and upload a thumbnail for the PDF

    // Create a new Book object in the database
    const bookObject = await Book.create({
      title,
      author,
      publisher,
      uploadedBy: req.user._id,
      pdfLink: book.secure_url, // Placeholder, should be replaced with actual link from cloud service
    });

    // Retrieve the created book from the database
    const createdBook = await Book.findById(bookObject._id);
    if (!createdBook) {
      throw new ApiError(
        500,
        "Something went wrong while creating the book object"
      );
    }

    // Respond with a success message and the created book details
    return res
      .status(201)
      .json(new ApiResponse(200, createdBook, "Book registered successfully"));
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new ApiError(500, "Something went wrong while uploading PDF");
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
      throw new ApiError(400, "Question paper with same title already exists");
    }
    const questionPaperLocalPath = req.files?.questionPaper[0]?.path;
    if (!questionPaperLocalPath) {
      throw new ApiError(400, "Question paper is required");
    }
    const questionPaper = await uploadOnCloudinary(questionPaperLocalPath);
    console.log("Question Paper:", questionPaper);
    const questionPaperObject = await QuestionPaper.create({
      title,
      institute,
      yearOfExam,
      subject,
      uploadedBy: req.user._id,
      pdfLink: questionPaper.secure_url,
    });
    const createdQuestionPaper = await QuestionPaper.findById(
      questionPaperObject._id
    );
    if (!createdQuestionPaper) {
      throw new ApiError(
        500,
        "Something went wrong while creating the question paper object"
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdQuestionPaper,
          "Question paper registered successfully"
        )
      );
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new ApiError(500, "Something went wrong while uploading PDF");
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
      throw new ApiError(400, "Study material with same title already exists");
    }
    const studyMaterialLocalPath = req.files?.studyMaterial[0]?.path;
    if (!studyMaterialLocalPath) {
      throw new ApiError(400, "Study material is required");
    }
    const studyMaterial = await uploadOnCloudinary(studyMaterialLocalPath);
    console.log("Study Material:", studyMaterial);
    const studyMaterialObject = await StudyMaterial.create({
      title,
      institute,
      subject,
      description,
      uploadedBy: req.user._id,
      pdfLink: studyMaterial.secure_url,
    });
    const createdStudyMaterial = await StudyMaterial.findById(
      studyMaterialObject._id
    );
    if (!createdStudyMaterial) {
      throw new ApiError(
        500,
        "Something went wrong while creating the study material object"
      );
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          createdStudyMaterial,
          "Study material registered successfully"
        )
      );
  } catch (error) {
    console.error("Error uploading PDF:", error);
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
      return res.status(200).json(new ApiResponse(200, item, "Success"));
    })
    .catch((error) => {
      console.error("Error liking item:", error);
      throw new ApiError(500, "Something went wrong while liking item");
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
      userId: book.uploadedBy, // Assuming you also want to keep the uploadedBy ID
      username: userMap[book.uploadedBy].username,
      avatar: userMap[book.uploadedBy].avatar,
      fullName: userMap[book.uploadedBy].fullName,
    }));

    // Respond with the modified books array
    return res
      .status(200)
      .json(new ApiResponse(200, booksWithUsers, "Success"));
  } catch (error) {
    console.error("Error getting books:", error);
    throw new ApiError(500, "Something went wrong while getting books");
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
      .json(new ApiResponse(200, studyMaterialsWithUsers, "Success"));
  } catch (error) {
    console.error("Error getting studyMaterial:", error);
    throw new ApiError(500, "Something went wrong while getting studyMaterial");
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
      .json(new ApiResponse(200, questionPapersWithUsers, "Success"));
  } catch (error) {
    console.error("Error getting questionPapers:", error);
    throw new ApiError(
      500,
      "Something went wrong while getting questionPapers"
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
};
