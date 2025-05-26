import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";


const commentSchema = new Schema(
  {
    commentedBy: {
      type: String,
      required: true,
      validate: {
      validator: async function(value) {
        const user = await User.findOne({ uid: value });
        return !!user;  // must exist
      },
      message: props => `${props.value} is not a valid user uid!`
    }
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model("Comment", commentSchema);
