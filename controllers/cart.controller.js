import userModel from '../models/user.model.js'


// add item to user cart
const addToCart = async(req,res) => {
    try {
        let userData = await userModel.findOne({_id:req.body.userId});
        let cartData = await userData.cartData;

        if(!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({
            success: true,
            message: "Added To Cart"
        })
    } catch (error) {
        console.log("error occur during add to cart", error);
        return res.json({success:false, message: "Error !"})
    }
}

// remove item from user cart
const removeFromCart = async(req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;

        if(cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, {cartData})
        res.json({
            success: true,
            message: "Removed from cart"
        })
    } catch (error) {
        console.log("error occur during remove from cart", error);
        return res.json({success: false, message:"Error !!"})
    }
}

// fetch user's cart
const getCart = async(req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData

        return res.json({
            success: true,
            cartData:cartData,
        })

    } catch (error) {
        console.log("error occur during fetching the cart data", error);
        return res.json({success: false, message: "Error !!"})
    }
}

export {addToCart, removeFromCart, getCart}