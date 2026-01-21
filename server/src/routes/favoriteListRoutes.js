import express from "express"
import favoriteListController from "../controllers/favoriteListController.js"

const router = express.Router();

router.get("/stats", favoriteListController.getAllFavorite);

export default router;