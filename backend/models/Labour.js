const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  photoUrl: {
    type: String,
    default: '',
  },
  governmentId: {
    type: String,
    trim: true,
    default: '',
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED'],
    default: 'PENDING',
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
labourSchema.index({ phone: 1 });
labourSchema.index({ verificationStatus: 1 });

const Labour = mongoose.model('Labour', labourSchema);

module.exports = Labour;

