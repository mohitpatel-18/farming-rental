// controllers/listings.js
const Listing = require('../models/listing'); // adjust path if needed
const { cloudinary } = require('../cloudinaryconfig'); // ensure this file exists and exports cloudinary + storage

// List all listings
module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    // render 'listings/index' with allListings (adjust view name if different)
    return res.render('listings/index', { allListings, title: 'All Listings' });
  } catch (err) {
    console.error('Error in index:', err);
    return next(err);
  }
};

// Render new listing form
module.exports.newlistingform = (req, res) => {
  try {
    return res.render('listings/new', { title: 'Create Listing' });
  } catch (err) {
    console.error('Error rendering new listing form:', err);
    return res.status(500).send('Server error');
  }
};

// Handle create listing POST
module.exports.newlistingpostform = async (req, res, next) => {
  try {
    console.log('--- Create Listing POST ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { title, price, location, description } = req.body;
    const listingData = { title, price, location, description };

    if (req.file) {
      // multer-storage-cloudinary usually fills req.file.path and req.file.filename
      listingData.image = {
        url: req.file.path || req.file.secure_url || req.file.url || '',
        filename: req.file.filename || ''
      };
    }

    const listing = new Listing(listingData);
    await listing.save();

    req.flash('success', 'Listing created successfully!');
    return res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error('Error creating listing:', err);
    return next(err);
  }
};

// Render edit listing form
module.exports.editlistingform = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }
    return res.render('listings/edit', { listing, title: 'Edit Listing' });
  } catch (err) {
    console.error('Error in edit listing form:', err);
    return next(err);
  }
};

// Handle update listing (PUT)
module.exports.editlistingpostform = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body || {};

    // If file uploaded, update image info
    if (req.file) {
      updateData.image = {
        url: req.file.path || req.file.secure_url || req.file.url || '',
        filename: req.file.filename || ''
      };
    }

    const updated = await Listing.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!updated) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    req.flash('success', 'Listing updated successfully!');
    return res.redirect(`/listings/${updated._id}`);
  } catch (err) {
    console.error('Error updating listing:', err);
    return next(err);
  }
};

// Delete listing
module.exports.deltelisting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }

    // Optionally delete image from cloudinary if you stored filename
    if (deleted.image && deleted.image.filename) {
      try {
        await cloudinary.uploader.destroy(deleted.image.filename);
      } catch (e) {
        console.warn('Could not delete image from Cloudinary:', e);
      }
    }

    req.flash('success', 'Listing deleted');
    return res.redirect('/listings');
  } catch (err) {
    console.error('Error deleting listing:', err);
    return next(err);
  }
};

// Show details of a listing
module.exports.showlistingdetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listings');
    }
    return res.render('listings/show', { listing, title: listing.title || 'Listing Details' });
  } catch (err) {
    console.error('Error showing listing details:', err);
    return next(err);
  }
};

