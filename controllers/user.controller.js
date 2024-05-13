import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt, { compare } from 'bcrypt'
import validator from 'validator'
import { decrypt } from "dotenv";


const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}


// register user
const registerUser = async(req, res) => {
    const { name, email, password } = req.body;
    try {

        // checking the existed user
        const existName = await userModel.findOne({name})
        const existEmail = await userModel.findOne({email})

        if (existName) {
            return res.json({success: false, message:"User is already with this name"})
        }
        if (existEmail) {
            return res.json({success: false, message:"User is already with this email"})
        }

        // validating email format and password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter valid email"})
        }
        if (password.length < 8) {
            return res.json({success:false, message:"Please enter strong password"})
        }

        // encrypting the user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newUser = userModel({
            name: name,
            email: email,
            password: hashedPassword
        })
        const user = await newUser.save()


        const token = createToken(user._id)
        return res.json(
            {
                success:true,
                token,
                message: "User Registered Succcessfully"
            }
        )

    } catch (error) {
        console.log("error during registering user",error);
        return res.json({success:false, message:"Error!! Register User"})
    }
}


// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter valid email"})
        }

        // checking if user is registered or not 
        const registered = await userModel.findOne({email})
        if(!registered) {
            return res.json({success: false, message:"User is not Registered yet"})
        }

        // checking password
        const isPasswordCorrect = await bcrypt.compare(password,registered.password);
        if(!isPasswordCorrect) {
            return res.status(401)
            .json({success:false, message:"Password Incorrect"})
        }

        const token = createToken(registered._id);
        return res.json({success: true,token, message:"User login successfully"})

    } catch (error) {
        console.log("error occur during login", error);
        return res.json({success:false, message:"Login Failed"})
    }
}


export {loginUser, registerUser}