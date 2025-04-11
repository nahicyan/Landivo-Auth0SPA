import express from "express";
import {
  getAllBuyerLists,
  getBuyerList,
  createBuyerList,
  updateBuyerList,
  deleteBuyerList,
  addBuyersToList,
  removeBuyersFromList,
  sendEmailToList
} from "../controllers/buyerListCntrl.js";

const router = express.Router();

// Get all buyer lists
router.get("/", getAllBuyerLists);

// Get a specific buyer list with its members
router.get("/:id", getBuyerList);

// Create a new buyer list
router.post("/", createBuyerList);

// Update a buyer list
router.put("/:id", updateBuyerList);

// Delete a buyer list
router.delete("/:id", deleteBuyerList);

// Add buyers to a list
router.post("/:id/add-buyers", addBuyersToList);

// Remove buyers from a list
router.post("/:id/remove-buyers", removeBuyersFromList);

// Send email to list members
router.post("/:id/send-email", sendEmailToList);

export { router as buyerListRoute };