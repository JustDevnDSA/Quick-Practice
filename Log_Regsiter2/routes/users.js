const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const Schema = mongoose.Schema;

mongoose
  .connect("mongodb://127.0.0.1/logregistr2")
  .then(() => {
    console.log("Connected to mongoDB successfully !!");
  })
  .catch((error) => {
    console.log("ERROR ! Not connected to mongoDB");
  });

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    required: true,
    type: String,
  },
  password: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
