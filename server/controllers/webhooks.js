import { Webhook } from "svix";
import User from "../models/User.js"; // ✅ MongoDB User Model

export const clerkWebhooks = async (req, res) => {
    try {
        console.log("🔔 Clerk Webhook Triggered");

        // ✅ Ensure rawBody is passed correctly
        const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = req.rawBody;  
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        // ✅ Verify Webhook Signature
        const event = svix.verify(payload, headers);
        console.log("📌 Webhook Received:", event.type, event.data);

        const { data, type } = event;

        switch (type) {
            case "user.created":
                console.log("🟢 Storing new user data...");
                await User.create({
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "N/A",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                });
                break;

            case "user.updated":
                console.log("🟡 Updating user data...");
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses?.[0]?.email_address || "N/A",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                });
                break;

            case "user.deleted":
                console.log("🔴 Deleting user...");
                await User.findByIdAndDelete(data.id);
                break;

            default:
                console.log("⚠️ Unhandled webhook event:", type);
        }

        res.status(200).json({ success: true, message: "Webhook processed" });

    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        res.status(403).json({ success: false, message: "Webhook Verification Failed" });
    }
};
