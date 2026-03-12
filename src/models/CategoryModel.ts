import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    categoryname: {
      type: String,
      required: [true, "Category Name is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Category", categorySchema);
