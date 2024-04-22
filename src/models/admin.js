const mongoose=require('mongoose');
const { buffer } = require('stream/consumers');
const adminSchema=new  mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    
    },
    email:{
        type:String,
        required:true,
    }
}, {timestamps: false});
const Admin=mongoose.model(`AdminLogin`,adminSchema);
const addImage = new mongoose.Schema({
    name: {
        type: String,
    },
    img: {
        data: Buffer,
        contentType: String 
    }
});

const Image = mongoose.model('image',addImage)
module.exports={Admin,Image}