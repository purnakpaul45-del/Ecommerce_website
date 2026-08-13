import express from "express"
import {placeOrder,placeOrderStripe, placeOrderRazorpay,allorders,userOrders,updateStatus} from "../controllers/orderControllers.js"
import adminAuth from "../middleware/adminauth.js"
import authUser from "../middleware/auth.js"
 const orderRouter=express.Router()
 //admin features
 orderRouter.post("/list",adminAuth,allorders)
 orderRouter.post("/status",adminAuth,updateStatus)
// payment features
orderRouter.post("/place",authUser,placeOrder)
orderRouter.post("/stripe",authUser,placeOrderStripe)
orderRouter.post("/razorpay",authUser,placeOrderRazorpay)
//user features
orderRouter.post("/userorders",authUser,userOrders)
export default orderRouter