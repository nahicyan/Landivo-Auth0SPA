import express from 'express';
import { 
    createResidency, 
    getAllResidencies, 
    getResidency, 
    updateResidency, 
    getResidencyImages, 
    createResidencyWithMultipleFiles 
} from '../controllers/residencyCntrl.js';
import { upload } from '../config/multerConfig.js';
import { jwtCheck, extractUserFromToken, checkRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/allresd", getAllResidencies);
router.get("/:id", getResidency);
router.get("/:id/image", getResidencyImages);

// Protected routes - accessible to Admins and Agents
router.post("/create", jwtCheck, extractUserFromToken, checkRoles(['Admin', 'Agent']), createResidency);
router.post("/createWithFile", jwtCheck, extractUserFromToken, checkRoles(['Admin', 'Agent']), upload.array("images", 10), createResidencyWithMultipleFiles);
router.put("/update/:id", jwtCheck, extractUserFromToken, checkRoles(['Admin', 'Agent']), upload.array("images", 10), updateResidency);

export { router as residencyRoute };