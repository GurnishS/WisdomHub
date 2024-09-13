import mongoose, { Schema } from "mongoose";

const connectionSchema = new Schema(
  {
    followedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Connection = mongoose.model("Connection", connectionSchema);
