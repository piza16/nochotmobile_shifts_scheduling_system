import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect,checkObjectId, getOrderById);
router.route("/:id/pay").put(protect,checkObjectId, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin,checkObjectId, updateOrderToDelivered);

export default router;
