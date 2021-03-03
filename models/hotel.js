const mongoose = require("mongoose");
const Room = require("./room");
const { Schema } = mongoose;

const HotelSchema = new Schema({
  name: { 
    type: String,
     required: true 
    },
  country: {
    type: String,
    required: false,
  },
  rooms: { 
    type: [Room.schema] 
  },
  managerId:{
    type: String
  }
});

const Hotel = mongoose.model("Hotel", HotelSchema);

module.exports = Hotel;
 