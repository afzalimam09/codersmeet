import { Router } from "express";

import authRoute from "./auth/authRoute.js";
import roomsRoute from "./rooms/roomsRoute.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/rooms", roomsRoute);

export default router;
