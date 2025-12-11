const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

// 1. Define the User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    // Optional: Add a creation date
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// 2. Pre-Save Hook (Middleware) for Password Hashing
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt (random string) and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 3. Export the Model
const User = mongoose.model('User', UserSchema);
module.exports = User;
