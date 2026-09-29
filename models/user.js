const { Schema, model } = require("mongoose")
const { randomBytes, createHmac } = require("node:crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/avatar.jpg"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
}, { timestamps: true });




// --------
// 

userSchema.pre("save", function () {
    const user = this // this points to the current user

    // password is not modified
    if (!user.isModified("password")) {
        return
    }


    const salt = randomBytes(16).toString("hex");

    const hashedPwd = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPwd;

});





userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) throw new Error("User not found")

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");


    if (hashedPassword !== userProvidedHash) throw new Error("Incorrect Password")

    // return { ...user._doc, password: undefined, salt: undefined }

    const token =  createTokenForUser(user)
    return token;
});
// in future - any route you can use it
// User.matchPassword(email,password) ....
// you can see this example in routes/user.js - login POST request

const user = model("user", userSchema);
module.exports = user