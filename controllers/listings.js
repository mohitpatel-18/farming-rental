// controllers/listings.js
const Listing = require('../models/listing'); // adjust path if needed
const { cloudinary } = require('../cloudinaryconfig');

// 🟢 Create New Listing Controller
module.exports.newlistingpostform = async (req, res, next) => {
  try {
    console.log('--- Create Listing POST ---');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { title, price, location, description } = req.body;
    const listingData = { title, price, location, description };

    // ✅ Handle uploaded image (if any)
    if (req.file) {
      listingData.image = {
        url: req.file.path || req.file.url || req.file.secure_url || '',
        filename: req.file.filename || ''
      };
    }

    // ✅ Save listing
    const listing = new Listing(listingData);
    await listing.save();

    req.flash('success', 'Listing created successfully!');
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error('Error creating listing:', err);
    next(err);
  }
};

