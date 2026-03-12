import { Schema, model } from "mongoose";
import { int } from "zod";

const productSchema = new Schema(
  {
    materialno: {
      type: String,
      required: [true, "Product Number is required"],
      unique: true,
    },
    materialname: {
      type: String,
      required: [true, "Product Name is required"],
    },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Product Price is required"] },
    count: { type: Number, required: [true, "Product Count is required"] },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },
  },
  {
    timestamps: true,
  },
);

export default model("Product", productSchema);
