const express=require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js")
const Listing = require("../models/listing");
const { isLoggedIn ,isReviewAuthor} = require("../middleware.js");

router.get("/", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate('reviews'); // Populate reviews if necessary
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing }); // Render the show view for listings
});

//Reviews
//Post route  
router.post("/", isLoggedIn,async (req, res) => { 
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
     req.flash("success", "New Review  Added");

    res.redirect(`/listings/${listing._id}`);
})

//reviews
//delete route 
router.delete("/:review_id",  isLoggedIn, isReviewAuthor, async (req, res) => {
    let { id, review_id } = req.params;  // Match the param to 
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
});

module.exports = router;