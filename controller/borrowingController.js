

// borrowing new book

import Book from "../models/books.js";
import BorrowingLog from "../models/borrowingLog.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose"


export const borrowBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return next(HttpError.invalidInputs())
        } else {

            const { userId } = req.userData

            console.log(req.userData, 'user data...!')

            // const { booking_id:bookId, user_id:userId } = req.body

            const bookId = req.params.bookId;

            //  Find the book
            const book = await Book.findById(bookId);
            if (!book) {
                return next(HttpError.notFound('Book not found'));
            }

            console.log(book.availableCopies, 'copyyyy')
            // Check available copies
            if (book.availableCopies <= 0) {
                return next(HttpError.invalidCredential('No available copies left'));
            }

            // Create BorrowingLog entry
            const now = new Date();
            const returnDate = new Date(now);
            returnDate.setDate(now.getDate() + 14); // 14 days later

            const borrowingLog = new BorrowingLog({
                bookId,
                user: userId,
                borrowDate: now,
                returnDate
            });

            await borrowingLog.save();

            //  Update book's available copies
            book.availableCopies = Number(book.availableCopies) - 1;
            await book.save();

            //  Respond success
            return res.status(200).json({
                status: true,
                data: {
                    bookTitle: book.title,
                    borrowDate: now,
                    returnDate
                },
                message: 'Book borrowed successfully',
            });
        }
    } catch (error) {
        console.log(error)

        return next(HttpError.internalServer())
    }
}

export const returnBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return next(HttpError.invalidInputs())
        } else {

            const { userId } = req.userData

            const bookId = req.params.bookId;

            // Find the borrowing log
            const borrowingLog = await BorrowingLog.findOne({
                bookId,
                user: userId,
                returnDate: { $gt: new Date() } // meaning not yet returned
            });

            if (!borrowingLog) {
                return next(HttpError.notFound("Borrowing record not found or already returned."));
            }

            // Update return date to current
            borrowingLog.actualReturnDate = new Date();
            await borrowingLog.save();

            // Update available copies of the book
            const book = await Book.findById(bookId);
            if (!book) {
                return next(HttpError.notFound("Book not found."));
            }

            book.availableCopies += 1;
            await book.save();

            return res.status(200).json({
                status: true,
                message: "Book returned successfully"
            });
        }
    } catch (error) {
        console.log(error)

        return next(HttpError.internalServer())
    }
}

// view borrowing history
export const viewBorrowingHistory = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(HttpError.invalidInputs());
        }

        const { userId, userRole } = req.userData;

        console.log(userId, 'userid')

        let logs;

        if (userRole === 'admin') {
            // Admin: fetch all borrowing logs
            logs = await BorrowingLog.find({})
                .populate('bookId', 'title author isbn')
                .populate('user', 'name email role')
                .sort({ createdAt: -1 }); // recent first
        } else {
            logs = await BorrowingLog.find({ user: userId })
                .populate('bookId', 'title author isbn')
                .sort({ createdAt: -1 });
        }


        return res.status(200).json({
            status: true,
            count: logs.length,
            data: logs,
            message: 'Borrowing history retrieved successfully',
        });
    } catch (error) {
        console.log(error);
        return next(HttpError.internalServer());
    }
};


