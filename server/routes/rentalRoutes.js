import { Router } from "express";
import {
  createRental,
  getRentals,
  getRentalById,
  updateRental,
  deleteRental,
  rentEquipment,
  returnRental,
  getRentalsByUser,
} from "../controllers/rentalController.js";

const router = Router();

router.post("/rent", rentEquipment);

router.post("/:id/return", returnRental);

router.get("/user/:userId", getRentalsByUser);

router.post("/", createRental);
router.get("/", getRentals);
router.get("/:id", getRentalById);
router.put("/:id", updateRental);
router.delete("/:id", deleteRental);

export default router;
