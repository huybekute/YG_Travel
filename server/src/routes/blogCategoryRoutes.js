import blogCategoryController from "../controllers/blogCategoryController.js";
import express from "express";
import checkRole from "../middleware/checkRole.js"
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router()

router.delete('/:id', blogCategoryController.deleteCategory);
router.get('/', blogCategoryController.getBlogCategories)
router.get('/:slug', blogCategoryController.getCategoryBySlug);
router.post('/', verifyToken, checkRole("ADMIN"), blogCategoryController.createCategory);

export default router;