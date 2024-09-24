import express from "express";
import {getAllUsers, getUserById, createUser, updateUser, deleteUser, loginUser, enrichAndSendUser} from '../controllers/userController.js';
const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/"id', deleteUser);
router.post('/login', loginUser);
router.post('/enrich/:userId', enrichAndSendUser);

export default router;