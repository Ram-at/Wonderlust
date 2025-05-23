const Listing = require("../models/listing")
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
  
    const newReview = new Review(req.body.review);
   
    newReview.author = req.user._id;
   
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created Successfully !!")
    res.redirect(`/listings/${listing._id}`);
}
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted Successfully !!")
    res.redirect(`/listings/${id}`);
}