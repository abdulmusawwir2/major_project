const Listing = require("./models/listing")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req);
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login"); 
    }
    next(); 
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
        delete req.session.redirectUrl; 
    }
    next();
};



module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params; 
    const listing = await Listing.findById(id);

    
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings"); 
    }
    
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit this listing.");
        return res.redirect(`/listings/${id}`); 
    }
    next(); 
};

const Review = require("./models/review"); 

module.exports.isReviewAuthor = async (req, res, next) => {
    const { review_id } = req.params;  
    const review = await Review.findById(review_id);  

    
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to delete this review.");
        return res.redirect(`/listings/${req.params.id}`);  
    }
    next();  
};

