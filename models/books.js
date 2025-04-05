import mongoose from "mongoose";

// import mongooseUniqueValidator from "mongoose-unique-validator";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        isbn: {
            type: String,
            required: true
        },
        publishedYear: {
            type: String,
            required: true
        },
        availableCopies: {
            type: Number,
            required: true,
            default: 0, // optional fallback
        },
      
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;