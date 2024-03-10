const express=require("express");
const app=express();
const mongoose = require('mongoose');
const Listing=require("./models/listing")

main()
.then(()=>{
    console.log("connected to database")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

app.get("/",(req,res)=>{
    res.send("root working")
})

app.get("/testListing",async (req,res)=>{
    let sampleListing = new  Listing({
        title:"My Villa",
        description:"By the beach",
        price:1200,
        location:"Malpe beach",
        country:"India"
    })
    await sampleListing.save();
    console.log("sample was saved");
    res.send("sucessfull testing");
});

app.listen(3000,()=>{
    console.log("server is listening")
})