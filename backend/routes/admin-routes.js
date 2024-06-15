import express from "express";
import {
  addAdmin,
  adminLogin,
  getAdminById
} from "../controllers/admin-controller.js";

const adminRouter = express.Router();

adminRouter.post("/add", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/:id", getAdminById);

export default adminRouter;
