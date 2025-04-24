import express from 'express'
import { addNewTodo, getTodo, listAllTodos, removeTodo, updateTodo } from '../controller/todoController.js';


const todoApis = express()

todoApis.get('/todos/',listAllTodos)

todoApis.get('/todos/:id', getTodo)

todoApis.post('/todos/', addNewTodo)

todoApis.put('/todos/:id',  updateTodo)

todoApis.delete('/todos/:id', removeTodo)

export default todoApis