import { Admins, validateAdmins } from "../models/adminSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

class AdminsController {
    async get(req, res) {
        try {
            const admins = await Admins.find().sort({ createdAt: -1 });

            if (!admins.length) {
                return res.status(404).json({
                    msg: "No users found",
                    variant: "error",
                    payload: null,
                    totalCount: 0
                });
            }

            res.status(200).json({
                msg: "Admins fetched successfully",
                variant: "success",
                payload: admins,
                totalCount: admins.length
            });
        } catch (err) {
            console.error("Error fetching admins:", err);
            res.status(500).json({
                msg: "Server error while fetching admins",
                variant: "error",
                payload: null,
            });
        }
    }

    async getProfile(req, res) {
        try {
            const admin = await Admins.findById(req.admin._id).select("-password");

            if (!admin || !admin.isActive) {
                return res.status(401).json({
                    msg: "Unauthorized access",
                    variant: "error",
                    payload: null
                });
            }

            res.status(200).json({
                msg: "Admin profile fetched successfully",
                variant: "success",
                payload: admin
            });
        } catch (err) {
            console.error("Error fetching profile:", err);
            res.status(500).json({
                msg: "Server error while fetching profile",
                variant: "error",
                payload: null
            });
        }
    }

    async getOneAdmin(req, res) {
        try {
            const admin = await Admins.findById(req.params.id).select("-password");

            if (!admin) {
                return res.status(404).json({
                    msg: "Admin not found",
                    variant: "error",
                    payload: null
                });
            }

            res.status(200).json({
                msg: "Admin fetched successfully",
                variant: "success",
                payload: admin
            });
        } catch (err) {
            console.error("Error fetching admin:", err);
            res.status(500).json({
                msg: "Server error while fetching admin",
                variant: "error",
                payload: null
            });
        }
    }

    async create(req, res) {
        try {
            const { error } = validateAdmins(req.body);
            if (error) {
                return res.status(400).json({
                    msg: error.details[0].message,
                    variant: "error",
                    payload: null,
                });
            }

            const { username, password } = req.body;

            const existingUser = await Admins.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    msg: "Username already exists",
                    variant: "error",
                    payload: null,
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const admin = new Admins({
                ...req.body,
                password: hashedPassword,
            });
            await admin.save();

            res.status(201).json({
                msg: "Admin registered successfully",
                variant: "success",
                payload: admin,
            });
        } catch (err) {
            console.error("Error creating admin:", err);
            res.status(500).json({
                msg: "Server error while creating admin",
                variant: "error",
                payload: null,
            });
        }
    }

    async signIn(req, res) {
        try {
            const { username, password } = req.body;

            const admin = await Admins.findOne({ username });
            if (!admin) {
                return res.status(400).json({
                    msg: "Invalid username or password",
                    variant: "error",
                    payload: null,
                });
            }

            const validPassword = await bcrypt.compare(password, admin.password);
            if (!validPassword) {
                return res.status(400).json({
                    msg: "Invalid username or password",
                    variant: "error",
                    payload: null,
                });
            }

            const token = jwt.sign(
                { _id: admin._id, role: admin.role, isActive: admin.isActive },
                process.env.ADMIN_SECRET,
                { expiresIn: "1h" } // Added token expiration
            );

            res.status(200).json({
                msg: "Logged in successfully",
                variant: "success",
                payload: { admin, token },
            });
        } catch (err) {
            console.error("Error during sign in:", err);
            res.status(500).json({
                msg: "Server error during sign in",
                variant: "error",
                payload: null,
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            if (req.body.password) {
                return res.status(400).json({
                    msg: "Password cannot be updated through this endpoint",
                    variant: "error",
                    payload: null,
                });
            }

            const existingAdmin = await Admins.findOne({ username: req.body.username });
            if (existingAdmin && id !== existingAdmin._id.toString()) {
                return res.status(400).json({
                    msg: "Username already exists",
                    variant: "error",
                    payload: null,
                });
            }

            const updatedAdmin = await Admins.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedAdmin) {
                return res.status(404).json({
                    msg: "Admin not found",
                    variant: "error",
                    payload: null,
                });
            }

            res.status(200).json({
                msg: "Admin updated successfully",
                variant: "success",
                payload: updatedAdmin,
            });
        } catch (err) {
            console.error("Error updating admin:", err);
            res.status(500).json({
                msg: "Server error while updating admin",
                variant: "error",
                payload: null,
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const admin = await Admins.findByIdAndDelete(id);

            if (!admin) {
                return res.status(404).json({
                    msg: "Admin not found",
                    variant: "error",
                    payload: null,
                });
            }

            res.status(200).json({
                msg: "Admin deleted successfully",
                variant: "success",
                payload: admin
            });
        } catch (err) {
            console.error("Error deleting admin:", err);
            res.status(500).json({
                msg: "Server error while deleting admin",
                variant: "error",
                payload: null,
            });
        }
    }
}

export default new AdminsController();
