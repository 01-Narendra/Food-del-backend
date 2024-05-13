import express from 'express'
import authMiddleware from '../middlewares/auth.js'
import { listOrders, placeOrder, updatStatus, userOrders, verifyOrder } from '../controllers/order.controller.js';

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder)
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/userorders", authMiddleware, userOrders)
orderRouter.get("/list", listOrders)
orderRouter.post("/status", updatStatus)

export default orderRouter

