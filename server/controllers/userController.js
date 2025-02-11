import JobApplication from "../models/JobApplications.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';
import { getAuth } from "@clerk/express";

// get user data
export const getUserData = async (req, res) => {
    console.log("🔍 Fetching User Data...");

    try {
        // ✅ Extract authentication data
        const { userId } = getAuth(req);

        if (!userId) {
            console.log("❌ Unauthorized access attempt.");
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        console.log("📌 Authenticated User ID:", userId);

        // ✅ Fetch user from MongoDB
        const user = await User.findById(userId);

        if (!user) {
            console.log("❌ User not found in MongoDB:", userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("✅ User found:", user);
        res.json({ success: true, user });

    } catch (error) {
        console.error("❌ Error fetching user:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
// apply for a job
export const applyForJob = async (req, res) => {

    console.log("applyForJob");

    const {jobId} = req.body;
    const userId = req.auth.userId;

    try {
        
        const isAlreadyApplied = await JobApplication.findOne({ jobId,userId });

        if(isAlreadyApplied.length > 0){
            return res.json({
                success: false,
                message: "Already applied for this job"
            })
        }

        const jobData = await Job.findById(jobId);

        if(!jobData){
            return res.json({
                success: false,
                message: "Job not found"
            })
        }

        await JobApplication.create({ 
            companyId: jobData.companyId,
            userId, 
            jobId,
            date : Date.now() 
        });

        res.json({success: true, message: "Applied for job"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }

}

// get user applied applications
export const getUserJobApplications = async (req, res) => {

    console.log("getUserJobApplications");

    try {
        
        const userId = req.auth.userId;

        const applications = await JobApplication.find({userId})
        .populate('companyId', 'name email image')
        .populate('jobId', 'title description location salary level category')
        .exec();

        if (!applications) {
            return res.json({
                success: false,
                message: "No job applications found for this user."
            }) 
        }

        return res.json({success: true, applications})

    } catch (error) {
        res.json({success: false, message: error.message})
        
    }

}

// update user profile (resume)
export const updateUserResume = async (req, res) => {

    console.log("updateUserResume");

    try {
        
        const userId = req.auth.userId;

        const resumeFile = req.file;

        const userData = await User.findById(userId);

        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
            userData.resume = resumeUpload.secure_url;
        }

        await userData.save();

        return res.json({success: true, message: "Resume Updated"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }

}