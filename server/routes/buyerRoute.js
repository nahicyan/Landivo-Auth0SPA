// server/routes/buyerRoute.js
import express from "express";
import { 
  makeOffer, 
  getOffersByBuyer, 
  getOffersOnProperty, 
  createVipBuyer,
  createBuyer,
  getAllBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
  // Email-related endpoints
  getBuyersByArea,
  sendEmailToBuyers,
  importBuyersFromCsv,
  getBuyerStats
} from "../controllers/buyerCntrl.js";
import { getBuyerByAuth0Id } from '../controllers/buyerCntrl.js';
import { 
  jwtCheck, 
  extractUserFromToken, 
  checkPermissions 
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes - No authentication required
router.post("/makeOffer", makeOffer);
router.get("/offers/property/:propertyId", getOffersOnProperty);
router.get("/offers/buyer", getOffersByBuyer);

// Protected routes - with permissions
// VIP Buyer creation (may be done by regular users)
router.post("/createVipBuyer", createVipBuyer);

// Routes requiring buyer read permission
router.get("/byAuth0Id", jwtCheck, extractUserFromToken, getBuyerByAuth0Id);
router.get("/all", jwtCheck, extractUserFromToken, checkPermissions(['read:buyers']), getAllBuyers);
router.get("/:id", jwtCheck, extractUserFromToken, checkPermissions(['read:buyers']), getBuyerById);
router.get("/byArea/:areaId", jwtCheck, extractUserFromToken, checkPermissions(['read:buyers']), getBuyersByArea);
router.get("/stats", jwtCheck, extractUserFromToken, checkPermissions(['read:buyers']), getBuyerStats);

// Routes requiring buyer write permission
router.post("/create", jwtCheck, extractUserFromToken, checkPermissions(['write:buyers']), createBuyer);
router.put("/update/:id", jwtCheck, extractUserFromToken, checkPermissions(['write:buyers']), updateBuyer);
router.post("/import", jwtCheck, extractUserFromToken, checkPermissions(['write:buyers']), importBuyersFromCsv);
router.post("/sendEmail", jwtCheck, extractUserFromToken, checkPermissions(['write:buyers']), sendEmailToBuyers);

// Routes requiring buyer delete permission
router.delete("/delete/:id", jwtCheck, extractUserFromToken, checkPermissions(['delete:buyers']), deleteBuyer);

export { router as buyerRoute };