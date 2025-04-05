import express from 'express'
import authRouter from '../routes/v1/user/authRoutes.js'
// import bookRouter from '../routes/v1/bookRoutes.js'
import { addNewBook, listAllBooks, removeBook, updateBook } from '../controller/booksController.js'
import { borrowBook, returnBook, viewBorrowingHistory } from '../controller/borrowingController.js'
// import userRouter from '../routes/v1/user/userRoutes.js'
import userAuthCheck from "../middlewares/authCheck.js";


const userApis = express()

userApis.use(authRouter)

// userApis(userRouter)

// books managment

userApis.use(userAuthCheck)

userApis.get('/books',listAllBooks)

userApis.post('/books', addNewBook)

userApis.put('/books/:bookId', updateBook)

userApis.delete('/books/:bookId', removeBook)


// userApis.delete('/books',)
// userApis.get('books/search',)

// borrowing managment

userApis.post('/borrow/:bookId', borrowBook)

userApis.post('/return/:bookId', returnBook)

userApis.get('/borrow/history', viewBorrowingHistory)



export default userApis