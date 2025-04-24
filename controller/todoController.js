import { validationResult } from "express-validator";
import Todo from "../models/todo.js";

export const addNewTodo = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return next(HttpError.invalidInputs())
        } else {

            const { title, description, status } = req.body

            console.log(req.body, "req from create todo")

            const newTodoAdd = new Todo({
                title, description, status: status || 'pending'

            })

            await newTodoAdd.save()

            if (!newTodoAdd) {

                return next(HttpError.invalidCredential())
            } else {
                res.status(200).json({
                    status: true,
                    access_token: null,
                    data: null,
                    message: 'Todo added successfully'
                })
            }
        }
    } catch (error) {
        console.log(error)

        return next(HttpError.internalServer())
    }
}

// /update book


export const updateTodo = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return next(HttpError.invalidInputs())
        } else {

            const { title, description, status } = req.body


            // const { userId, userRole } = req.userData
            const todoId = req.params.id;

            const updatesAttributes = {
                title, description, status
            }

            const response = await Todo.findOneAndUpdate({ _id: todoId }, updatesAttributes)

            if (!response) {

                return next(HttpError.invalidCredential())
            } else {
                res.status(200).json({
                    status: true,
                    access_token: null,
                    data: null,
                    message: 'Todo updated successfully'
                })
            }

        }
    } catch (error) {
        consoleIt(error)
        return next(HttpError.internalServer());
    }
}


export const listAllTodos = async (req, res, next) => {
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

        // if (search.trim()) {
        //     const searchQuery = search.toLowerCase();
        //     matchStage.$or = [
        //         { title: { $regex: searchQuery, $options: "i" } },
        //         { author: { $regex: searchQuery, $options: "i" } },
        //     ];

        // }

        const pipeline = [
            { $match: matchStage },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,

                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ];

        const response = await Todo.find({});
        const totalCount = await Todo.countDocuments(matchStage);


        return res.status(200).json({
            status: true,
            message: "Books fetched successfully",
            access_token: null,
            data: {
                response,
                // totalCount
            }
        });
    } catch (error) {
        return next(HttpError.internalServer());
    }
};

export const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo); // Directly return the todo object
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const removeTodo = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(HttpError.invalidInputs());
        }

        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await Todo.findByIdAndDelete(todo);
        res.status(200).json({ message: 'Todo removed successfully' });

    } catch (error) {
        console.log(error);
        return next(HttpError.internalServer());
    }
};