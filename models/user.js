const mongoose = require("mongoose");
const Hotel = require("./hotel");
const Room = require("./room");
const { Schema } = mongoose;
const Role = require("../helpers/role")

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, default: Role.User },
  hotels: { type: [Hotel.schema] },
  reservations: { type: [Room.schema] },
});

const User = mongoose.model("User", UserSchema);

//User.createIndexes();

module.exports = User; 