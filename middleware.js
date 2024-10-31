const Listing = require("./models/listing")

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req);
        req.session.redirectUrl = req.originalUrl; // Save the current URL to session
        req.flash("error", "You must be logged in to create a new listing");
        return res.redirect("/login"); // Redirect to login
    }
    next(); // If authenticated, proceed
};

// Middleware to save the redirect URL
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Save it to locals
        delete req.session.redirectUrl; // Clear the redirectUrl from session
    }
    next();
};



module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params; // Get the id from request parameters
    const listing = await Listing.findById(id); // Find the listing by id

    // Check if the listing exists
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings"); // Redirect if the listing doesn't exist
    }
    // Check if the current user is the owner of the listing
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit this listing.");
        return res.redirect(`/listings/${id}`); // Redirect if not the owner
    }
    next(); 
};

const Review = require("./models/review"); // Ensure you import your Review model

module.exports.isReviewAuthor = async (req, res, next) => {
    const { review_id } = req.params;  // Ensure you're using the correct param
    const review = await Review.findById(review_id);  // Find the review by the correct ID

    // Check if the current user is the author of the review
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to delete this review.");
        return res.redirect(`/listings/${req.params.id}`);  // Redirect to the listing page
    }
    next();  // Proceed if everything is correct
};

