import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", auth, getMe);

export default router;
