const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');



const app = express();
const port = 5039; 

const CONNECTION_STRING = "mongodb+srv://admin:admin@cluster0.uxjzqe0.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware setup
app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from the localhost where your frontend is hosted
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Use task routes
app.use('/api', taskRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
