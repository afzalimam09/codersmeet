import { Router } from "express";
import {
    activate,
    protect,
    sendOTP,
    verifyOTP,
    refresh,
    logout,
} from "./authController.js";

const router = Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/activate", protect, activate);
router.get("/refresh", refresh);
router.post("/logout", logout);

export default router;
