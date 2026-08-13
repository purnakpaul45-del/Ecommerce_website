
import express from "express";

import {
  getCustomers,
} from "../controllers/customerController.js";

const customerRouter = express.Router();

// ======================================================
// GET ALL CUSTOMERS
// ======================================================

customerRouter.get(
  "/all",
  getCustomers
);

export default customerRouter;

