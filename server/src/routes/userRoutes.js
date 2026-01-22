import userControllers from "../controllers/userControllers.js"
import express from "express"
import verifyToken from "../middleware/verifyToken.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router()

router.post('/signup', userControllers.signup); 
router.post('/login', userControllers.login);

router.get('/countUser', userControllers.countUser);
router.get('/' , verifyToken, checkRole("ADMIN"), userControllers.getAllUsers);
router.get('/:id', verifyToken, checkRole("ADMIN"), userControllers.getUser);
router.put('/:id', verifyToken, userControllers.updateUser);
router.delete('/:id', verifyToken, checkRole("ADMIN"),userControllers.deleteUser);
router.post('/createUser', verifyToken, checkRole("ADMIN"), userControllers.createUser);
router.put('/updatePassword/:id', verifyToken, checkRole("ADMIN"), userControllers.updatePassword)


export default router