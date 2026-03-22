import express from "express";
import blogController from "../controllers/blogController.js";
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/upload.js"

const router = express.Router();

router.get("/detail/:slug", blogController.getBlogDetail);
router.post("/", verifyToken, upload.single('thumbnail') , blogController.createBlog);
router.get("/", blogController.getBlogs);      
router.put("/:id", verifyToken, checkRole("ADMIN"),upload.single('thumbnail'), blogController.updateBlog);
router.delete("/:id", verifyToken,checkRole("ADMIN"), blogController.deleteBlog);
router.get("/admin/all", verifyToken, checkRole("ADMIN"), blogController.getBlogForAdmin);
router.put("/status/:id", verifyToken, checkRole("ADMIN"), blogController.updateBlogStatus);

export default router;