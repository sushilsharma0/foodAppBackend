const mongoose = require("mongoose");

const buyProductSchema = new mongoose.Schema({
    product_details:{
        type: [String]
    },
    userId:{
        type:String
    },
    userName:{
        type:String
    },
    full_name:{
        type:String,
    },
    address:{
        type:String,
    },
    city:{
        type:String,
    },
    state_province:{
        type:String,
    },
    postal_code:{
        type:String
    }
},{
    timestamps: true
});

const buyProductModel = mongoose.model("Buy-detail" , buyProductSchema);

module.exports = buyProductModel;