import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";


const connectionSchema = new Schema(
  {
    followedBy: {
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
    following: {
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
  },
  {
    timestamps: true,
  }
);

export const Connection = mongoose.model("Connection", connectionSchema);
