const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location:String,
    country:String,
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;