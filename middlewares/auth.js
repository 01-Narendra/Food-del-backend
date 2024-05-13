import jwt from 'jsonwebtoken'

const authMiddleware = async(req,res,next) => {
    const {token} = req.headers;
    if(!token) {
        return res.status(401).json({
            success:false,
            message:"Not Authorized Login Again"
        })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = tokenDecode.id;
        next()
    } catch (error) {
        console.log("error occur during auth middleware");
        return res.json({message:false, message:"Error !!"})
    }

}

export default authMiddleware