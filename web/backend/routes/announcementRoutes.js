import express from "express";
import {
  create,
  getCurrent,
  getHistory,
  update,
  remove,
} from "../controllers/announcementController.js";

const router = express.Router();

router.post("/announcement", (req, res, next) => {
  create(req, res, next);
});

router.get("/announcement", (req, res, next) => {
  getCurrent(req, res, next);
});

router.get("/announcements", (req, res, next) => {
  getHistory(req, res, next);
});

router.put("/announcement/:id", (req, res, next) => {
  update(req, res, next);
});

router.delete("/announcement/:id", (req, res, next) => {
  remove(req, res, next);
});

export default router;
