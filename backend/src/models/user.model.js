import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {

    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    institute: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Student", "Teacher", "Other"],
    },
    avatar: {
      type: String,
      required: true,
    },
    recentlyWatchedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    recentlyWatchedQuestionPapers: [
      {
        type: Schema.Types.ObjectId,
        ref: "QuestionPaper",
      },
    ],
    recentlyWatchedStudyMaterials: [
      {
        type: Schema.Types.ObjectId,
        ref: "StudyMaterial",
      },
    ]
  },
  {
    timestamps: true,
  }
);


export const User = mongoose.model("User", userSchema);
