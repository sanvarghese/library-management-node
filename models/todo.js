import mongoose from "mongoose";

// import mongooseUniqueValidator from "mongoose-unique-validator";

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            // required: true
            default:'pending'
        },
    },
    {
        timestamps: true,
    }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;