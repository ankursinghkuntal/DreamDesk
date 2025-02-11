import Company from "../models/Company.js"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js"
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplications.js"

// register  a new company
export const registerCompany = async (req, res) => {

    console.log("registerCompany");

    const { name, email, password } = req.body

    const imageFile = req.file

    if(!name || !email || !password || !imageFile){
        return res.json({success:false, message: "All fields are required"})
    }

    try {
        
        const companyExists = await Company.findOne({email})

        if(companyExists){
            return res.json({success: false, message: "Company already exists"})
        }

         const salt = await bcrypt.genSalt(10)
         const hashPassword = await bcrypt.hash(password,salt)

         const imageUpload = await cloudinary.uploader.upload(imageFile.path)
         const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
         })

         res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
            token: generateToken(company._id)
         })   

    } catch (error) {
        console.error(error.message)
        res.json({success: false, message: "Server Error"})
        
    }

}

// Company login
export const loginCompany = async (req, res) => {

    console.log("loginCompany");
    const { email, password } = req.body;

    try {
        // Check if company exists
        const company = await Company.findOne({ email });

        if (!company) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        // Correctly compare hashed password
        const isMatch = await bcrypt.compare(password, company.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        // If valid, send response with JWT token
        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
            token: generateToken(company._id),
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get company data
export const getCompanyData = async (req, res) => {
    console.log("getCompanyData");
    try {
        
        const company = req.company;
        res.json({success: true, company})

    } catch (error) {
        res.json({
            success: false, 
            message: error.message
        });
    }

}

// Post a new job
export const postJob = async (req, res) => {

    console.log("postJob");
    const { title, description, location, salary, level, category } = req.body;

    
    const companyId =req.company._id;

    if (!companyId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    console.log("Company ID:", companyId, { title, description, location, salary, level, category });

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category,
        });

        await newJob.save();
        res.status(201).json({ success: true, message: "Job Posted" });

    } catch (error) {
        console.error("Error Posting Job:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// Get Company Job Applicants
export const getCompanyJobApplicants = async (req, res) => {

}

// Get Poated Jobs
export const getCompanyPostedJobs = async (req, res) => {
    console.log("getCompanyPostedJobs");

    try {
        const companyId = req.company._id;

        const jobs = await Job.find({ companyId });

        // Adding number of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => { // ✅ Corrected `Promise.all()`
            const applicants = await JobApplication.find({ jobId: job._id });
            return { ...job.toObject(), applicants: applicants.length };
        }));

        res.json({ success: true, jobsData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Change Job Application Status
export const ChangeJobApplicationStatus = async (req, res) => {

}

// Change Job Visibility
export const changeVisibility = async (req, res) => {
    console.log("changeVisibility");
    
    try {
        const { id } = req.body;
        console.log("Job ID:", id);

        if (!req.company || !req.company._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const companyId = req.company._id;
        console.log("Company ID:", companyId);
        const job = await Job.findById(id);

        console.log("Job:", job);
        
        if (!job) {
            return res.status(404).json({ success: false, message: "Job Not Found" });
        }

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible;
            await job.save();
            res.json({ success: true, job });
        } else { 
            return res.status(403).json({ success: false, message: "Forbidden: You do not own this job" });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

