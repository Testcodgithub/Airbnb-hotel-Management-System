const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} =require("./schema.js");

module.exports.isLoggedIn = (req, res, next) =>{
    
     if(!req.isAuthenticated()){
       req.session.redirectUrl = req.originalUrl;
       req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl =(req, res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, res, next) =>{
  let { id } = req.params;
    let listing = await  Listing.findById(id);
    // if( ! listing.owner.equals(res.locals.currUser._id)){
       if (!listing.owner.equals(req.user._id)) {
       req.flash("error", "You don't have permission to edit");
       return res.redirect(`/listings/${id}`);
    }
  + next();
}

// module.exports.isOwner = async (req, res, next) => {
//   try {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);

//     if (!listing) {
//       req.flash("error", "Listing not found.");
//       return res.redirect("/listings");
//     }

//     if (!listing.owner.equals(req.user._id)) {
//       req.flash("error", "You don't have permission to edit this listing.");
//       return res.redirect(`/listings/${id}`);
//     }

//     next(); // ✅ Must be here
//   } catch (err) {
//     next(err); // In case DB call throws error
//   }
// };

// const isOwner = async (req, res, next) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing.owner.equals(req.user._id)) {
//     req.flash('error', 'You do not have permission to do that!');
//     return res.redirect(`/listings/${id}`);
//   }
//   next();
// };


module.exports.isReviewAuthor = async (req, res, next) =>{
  let { id, reviewId  } = req.params;
    let review = await  Review.findById(reviewId);
    if( ! review.author.equals(res.locals.currUser._id)){
       req.flash("error", "You are not the author of this review");
       return res.redirect(`/listings/${id}`);
    }
    next();
};