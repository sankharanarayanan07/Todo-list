// Importing express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

// Creating an instance of the express application
const app = express();
app.use(express.json())
app.use(cors())

//To for store the values of the todo items
//let todos = [];   

//conneting mongodb
mongoose.connect('mongodb://0.0.0.0:27017/mydatabase')
.then(() => {
    console.log('DB connected')
})
.catch((err) => {
    console.log(err)
})

//creating schema 
const todoschema = new mongoose.Schema({
    title: {
        required: true,//to make title as compulsory one 
        type: String
    },
    description: String
})
 
//creating a model
const todomodel = mongoose.model('todo', todoschema);

//create a new todo item(To get all item)
app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
    try {
        const newtodo = new todomodel({title,description});
        await newtodo.save();
        res.status(201).json(newtodo);
    } catch (error) {
        console.log(error)
        res.status(500).jason({message: error.message});// to notife the user that the error was occure and show in frontend
    }

    
})

//Get all items(To show all item)
app.get('/todos', async (req, res) => {
    try {
        const todos = await todomodel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).jason({message: error.message});// to notife the user that the error was occure and show in frontend
    }

})

//Update a todo item(To update a value)
app.put('/todos/:id',async (req, res) => {
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedtodo = await todomodel.findByIdAndUpdate(
            id,
            {title, description},
            { new: true}
       )
       if (!updatedtodo) {
           return res.status(404).json({ message: "Todo not found"})
       }
       res.json(updatedtodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});// to notife the user that the error was occure and show in frontend
    }
})

//delete a todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});// to notife the user that the error was occure and show in frontend
    }

})


// Defining the port and starting the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
