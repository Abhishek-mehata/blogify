const { Schema, model } = require("mongoose");


const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    coverImageUrl: {
        type: String,
        required: false
    },
    createdBy: { // this createdBy field will point directly towards user object
        type: Schema.Types.ObjectId,
        // Stores the User document's _id.
        // `ref: "user"` creates the relationship between Blog and User.
        ref: 'user'
    }
}, { timestamps: true });


const Blog = model("blog", blogSchema);


module.exports = Blog;