import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

const studyMaterialSchema = new Schema(
  {
    uploadedBy: {
      type: String,
      unique: true,
      index:true,
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
    description: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
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
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pdfLink: {
      type: String,
      required: true,
    },
    thumbLink: {
      type: String,
      required: true,
    },
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

export const StudyMaterial = mongoose.model(
  "StudyMaterial",
  studyMaterialSchema
);
