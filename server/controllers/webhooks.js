import { Webhook } from "svix";
import User from "../models/User.js";

// API CONTROLLER FUNCTION TO MANAGE CLERK USER WITH DATABASE

export const clerkWebhooks = async (req, res) => {
    try{

        // create a svix instance with the clerk webhook secret key
        const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // verifying headers 
        await Webhook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        //  getting data from request body
        const { data, type } = req.body;

        // switch case to handle different webhook types
        switch(type){
            case 'user.created':{
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }
                await User.create(userData);
                res.json({message: "User Created"});
                break;
            }

            case 'user.updated':{
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    image: data.image_url,
                }  
                await User.findByIdAndUpdate(data.id, userData);
                res.json({message: "User Updated"});  
                break;           
            }

            case 'user.deleted':{
                await User.findByIdAndDelete(data.id);
                res.json({message: "User Deleted"});
                break;
            }

            default:
                break;
        }

    }catch(error){
        console.error(error.message); 
        res.json({success: false, message:'Webhooks Error'}); 
    }
}
