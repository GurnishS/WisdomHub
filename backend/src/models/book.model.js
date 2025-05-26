import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

const bookSchema = new Schema(
  {
    uploadedBy: {
      type:String,
      required: true,
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
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publisher: {
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

export const Book = mongoose.model("Book", bookSchema);
