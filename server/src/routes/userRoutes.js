import userControllers from "../controllers/userControllers.js"
import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router()

router.post('/signup', userControllers.signup); 
router.post('/login', userControllers.login);

router.get('/', verifyToken, checkRole("admin") ,userControllers.getAllUsers);
router.get('/:id', verifyToken, userControllers.getUser);
router.put('/:id', verifyToken, userControllers.updateUser);
router.delete('/:id', verifyToken, checkRole("admin"),userControllers.deleteUser);
router.post('/createUser', verifyToken, checkRole("admin"), userControllers.createUser);

export default router