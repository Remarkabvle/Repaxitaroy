import { Category, validateCategory } from "../models/categorySchema.js";

class CategoryController {
    async get(req, res) {
        try {
            const categories = await Category.find().populate([
                { path: "userId", select: ["fname", "username"] }
            ]).sort({ createdAt: -1 });

            if (!categories.length) {
                return res.status(404).json({
                    msg: "No categories found",
                    variant: "error",
                    payload: null
                });
            }

            res.status(200).json({
                msg: "Categories fetched successfully",
                variant: "success",
                payload: categories
            });
        } catch (err) {
            console.error("Error fetching categories:", err);
            res.status(500).json({
                msg: "Server error while fetching categories",
                variant: "error",
                payload: null
            });
        }
    }

    async create(req, res) {
        try {
            const { error } = validateCategory(req.body);

            if (error) {
                return res.status(400).json({
                    msg: error.details[0].message,
                    variant: "warning",
                    payload: null
                });
            }

            const category = new Category({
                ...req.body,
                userId: req.admin._id
            });
            await category.save();

            res.status(201).json({
                msg: "Category created successfully",
                variant: "success",
                payload: category
            });
        } catch (err) {
            console.error("Error creating category:", err);
            res.status(500).json({
                msg: "Server error while creating category",
                variant: "error",
                payload: null
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByIdAndDelete(id);

            if (!category) {
                return res.status(404).json({
                    msg: "Category not found",
                    variant: "error",
                    payload: null
                });
            }

            res.status(200).json({
                msg: "Category deleted successfully",
                variant: "success",
                payload: category
            });
        } catch (err) {
            console.error("Error deleting category:", err);
            res.status(500).json({
                msg: "Server error while deleting category",
                variant: "error",
                payload: null
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            const category = await Category.findByIdAndUpdate(id, req.body, { new: true });

            if (!category) {
                return res.status(404).json({
                    msg: "Category not found",
                    variant: "error",
                    payload: null
                });
            }

            res.status(200).json({
                msg: "Category updated successfully",
                variant: "success",
                payload: category
            });
        } catch (err) {
            console.error("Error updating category:", err);
            res.status(500).json({
                msg: "Server error while updating category",
                variant: "error",
                payload: null
            });
        }
    }
}

export default new CategoryController();
