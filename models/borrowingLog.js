import mongoose from "mongoose";

// import mongooseUniqueValidator from "mongoose-unique-validator";

const borrowingLogSchema = new mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        borrowDate: {
            type: Date,
            required: true
        },
        returnDate: {
            type: Date,
            required: true
        },
        actualReturnDate:{
            type: Date,
            default:null
        }
    },
    {
        timestamps: true,
    }
);

const BorrowingLog = mongoose.model("BorrowingLog", borrowingLogSchema);

export default BorrowingLog;  