const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')
const Schema = mongoose.Schema

mongoose.connect('mongodb://127.0.0.1/logregister')
.then(()=>{
  console.log('Connected to database');
})
.catch((error)=>{
  console.log("Some error occured : ".error);
})

const userSchema = new Schema({
  username:{
    type:String,
    required:true,
    unique:true,
  },
  name:{
    type:String,
    required:true
  },
  password:String,
  email:{
    type:String,
    required:true,
    unique:true,
  },
})

userSchema.plugin(plm)

module.exports = mongoose.model('User',userSchema)
