// Import necessary modules
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Book } from "../models/book.model.js";
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
      pdfLink: book.url, // Placeholder, should be replaced with actual link from cloud service
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
      pdfLink: questionPaper.url,
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
      pdfLink: studyMaterial.url,
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

export { uploadBook, uploadQuestionPaper, uploadStudyMaterial };
