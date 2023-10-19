const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const MongoClient = require("mongodb").MongoClient;


const app = express();
const port = 5039; 

const CONNECTION_STRING = "mongodb+srv://admin:admin@cluster0.uxjzqe0.mongodb.net/?retryWrites=true&w=majority";; // Replace with your MongoDB connection string

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Use task routes
app.use('/api', taskRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
