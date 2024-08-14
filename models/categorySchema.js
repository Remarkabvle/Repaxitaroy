import mongoose from "mongoose";
import Joi from "joi";

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        unique: true
    },
    description: {
        type: String,
        minlength: 5,
        maxlength: 1024
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admins",
        required: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categorySchema);

const validateCategory = (category) => {
    const schema = Joi.object({
        categoryName: Joi.string().min(2).max(255).required(),
        description: Joi.string().min(5).max(1024),
        userId: Joi.string().required()
    });
    return schema.validate(category);
};

export { Category, validateCategory };
