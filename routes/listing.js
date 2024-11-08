const express=require("express");
const router = express.Router();
const Listing = require("../models/listing");
const {isLoggedIn, isOwner} =  require("../middleware");
const multer = require('multer')
const {storage} = require("../cloudConfig")
const upload = multer({ storage })

//mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

//index route
router.get("/",async (req,res)=>{
    const allListings =await Listing.find({})
    res.render("listings/index.ejs",{allListings})
});

//new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get('/:id', async(req,res)=>{
    let {id}=req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path:"author",
      },
    } )
    .populate("owner");
 if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
}
  res.render("listings/show.ejs",{listing})  
})

//Create Route
router.post("/", upload.single('listing[image]'), isLoggedIn, async (req, res, next) => {

  const geocodingClient = mbxGeocoding({ accessToken: mapToken });
 let response = await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location, 
    limit: 1                        
  })
    .send()
  console.log(response);

  
  if (!req.file) {
    req.flash("error", "Image upload failed");
    return res.redirect("/listings/new");
  }
  // const { path: url, filename } = req.file;
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
});


//edit Route
router.get("/:id/edit",  isLoggedIn,  isOwner, async (req, res) => {
    let {id}=req.params;
    const listing=await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
})

//Update Route
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), async (req, res, next) => {
    let { id } = req.params;

    try {
        let listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        if (req.file) {
            if (listing.image && listing.image.filename) {
                await cloudinary.uploader.destroy(listing.image.filename); 
            }

            // Set new image details
            const { path: url, filename } = req.file;
            listing.image = { url, filename };
        }

        listing.title = req.body.listing.title;
        listing.description = req.body.listing.description;
        listing.price = req.body.listing.price;
      listing.location = req.body.listing.location;
      
        await listing.save();

        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);

    } catch (err) {
        req.flash("error", "Error updating the listing. Please try again.");
        res.redirect("/listings");
    }
});

  
//delete Route
  router.delete("/:id",  isLoggedIn,  isOwner, async (req, res) => {

    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash("success", "Listing deleted")
    res.redirect("/listings")
  })

module.exports = router;