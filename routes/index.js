import express from "express";
import AdminsController from "../controller/admins.js";
import CategoryController from "../controller/category.js";
import ProductsController from "../controller/products.js";
import { Auth, OwnerAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin routes
router.get("/admins", [Auth, OwnerAuth], AdminsController.get);
router.get("/admins/profile", Auth, AdminsController.getprofile);
router.get("/admins/:id", [Auth, OwnerAuth], AdminsController.getOneAdmin);
router.post("/admins/sign-up", [Auth, OwnerAuth], AdminsController.create);
router.post("/admins/sign-in", AdminsController.signin);
router.patch("/admins/:id", [Auth, OwnerAuth], AdminsController.update);
router.delete("/admins/:id", [Auth, OwnerAuth], AdminsController.delete);

// Category routes
router.get("/category", Auth, CategoryController.get);
router.post("/category", Auth, CategoryController.create);
router.delete("/category/:id", Auth, CategoryController.delete);
router.patch("/category/:id", Auth, CategoryController.update);

// Product routes
router.get("/products", Auth, ProductsController.get);
router.post("/products", Auth, ProductsController.create);
router.patch("/products/:id", Auth, ProductsController.update);
router.delete("/products/:id", Auth, ProductsController.delete);

export default router;
