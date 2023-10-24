const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    default: "user",
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: "",
    required: false,
  },
  totalReport: {
    type: Number,
    default: 0,
    required: false,
  },
});

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
