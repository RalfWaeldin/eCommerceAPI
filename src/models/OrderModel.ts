import { Schema, model } from "mongoose";

/*
const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    orders: Array({
      orderitem: {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },
        ordered: {
          type: Number,
          required: "Order Number is required",
        },
      },
    }),
  },
  {
    timestamps: true,
  },
);
*/

const orderSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  orders: [
    new Schema({
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"],
      },
      ordered: {
        type: Number,
        required: "Order Number is required",
      },
    }),
  ],
});

export default model("Order", orderSchema);
