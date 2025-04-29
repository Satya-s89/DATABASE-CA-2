const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const MONGOURI = process.env.MONGO_URI;
const PORT = process.env.PORT;
const Books = require('./schema');

app.post("/addBooks", async (req,res)=>{
    try {
    const {title,auther,genre,publishedYear,availableCopies,borrowedBy} = req.body;
    if(!title||!auther||!genre||!availableCopies){
        res.status(400).send({msg:"All fields required"});
    }
    const createdBooks = await Books.save({title,auther,genre,publishedYear,availableCopies,borrowedBy});
    res.status(200).send({msg:"Books added successfully"});
    } catch (error) {
        res.status(500).send({msg:"Internal sever error"});
    }
})

app.get('/',(req,res)=>{
    try {
        const BooksData = Books.find();
        res.status(200).send({msg:"Here are the books data:",BooksData});
    } catch (error) {
        res.status(500).send({msg:"Internal sever error"});
    }
})

app.put('/update/:title',async (req,res)=>{
    try {
        const {title} = req.body;
        if(!title){
            res.status(400).send({msg:"title is required for updating the data"});
        }
        const {auther,genre,publishedYear,availableCopies,borrowedBy} = req.body;
        const updatedData = await Books.findOneAndUpdate({auther,genre,publishedYear,availableCopies,borrowedBy});
        res.status(200).send({msg:"Book is updated sucessfully",updatedData});
    } catch (error) {
        res.status(500).send({msg:"Internal sever error"});
    }
})

app.delete('/delete/:title',async (req,res)=>{
    try {
        const {title} = req.body;
        if(!title){
            res.status(400).send({msg:"title is required for updating the data"});
        }
        if(!Books.find(title)){
            res.status(404).send({msg:"Title not found"});
        }
        const deletedItem = await Books.findOneAndDelete({title,auther,genre,publishedYear,availableCopies,borrowedBy});
        res.status(200).send({msg:"Item Deleted Successfully",deletedItem});
    } catch (error) {
        res.status(500).send({msg:"Internal sever error"});
    }
})

mongoose.connect(MONGOURI)
.then((e)=>{console.log("Mongodb connected sucessfully")})
.catch((err)=>{console.log(err)})

app.listen(PORT,()=>{
    console.log(`Server connected successfully on 4000`);
})