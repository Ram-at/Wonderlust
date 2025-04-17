const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
  let allData = await Listing.find();
  res.render("listing/index.ejs", { allData });
}
module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
}

module.exports.postRoute = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename}
    await newListing.save();
    req.flash("success", "New Listing Created Successfully !!");
    res.redirect("/listings");
  }
  module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({ path: "review", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you are trying to access does not exist");
      return res.redirect("/listings");
    }

    res.render("listing/show.ejs", { listing });
  }
  module.exports.deleteListings = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Deleted Successfully !!");
    res.redirect("/listings");
  }
  module.exports.updateListings = async (req, res) => {
    let { id } = req.params;
   let listing =   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename}
    await listing.save()
   }
    req.flash("success", "Updated Successfully !!");
    res.redirect(`/listings/${id}`);
  }
  module.exports.renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the listing
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // Original image URL with width adjustment
        const originalImageUrl = listing.image.url.replace(
            "/upload", 
            "/upload/w_250"
        );
        
        // Blurred version of the image (Cloudinary transformation)
        const blurredImageUrl = listing.image.url.replace(
            "/upload", 
            "/upload/e_blur:300,w_250"  // 300px blur radius + width
        );
        
        res.render("listing/edit.ejs", { 
            listing, 
            originalImageUrl,
            blurredImageUrl  // Pass blurred version to template
        });
        
    } catch (err) {
        req.flash("error", "Failed to load edit form");
        console.error("Error rendering edit form:", err);
        res.redirect("/listings");
    }
};