import { Webhook } from "svix";
import User from "../models/User.js";

// ✅ Clerk Webhook Handler
export const clerkWebhooks = async (req, res) => {
    try {
        console.log("🔔 Clerk Webhook Triggered");

        // ✅ Ensure Clerk Webhook Secret is Set
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            throw new Error("CLERK_WEBHOOK_SECRET is missing in environment variables.");
        }

        // ✅ Create Svix Webhook Instance
        const jsvix = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // ✅ Extract Raw Body & Headers
        const payload = req.rawBody; // Make sure rawBody is set in middleware
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // ✅ Verify Webhook Signature
        const event = jsvix.verify(payload, headers);
        console.log("✅ Webhook Verified:", event);

        // ✅ Extract Webhook Type & Data
        const { data, type } = event; // Fix: Extract correctly

        console.log("📌 Webhook Event Type:", type);
        console.log("📌 Webhook Data:", data);

        switch (type) {
            case "user.created": {
                console.log("🟢 Creating new user in MongoDB...");
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                    resume: "",
                };
                await User.create(userData);
                console.log("✅ User Created:", userData);
                res.status(201).json({ message: "User Created" });
                break;
            }

            case "user.updated": {
                console.log("🟡 Updating user in MongoDB...");
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                console.log("✅ User Updated:", userData);
                res.status(200).json({ message: "User Updated" });
                break;
            }

            case "user.deleted": {
                console.log("🔴 Deleting user from MongoDB...");
                await User.findByIdAndDelete(data.id);
                console.log("✅ User Deleted:", data.id);
                res.status(200).json({ message: "User Deleted" });
                break;
            }

            default:
                console.log("⚠️ Unhandled Webhook Event:", type);
                res.status(400).json({ message: "Unhandled Webhook Event" });
                break;
        }
    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        res.status(400).json({ success: false, message: "Invalid Signature or Webhook Error" });
    }
};
