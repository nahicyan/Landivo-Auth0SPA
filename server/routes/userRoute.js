import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers
} from "../controllers/userCntrl.js";
import { jwtCheck, extractUserFromToken, checkRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected route - only accessible to Admins
router.get("/all", jwtCheck, extractUserFromToken, checkRoles(['Admin']), getAllUsers);

export { router as userRoute };