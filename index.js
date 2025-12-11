// 1. IMPORT PACKAGES AND MODEL
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User'); // Import the User model

// Initialize Express App
const app = express();
// Codespaces usually runs on port 3000 or 8080.
const PORT = process.env.PORT || 3000; 

// 2. CONNECT TO DATABASE
// Retrieves the secure connection string from Codespaces' Environment Variables
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// 3. MIDDLEWARE
// Middleware to parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. SERVE STATIC PWA FILES
// This serves the HTML, CSS, and JS files from the root directory
app.use(express.static(path.join(__dirname))); 

// 5. IMPLEMENT REGISTRATION LOGIC
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body; // Extract user data from the form

    try {
        // Check if user already exists by email
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).send('User already exists. Please login.');
        }

        // Create a new user instance (password will be automatically hashed)
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Send success message
        res.status(201).send('Registration successful! You can now log in.'); 

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).send('Server error during registration.');
    }
});

// 6. START THE SERVER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
      
