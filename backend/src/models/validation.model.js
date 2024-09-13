import mongoose, { Schema } from "mongoose";

const validationSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now, index: { expires: "5m" } },
  expiresAt: { type: Date, required: true },
});

export const Validation = mongoose.model("Validation", validationSchema);
