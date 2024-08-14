import mongoose from "mongoose";
import Joi from "joi";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
        unique: true
    },
    fname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ["admin", "superadmin"],
        default: "admin"
    }
}, {
    timestamps: true
});

const Admins = mongoose.model("Admins", adminSchema);

const validateAdmins = (admin) => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(50).required(),
        fname: Joi.string().min(3).max(50).required(),
        lname: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        isActive: Joi.boolean(),
        role: Joi.string().valid("admin", "superadmin")
    });
    return schema.validate(admin);
};

export { Admins, validateAdmins };
