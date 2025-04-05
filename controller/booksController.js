

import Book from "../models/books.js";
import { HttpError } from "../helpers/errors/httpError.js";
import { validationResult } from "express-validator";

//  Create new books

export const addNewBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return next(HttpError.invalidInputs())
        } else {

            const { title, author, isbn, publishedYear, availableCopies } = req.body

            // const { userId, userRole } = req.userData

            // if (userRole !== 'admin') {

            //     return next(HttpError.unauthorized())
            // } else {

            const newBookAdd = new Book({
                title, author, isbn, publishedYear, availableCopies
            })

            await newBookAdd.save()

            if (!newBookAdd) {

                return next(HttpError.invalidCredential())
            } else {
                res.status(200).json({
                    status: true,
                    access_token: null,
                    data: null,
                    message: 'books added successfully'
                })
            }
            // }
        }
    } catch (error) {
        console.log(error)

        return next(HttpError.internalServer())
    }
}

// /update book

export const updateBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return next(HttpError.invalidInputs())
        } else {

            const { title, author, isbn, publishedYear, availableCopies } = req.body

            // const { userId, userRole } = req.userData
            const bookId = req.params.bookId;

            const updatesAttributes = {
                title, author, isbn, publishedYear, availableCopies
            }

            const response = await Book.findOneAndUpdate({ _id: bookId }, updatesAttributes)

            if (!response) {

                return next(HttpError.invalidCredential())
            } else {
                res.status(200).json({
                    status: true,
                    access_token: null,
                    data: null,
                    message: 'Book updated successfully'
                })
            }

        }
    } catch (error) {
        consoleIt(error)
        return next(HttpError.internalServer())
    }
}

// list all books with search functionality
// export const listAllBooks = async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return next(HttpError.invalidInputs());
//         }

//         let { page = 0, limit = 10, search = "" } = req.query;

//         console.log("🔍 Query Params:", req.query);

//         const pageNumber = parseInt(page);
//         const pageSize = parseInt(limit);
//         const skip = pageNumber * pageSize;

//         const filter = {};

//         if (search.trim()) {
//             const searchRegex = new RegExp(search.trim(), "i");
//             filter.$or = [
//                 { title: { $regex: searchRegex } },
//                 { author: { $regex: searchRegex } }
//             ];
//         }

//         console.log("🔎 Filter Used:", filter);

//         const [books, total] = await Promise.all([
//             Book.find(filter).skip(skip).limit(pageSize),
//             Book.countDocuments(filter)
//         ]);

//         console.log("📚 Books Found:", books.length);

//         return res.status(200).json({
//             success: true,
//             data: books,
//             pagination: {
//                 total,
//                 page: pageNumber,
//                 page_size: pageSize,
//                 has_more: skip + books.length < total
//             }
//         });

//     } catch (error) {
//         console.error("❌ Error in listAllBooks:", error);
//         return next(HttpError.internalServer());
//     }
// };

export const listAllBooks = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(HttpError.invalidInputs());
        }
        let { page = 0, limit = 10, search = '' } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const matchStage = {};

        if (search.trim()) {
            const searchQuery = search.toLowerCase();
            matchStage.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { author: { $regex: searchQuery, $options: "i" } },
            ];

        }

        const pipeline = [
            { $match: matchStage },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    author: 1,
                    isbn: 1,
                    publishedYear: 1,
                    availableCopies	:1,
                    // createdAt: 1,
                    // updatedAt: 1
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ];

        const response = await Book.aggregate(pipeline);
        const totalCount = await Book.countDocuments(matchStage);


        return res.status(200).json({
            status: true,
            message: "Books fetched successfully",
            access_token: null,
            data: {
                books: response,
                totalCount
            }
        });
    } catch (error) {
        consoleIt(error);
        return next(HttpError.internalServer());
    }
};

export const removeBook = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(HttpError.invalidInputs());
        }

        const bookId = req.params.bookId;
        const { userId, userRole } = req.userData;

        // Only admin can delete books

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return next(HttpError.notFound('Book not found'));
        }

        // Remove the book
        await Book.findByIdAndDelete(bookId);

        return res.status(200).json({
            status: true,
            message: 'Book removed successfully',
        });

    } catch (error) {
        console.log(error);
        return next(HttpError.internalServer());
    }
};