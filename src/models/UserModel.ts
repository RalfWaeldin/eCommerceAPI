import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, "Firstname is required"] },
    lastName: { type: String, required: [true, "Lastname is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email is not valid"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    roles: { type: [String], required: [true, "Roles are required"] },
  },
  {
    timestamps: true,
  },
);

export default model("User", userSchema);
