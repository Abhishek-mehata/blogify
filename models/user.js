const { Schema, model } = require("mongoose")
const { randomBytes, createHmac } = require("node:crypto")

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
        default: "./public/avatar.jpg"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
}, { timestamps: true });




// --------
// 

userSchema.pre("save", async function (next) {
    const user = this // this points to the current user

    // user is not modified
    if (!user.isModified("password")) {
        return next
    }


    const salt = randomBytes(16).toString("hex");

    const hashedPwd = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPwd;

    // do stuff
    next
});





userSchema.static("matchPassword", async function (email, password) {
    const user = await this.findOne({ email })
    if (!user) throw new Error("User not found")

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");


    if (hashedPassword !== userProvidedHash) throw new Error("Incorrect Password")

    return { ...user._doc, password: undefined, salt: undefined }
})




const user = model("user", userSchema);
module.exports = user