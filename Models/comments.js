const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema= new Schema({
    
        title: String,
        body: String
        
    
});

const Comment = mongoose.model("Comments",CommentSchema);

module.exports= Comment;