import express from "express";
import { createAdviser } from "../controllers/AdviserController";
const router = express.Router();

router.post("/api/v1/adviser", createAdviser);

export default router;
