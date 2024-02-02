const express = require("express");
const router = express.Router();
const Message = require("../models/message.model")


router.post("/message" , async (req ,res)=>{
    try {
        const newMessage = new Message({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            phone_number:req.body.phone_number,
            message:req.body.message
        });

        const savedMessage = await newMessage.save();
        res.json(savedMessage)
    } catch (error) {
     res.json({ message: error.message})   
    }
})

module.exports = router;