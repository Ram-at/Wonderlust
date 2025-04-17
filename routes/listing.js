const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })
const listingController = require("../controller/listings.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middlewares/middleware.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.postRoute));
  

// New route
router.get("/new", isLoggedIn, listingController.renderNewForm);
// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    
    wrapAsync(listingController.updateListings)
  )
  .get(wrapAsync(listingController.showListings))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListings));

module.exports = router;
