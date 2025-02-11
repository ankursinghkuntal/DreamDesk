import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {

    console.log("protectCompany");
    const token = req.headers.token || req.get("token"); // ✅ Correct way

    // console.log(token)

    if(!token){
        return res.json({success: false, message: "Not Authorized, Login again"})
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.company = await Company.findById(decoded.id).select("-password");

        if (!req.company) {
            return res.status(401).json({ success: false, message: "Unauthorized: Company Not Found" });
        }

        next();

    } catch (error) {
        res.json({success: false, message: error.message})
    }

};
