const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const CONNECTION_STRING = "mongodb+srv://admin:admin@cluster0.uxjzqe0.mongodb.net/?retryWrites=true&w=majority";; // Replace with your MongoDB connection string
const DATABASE_NAME = "todoappdb";
let database;

MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    database = client.db(DATABASE_NAME);
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.get('/api/todoapp/tasks', async (req, res) => {
  try {
    const result = await database.collection("todoappcollection").find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post('/api/todoapp/tasks', async (req, res) => {
  try {
    const { newNotes } = req.body;
    if (!newNotes) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const numOfDocs = await database.collection("todoappcollection").countDocuments();
    const insertResult = await database.collection("todoappcollection").insertOne({
      id: (numOfDocs + 1).toString(),
      description: newNotes
    });

    if (insertResult.insertedCount === 1) { // Check if a document was inserted
      res.status(201).json("Added Successfully");
    } else {
      res.status(500).json({ error: "An error occurred while inserting the document" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete('/api/todoapp/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const deleteResult = await database.collection("todoappcollection").deleteOne({
      id
    });

    if (deleteResult.deletedCount === 1) {
      res.json("Deleted Successfully");
    } else {
      res.status(404).json("Task not found");
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
app.put('/api/todoapp/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { updatedNotes } = req.body;

    if (!id || !updatedNotes) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const updateResult = await database.collection("todoappcollection").updateOne(
      { id },
      { $set: { description: updatedNotes } }
    );

    if (updateResult.modifiedCount === 1) {
      res.json("Updated Successfully");
    } else {
      res.status(404).json("Task not found");
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});


const port = 5039; // Use a port of your choice
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
