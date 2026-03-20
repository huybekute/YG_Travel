import contactController from "../controllers/contactController.js";
import express from "express";
import checkRole from "../middleware/checkRole.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express()

router.post("/send", contactController.sendContact)
router.get("/all", verifyToken, checkRole('ADMIN'), contactController.getAllContacts);
router.put("/status/:id", verifyToken, checkRole('ADMIN'), contactController.updateStatus);
router.delete("/:id", verifyToken, checkRole('ADMIN'), contactController.deleteContact);

export default router;