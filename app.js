const express=require("express");
const app=express();
const mongoose = require('mongoose');
const Listing=require("./models/listing");
const path=require("path");
const methodOverride = require('method-override')


app.set( "view engine", "ejs" ); 
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

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

// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new  Listing({
//         title:"My Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Malpe beach",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucessfull testing");
// });

//index route
app.get("/listings",async (req,res)=>{
    const allListings =await Listing.find({})
    res.render("listings/index.ejs",{allListings})
})

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})


//show route
app.get('/listings/:id', async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    res.render("listings/show.ejs",{listing})  
})

app.post("/listings",async(req,res)=>{
    let newListing=new Listing(req.body.listing);
    await newListing.save()
    res.redirect("/listings")
})

app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
})

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listining})
    res.redirect("/listining") 
})



 








app.listen(3000,()=>{
    console.log("server is listening")
})