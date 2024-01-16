const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
});

const Watch = mongoose.model("Watchlist", {
  media_type: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
});

// CORS setup for development
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Watchlist Routes

app.post("/watchlist", async (req, res) => {
  try {
    const { media_type, id, userEmail } = req.body;

    const existingMovie = await Watch.findOne({ userEmail, id });
    if (existingMovie) {
      await Watch.deleteMany({
        id: existingMovie.id,
        userEmail: existingMovie.userEmail,
      });
      return res
        .status(201)
        .json({ removedmovie: "Movie removed successfully" });
    } else {
      const newWatch = new Watch({ media_type, id, userEmail });
      await newWatch.save();
      return res
        .status(201)
        .json({ message: "Movie added successfully.", added_id: id });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: "An error occurred in adding/removing movie",
        error: error.message,
      });
  }
});

app.post("/getdata", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const watchlist = await Watch.find(
      { userEmail },
      { media_type: 1, id: 1, _id: 0 }
    );

    if (watchlist.length === 0) {
      return res
        .status(401)
        .json({ nodata: "There is no data in your Watchlist" });
    } else {
      return res.json({ message: "Got data successfully", watchlist });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred.", error: error.message });
  }
});

app.post("/initialdata", async (req, res) => {
  try {
    const { userEmail } = req.body;
    const watchlist = await Watch.find({ userEmail }, { id: 1, _id: 0 });

    if (watchlist.length === 0) {
      return res.json({ nodata: "No initial data" });
    } else {
      const datalist = watchlist.map((item) => item.id);
      return res.json({ message: "Got data successfully", datalist });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred.", error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
