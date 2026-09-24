// // const { createHash } = require("node:crypto")

// // const input = "Hello Node.js crypto!"



// // // sha-256 digest in hexadecimal
// // const sha256Hex = createHash("sha256")
// //     .update(input)
// //     .digest("hex");
// // console.log("SHA-256 (HEX): ", sha256Hex)

// // // sha-256 digest in base64
// // const sha256Base64 = createHash("sha256")
// //     .update(input)
// //     .digest("base64");
// // console.log("SHA-256 (base64):", sha256Base64)



// // const md5Hex = createHash('md5')
// //     .update(input)
// //     .digest('hex');

// // console.log("MD5 (hex):",md5Hex);


// const jwt = require('jsonwebtoken');


// const user = { id: 'xxxxx', role: 'Abhishek Mehata' };

// // const token = jwt.sign(user, '@|>hi', { expiresIn: '5m' });
// // console.log(token);
// payload = {
//     name:"Abhishek",
//     role:["ADMIN", "USER"]
// }



// const token = jwt.sign(payload, 'u3H6%$9hG!sK@d2L8zXp', { expiresIn: '15m' });
// // 'u3H6%$9hG!sK@d2L8zXp' is a key
// console.log(token)




const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const User = require('./models/User');  // Assuming you have a User model



const app = express();
app.use(express.json());
app.use(cookieParser());
const secretKey = 'your-secret-key'; // Strong secret key for signing JWT

// Connect to MongoDB (example)
mongoose.connect('mongodb://localhost:27017/yourdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Login Route to Authenticate and Generate Token
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }); // Find the user in the database

        if (!user || user.password !== password) { // Password check
            return res.status(401).send('Invalid credentials');
        }

        // Create JWT Payload
        const payload = { username: user.username, uuid: user._id };

        // Sign JWT
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Token expires in 1 hour

        // Store JWT in a cookie
        res.cookie('auth_token', token, {
            httpOnly: true,   // Only accessible via HTTP request, not JavaScript
            secure: process.env.NODE_ENV === 'production',  // Only over HTTPS in production
            maxAge: 3600 * 1000 // Cookie expiration time (1 hour)
        });

        res.send('Logged in successfully!');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

