import express from "express";
import { login, signUp, updateUser } from "../controllers/user.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/update-user", authenticate, updateUser);
router.post("/signup", signUp);
router.post("/login", login);

export default router;

