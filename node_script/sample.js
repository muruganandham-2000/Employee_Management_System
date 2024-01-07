const mongoose = require('mongoose');

// Define the leave schema
const leaveSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    days: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
});

// Create a Mongoose model based on the schema, specifying the collection name as 'leaves'
const Leave = mongoose.model('Leave', leaveSchema, 'leaves');

// Connecting to MongoDB
const uri = "mongodb+srv://muruganandham5080:gmafPArN0Ns3yo2m@cluster0.ipyesgr.mongodb.net/EmployeeSphere?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(async () => {
    // Insert a new leave record
    const newLeave = new Leave({
        email: 'example@example.com',
        name: 'John Doe',
        reason: 'Vacation',
        status: 'Pending',
        date: '2024-01-10',
        days: '5',
        user: '6596fbe1484c411abf2d4490', // Replace this with an existing user ObjectId
        // Add other fields as needed
      });
      
      // Save the leave record to the database
      await newLeave.save();
      console.log('Leave record created successfully!');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
