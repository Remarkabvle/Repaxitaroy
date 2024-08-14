import { Product, validateProduct } from "../models/productSchema.js";

class ProductsController {
  async get(req, res) {
    const { limit = 10, skip = 0 } = req.query;
    try {
      const products = await Product.find()
        .populate("adminId", "fname username")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      if (!products.length) {
        return res.status(404).json({
          msg: "No products found",
          variant: "warning",
          payload: null,
        });
      }

      const totalCount = await Product.countDocuments();
      return res.status(200).json({
        msg: "Products retrieved successfully",
        variant: "success",
        payload: products,
        totalCount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async create(req, res) {
    const { error } = validateProduct(req.body);
    if (error) {
      return res.status(400).json({
        msg: error.details[0].message,
        variant: "warning",
        payload: null,
      });
    }

    try {
      const product = await Product.create({
        ...req.body,
        adminId: req.admin._id,
      });

      res.status(201).json({
        msg: "Product created successfully",
        variant: "success",
        payload: product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({
          msg: "Product not found",
          variant: "warning",
          payload: null,
        });
      }

      res.status(200).json({
        msg: "Product deleted successfully",
        variant: "success",
        payload: product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    try {
      const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({
          msg: "Product not found",
          variant: "warning",
          payload: null,
        });
      }

      res.status(200).json({
        msg: "Product updated successfully",
        variant: "success",
        payload: product,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new ProductsController();
