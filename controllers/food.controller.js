import foodModel from "../models/food.model.js";
import fs from 'fs'


// add food item
const addFood = async(req,res) => {

    let image_filename = `${req.file.filename}`
    const food = new foodModel({
        description: req.body.description,
        price: req.body.price,
        name: req.body.name,
        category: req.body.category,
        image: image_filename
    })

    try {
        await food.save()
        res.json({success: true, message: "Food Added successfully"})
    } catch (error) {
        console.log("Error occur during adding food", error);
        res.json({success: false})
    }

}

// add food list
const listFood = async(req,res) => {
    try {
        const foods = await foodModel.find({})
        res.json({success:true, data:foods})
    } catch (error) {
        console.log("error occcur during food listing", error);
        res.json({success:false})
    }
}

// remove food item
const removeFood = async(req, res) => {
    try {
        const food = await foodModel.findById(req.body.id)
        // remove image from uploads folder
        fs.unlink(`uploads/${food.image}`, () => {})
        // delete the item from database
        await foodModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Food Item removed successfully"})

    } catch (error) {
        console.log("error occur during removing the food", error);
        res.json({success:false})
    }
}


export {addFood,listFood,removeFood}