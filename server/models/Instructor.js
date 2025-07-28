const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [100, 'Department cannot exceed 100 characters']
  },
  office: {
    type: String,
    required: [true, 'Office is required'],
    trim: true,
    maxlength: [50, 'Office cannot exceed 50 characters']
  },
  phone: {
    type: String,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  specialization: {
    type: [String],
    default: []
  },
  officeHours: {
    type: String,
    maxlength: [200, 'Office hours cannot exceed 200 characters']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name formatting
instructorSchema.virtual('displayName').get(function() {
  return this.name;
});

// Index for efficient searches
instructorSchema.index({ department: 1 });
instructorSchema.index({ email: 1 });
instructorSchema.index({ name: 'text', department: 'text' });

module.exports = mongoose.model('Instructor', instructorSchema);
