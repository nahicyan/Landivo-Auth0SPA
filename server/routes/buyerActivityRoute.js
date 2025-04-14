// server/routes/buyerActivityRoute.js
import express from "express";
import { 
  recordBuyerActivity,
  getBuyerActivity,
  getBuyerActivitySummary,
  deleteBuyerActivity
} from "../controllers/buyerActivityCntrl.js";
import { 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions 
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for recording activity (POST /api/buyer/activity)
router.post(
  "/activity", 
  jwtCheck, 
  extractUserFromToken, 
  recordBuyerActivity
);

// Route for getting all activity for a buyer (GET /api/buyer/activity/:buyerId)
router.get(
  "/activity/:buyerId", 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions(['read:buyers']), 
  getBuyerActivity
);

// Route for getting activity summary for a buyer (GET /api/buyer/activity/:buyerId/summary)
router.get(
  "/activity/:buyerId/summary", 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions(['read:buyers']), 
  getBuyerActivitySummary
);

// Route for deleting activity records (DELETE /api/buyer/activity/:buyerId)
router.delete(
  "/activity/:buyerId", 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions(['delete:buyers']), 
  deleteBuyerActivity
);

export { router as buyerActivityRoute };