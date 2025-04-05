const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Fake in-memory database (Key-Value Store)
const fakeDatabase = {};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve frontend files

// Function to generate a 7-character unique string
function generateUniqueString() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let uniqueStr = "";
    for (let i = 0; i < 7; i++) {
        uniqueStr += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return uniqueStr;
}

// **Endpoint to generate a short URL**
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        return res.status(400).json({ message: "Long URL is required!" });
    }

    // Check if URL already exists
    for (const key in fakeDatabase) {
        if (fakeDatabase[key] === longUrl) {
            return res.json({ shortKey: key }); // Return existing shortKey
        }
    }

    // Generate new short key
    const shortKey = generateUniqueString();
    fakeDatabase[shortKey] = longUrl;

    res.json({ shortKey });
});

// **Redirect from short URL to long URL**
app.get('/:shortKey', (req, res) => {
    const { shortKey } = req.params;

    if (fakeDatabase[shortKey]) {
        res.redirect(fakeDatabase[shortKey]);
    } else {
        res.status(404).send("❌ Invalid or expired short URL!");
    }
});

// **Start Server**
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
