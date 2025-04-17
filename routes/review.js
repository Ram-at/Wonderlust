const express = require("express")  
const router = express.Router({ mergeParams: true }); 

const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controller/review.js")
const { validateReview , isLoggedIn, isReviewAuthor} = require("../middlewares/middleware.js");


 

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));




 module.exports = router;