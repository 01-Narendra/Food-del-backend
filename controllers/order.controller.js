
import orderModel from "../models/order.model.js";
import userModel from '../models/user.model.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async(req,res) => {

    const frontend_url = "https://nm-food.netlify.app";

    try {
        const newOrder = new orderModel({
            userId:  req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save()
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}})

        // for stripe payments
        const line_items = req.body.items.map( (item) => ({
            price_data: {
                currency: "INR",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price*100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "INR",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2*100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        return res.json({
            success: true,
            session_url: session.url
        })

    } catch (error) {
        console.log("error occur during placeorder", error);
        return res.json({success: false, message: "Error !!"})
    }

}

const verifyOrder = async(req,res) => {
    const {orderId, success} = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true})
            res.json({
                success:true,
                message:"Payment Successfully Done."
            })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({
                success:false,
                message:"Payment not done"
            })
        }
    } catch (error) {
        console.log("error occur during verify the order", error);
        res.json({success:false,message:"Error!!"})
    }
}

// user's oders for frontend
const userOrders = async(req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId}) 
        res.json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.log("error occur during userOrders",error);
        res.json({success:false, message:"Error"})
    }
}

// listing orders for admin panel
const listOrders = async(req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.log("error occur during listing orders for admin panel",error);
        res.json({success:false, message: "Error"})
    }
}

// api for updating order status
const updatStatus = async(req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status})
        return res.json({
            success: true,
            message:"status updated"
        })
    } catch (error) {
        console.log("error occur during status updating",error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updatStatus}
