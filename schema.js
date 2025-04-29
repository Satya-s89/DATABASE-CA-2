const mongoose = require("mongoose");

const bookModel = mongoose.Schema({
    title:{type:String,required:true},
    auther:{type:String,required:true},
    genre:{type:String,required:true},
    publishedYear:{type:Number},
    availableCopies:{type:Number,required:true},
    borrowedBy:{type:String}
});

const BOOKSSCHEMA = mongoose.model("BooksModel",bookModel);

module.exports = BOOKSSCHEMA;