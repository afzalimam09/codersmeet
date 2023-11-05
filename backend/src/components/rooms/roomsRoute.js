import { Router } from "express";
import { createRoom, getAllRooms, getSingleRoom } from "./roomsController.js";
import { protect } from "../auth/authController.js";

const router = Router();

router.post("/", protect, createRoom);
router.get("/", protect, getAllRooms);
router.get("/:roomId", protect, getSingleRoom);

export default router;
