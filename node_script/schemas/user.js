const mongoose = require('./db');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  profile_image: String,
  experience: String,
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  qualification: String,
  department: String,
  position: String,
  address: String,
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
  },
});

module.exports = mongoose.model('User', userSchema);
