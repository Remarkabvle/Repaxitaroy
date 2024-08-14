import Joi from "joi";
import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    oldPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Assuming there’s a Category model
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    units: {
      type: String,
      required: true,
      enum: ["kg", "m", "l", "pcs"],
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    urls: {
      type: [String],
      default: [],
    },
    info: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);

export const validateProduct = (body) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(0).required(),
    oldPrice: Joi.number().min(0),
    stock: Joi.number().min(0),
    rating: Joi.number().min(0).max(5),
    views: Joi.number().min(0),
    units: Joi.string().valid("kg", "m", "l", "pcs").required(),
    desc: Joi.string().required(),
    urls: Joi.array().items(Joi.string().uri()),
    info: Joi.array().items(Joi.string()),
    available: Joi.boolean(),
  });
  return schema.validate(body);
};
