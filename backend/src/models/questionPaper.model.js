import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";


const questionPaperSchema = new Schema(
  {
    uploadedBy: {
      type: String,
      required: true,
      index: true,
      validate: {
      validator: async function(value) {
        const user = await User.findOne({ uid: value });
        return !!user;  // must exist
      },
      message: props => `${props.value} is not a valid user uid!`
    }
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    yearOfExam: {
      type: Number,
      required: true,
    },
    institute: {
      type: String,
      required: true,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    pdfLink: {
      type: String,
      required: true,
    },
    thumbLink: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const QuestionPaper = mongoose.model(
  "QuestionPaper",
  questionPaperSchema
);
